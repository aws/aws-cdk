import * as cfnDiff from '@aws-cdk/cloudformation-diff';
import { ResourceDifference } from '@aws-cdk/cloudformation-diff';
import * as cxapi from '@aws-cdk/cx-api';
import * as chalk from 'chalk';
import * as fs from 'fs-extra';
import * as promptly from 'promptly';
import { CloudFormationDeployments, DeployStackOptions } from './api/cloudformation-deployments';
import { ResourceIdentifierProperties, ResourcesToImport } from './api/util/cloudformation';
import { error, print, success, warning } from './logging';

/**
 * Parameters that uniquely identify a physical resource of a given type
 * for the import operation, example:
 *
 * ```
 * {
 *   "AWS::S3::Bucket": ["BucketName"],
 *   "AWS::IAM::Role": ["RoleName"],
 *   "AWS::EC2::VPC": ["VpcId"]
 * }
 * ```
 */
export type ResourceIdentifiers = { [resourceType: string]: string[] };

/**
 * Mapping of CDK resources (L1 constructs) to physical resources to be imported
 * in their place, example:
 *
 * ```
 * {
 *   "MyStack/MyS3Bucket/Resource": {
 *     "BucketName": "my-manually-created-s3-bucket"
 *   },
 *   "MyStack/MyVpc/Resource": {
 *     "VpcId": "vpc-123456789"
 *   }
 * }
 * ```
 */
export type ResourceMap = { [logicalResource: string]: ResourceIdentifierProperties };

export interface ResourceImporterOptions {
  /**
   * Name of toolkit stack if non-default
   *
   * @default - Default toolkit stack name
   */
  readonly toolkitStackName?: string;
}

/**
 * Resource importing utility class
 *
 * - Determines the resources added to a template (compared to the deployed version)
 * - Look up the identification information
 *   - Load them from a file, or
 *   - Ask the user, based on information supplied to us by CloudFormation's GetTemplateSummary
 * - Translate the input to a structure expected by CloudFormation, update the template to add the
 *   importable resources, then run an IMPORT changeset.
 */
export class ResourceImporter {
  private _currentTemplate: any;

  constructor(
    private readonly stack: cxapi.CloudFormationStackArtifact,
    private readonly cfn: CloudFormationDeployments,
    private readonly options: ResourceImporterOptions = {}) { }

  /**
   * Ask the user for resources to import
   */
  public async askForResourceIdentifiers(available: ImportableResource[]): Promise<ImportMap> {
    const ret: ImportMap = { importResources: [], resourceMap: {} };
    const resourceIdentifiers = await this.resourceIdentifiers();

    for (const resource of available) {
      const identifier = await this.askForResourceIdentifier(resourceIdentifiers, resource);
      if (!identifier) {
        continue;
      }

      ret.importResources.push(resource);
      ret.resourceMap[resource.logicalId] = identifier;
    }

    return ret;
  }

  /**
   * Load the resources to import from a file
   */
  public async loadResourceIdentifiers(available: ImportableResource[], filename: string): Promise<ImportMap> {
    const contents = await fs.readJson(filename);

    const ret: ImportMap = { importResources: [], resourceMap: {} };
    for (const resource of available) {
      const descr = this.describeResource(resource.logicalId);
      const idProps = contents[resource.logicalId];
      if (idProps) {
        print('%s: importing using %s', chalk.blue(descr), chalk.blue(fmtdict(idProps)));

        ret.importResources.push(resource);
        ret.resourceMap[resource.logicalId] = idProps;
        delete contents[resource.logicalId];
      } else {
        print('%s: skipping', chalk.blue(descr));
      }
    }

    const unknown = Object.keys(contents);
    if (unknown.length > 0) {
      warning(`Unrecognized resource identifiers in mapping file: ${unknown.join(', ')}`);
    }

    return ret;
  }

  /**
   * Based on the provided resource mapping, prepare CFN structures for import (template,
   * ResourcesToImport structure) and perform the import operation (CloudFormation deployment)
   *
   * @param resourceMap Mapping from CDK construct tree path to physical resource import identifiers
   * @param options Options to pass to CloudFormation deploy operation
   */
  public async importResources(importMap: ImportMap, options: DeployStackOptions) {
    const resourcesToImport: ResourcesToImport = await this.makeResourcesToImport(importMap);
    const updatedTemplate = await this.currentTemplateWithAdditions(importMap.importResources);

    try {
      const result = await this.cfn.deployStack({
        ...options,
        overrideTemplate: updatedTemplate,
        resourcesToImport,
      });

      const message = result.noOp
        ? ' ✅  %s (no changes)'
        : ' ✅  %s';

      success('\n' + message, options.stack.displayName);
    } catch (e) {
      error('\n ❌  %s failed: %s', chalk.bold(options.stack.displayName), e);
      throw e;
    }
  }

  /**
   * Perform a diff between the currently running and the new template, enusre that it is valid
   * for importing and return a list of resources that are being added in the new version
   *
   * @return mapping logicalResourceId -> resourceDifference
   */
  public async discoverImportableResources(allowNonAdditions = false): Promise<DiscoverImportableResourcesResult> {
    const currentTemplate = await this.currentTemplate();

    const diff = cfnDiff.diffTemplate(currentTemplate, this.stack.template);

    // Ignore changes to CDKMetadata
    const resourceChanges = Object.entries(diff.resources.changes)
      .filter(([logicalId, _]) => logicalId !== 'CDKMetadata');

    // Split the changes into additions and non-additions. Imports only make sense
    // for newly-added resources.
    const nonAdditions = resourceChanges.filter(([_, dif]) => !dif.isAddition);
    const additions = resourceChanges.filter(([_, dif]) => dif.isAddition);

    if (nonAdditions.length) {
      const offendingResources = nonAdditions.map(([logId, _]) => this.describeResource(logId));

      if (allowNonAdditions) {
        warning(`Ignoring updated/deleted resources (--force): ${offendingResources.join(', ')}`);
      } else {
        throw new Error('No resource updates or deletes are allowed on import operation. Make sure to resolve pending changes ' +
                        `to existing resources, before attempting an import. Updated/deleted resources: ${offendingResources.join(', ')} (--force to override)`);
      }
    }

    // Resources in the new template, that are not present in the current template, are a potential import candidates
    return {
      additions: additions.map(([logicalId, resourceDiff]) => ({
        logicalId,
        resourceDiff,
        resourceDefinition: addDefaultDeletionPolicy(this.stack.template?.Resources?.[logicalId] ?? {}),
      })),
      hasNonAdditions: nonAdditions.length > 0,
    };
  }

  /**
   * Get currently deployed template of the given stack (SINGLETON)
   *
   * @returns Currently deployed CloudFormation template
   */
  private async currentTemplate(): Promise<any> {
    if (!this._currentTemplate) {
      this._currentTemplate = await this.cfn.readCurrentTemplate(this.stack);
    }
    return this._currentTemplate;
  }

  /**
   * Return teh current template, with the given resources added to it
   */
  private async currentTemplateWithAdditions(additions: ImportableResource[]): Promise<any> {
    const template = await this.currentTemplate();
    if (!template.Resources) {
      template.Resources = {};
    }

    for (const add of additions) {
      template.Resources[add.logicalId] = add.resourceDefinition;
    }

    return template;
  }

  /**
   * Get a list of import identifiers for all resource types used in the given
   * template that do support the import operation (SINGLETON)
   *
   * @returns a mapping from a resource type to a list of property names that together identify the resource for import
   */
  private async resourceIdentifiers(): Promise<ResourceIdentifiers> {
    const ret: ResourceIdentifiers = {};
    const resourceIdentifierSummaries = await this.cfn.resourceIdentifierSummaries(this.stack, this.options.toolkitStackName);
    for (const summary of resourceIdentifierSummaries) {
      if ('ResourceType' in summary && summary.ResourceType && 'ResourceIdentifiers' in summary && summary.ResourceIdentifiers) {
        ret[summary.ResourceType] = summary.ResourceIdentifiers;
      }
    }
    return ret;
  }

  private async askForResourceIdentifier(
    resourceIdentifiers: ResourceIdentifiers,
    chg: ImportableResource,
  ): Promise<ResourceIdentifierProperties | undefined> {
    const resourceName = this.describeResource(chg.logicalId);

    // Skip resources that do not support importing
    const resourceType = chg.resourceDiff.newResourceType;
    if (resourceType === undefined || !(resourceType in resourceIdentifiers)) {
      warning(`${resourceName}: unsupported resource type ${resourceType}, skipping import.`);
      return undefined;
    }

    const idProps = resourceIdentifiers[resourceType];
    const resourceProps = chg.resourceDefinition.Properties ?? {};

    const fixedIdProps = idProps.filter(p => resourceProps[p]);
    const fixedIdInput: ResourceIdentifierProperties = Object.fromEntries(fixedIdProps.map(p => [p, resourceProps[p]]));

    const missingIdProps = idProps.filter(p => !resourceProps[p]);

    if (missingIdProps.length === 0) {
      // We can auto-import this, but ask the user to confirm
      const props = fmtdict(fixedIdInput);

      if (!await promptly.confirm(
        `${chalk.blue(resourceName)} (${resourceType}): import with ${chalk.yellow(props)} (yes/no) [default: yes]? `,
        { default: 'yes' },
      )) {
        print(chalk.grey(`Skipping import of ${resourceName}`));
        return undefined;
      }
    }

    // Ask the user to provide missing props
    const userInput: ResourceIdentifierProperties = {};
    for (const missingIdProp of missingIdProps) {
      const response = (await promptly.prompt(
        `${chalk.blue(resourceName)} (${resourceType}): enter ${chalk.blue(missingIdProp)} to import (empty to skip):`,
        { default: '', trim: true },
      ));
      if (!response) {
        print(chalk.grey(`Skipping import of ${resourceName}`));
        return undefined;
      }
      userInput[missingIdProp] = response;
    }

    return {
      ...fixedIdInput,
      ...userInput,
    };
  }

  /**
   * Convert the internal "resource mapping" structure to CloudFormation accepted "ResourcesToImport" structure
   */
  private async makeResourcesToImport(resourceMap: ImportMap): Promise<ResourcesToImport> {
    return resourceMap.importResources.map(res => ({
      LogicalResourceId: res.logicalId,
      ResourceType: res.resourceDiff.newResourceType!,
      ResourceIdentifier: resourceMap.resourceMap[res.logicalId],
    }));
  }

  /**
   * Convert CloudFormation logical resource ID to CDK construct tree path
   *
   * @param logicalId CloudFormation logical ID of the resource (the key in the template's Resources section)
   * @returns Forward-slash separated path of the resource in CDK construct tree, e.g. MyStack/MyBucket/Resource
   */
  private describeResource(logicalId: string): string {
    return this.stack.template?.Resources?.[logicalId]?.Metadata?.['aws:cdk:path'] ?? logicalId;
  }
}

/**
 * Information about a resource in the template that is importable
 */
export interface ImportableResource {
  /**
   * The logical ID of the resource
   */
  readonly logicalId: string;

  /**
   * The resource definition in the new template
   */
  readonly resourceDefinition: any;

  /**
   * The diff as reported by `cloudformation-diff`.
   */
  readonly resourceDiff: ResourceDifference;
}

/**
 * The information necessary to execute an import operation
 */
export interface ImportMap {
  /**
   * Mapping logical IDs to physical names
   */
  readonly resourceMap: ResourceMap;

  /**
   * The selection of resources we are actually importing
   *
   * For each of the resources in this list, there is a corresponding entry in
   * the `resourceMap` map.
   */
  readonly importResources: ImportableResource[];
}

function fmtdict<A>(xs: Record<string, A>) {
  return Object.entries(xs).map(([k, v]) => `${k}=${v}`).join(', ');
}

/**
 * Add a default 'Delete' policy, which is required to make the import succeed
 */
function addDefaultDeletionPolicy(resource: any): any {
  if (resource.DeletionPolicy) { return resource; }

  return {
    ...resource,
    DeletionPolicy: 'Delete',
  };
}

export interface DiscoverImportableResourcesResult {
  readonly additions: ImportableResource[];
  readonly hasNonAdditions: boolean;
}
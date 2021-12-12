import * as cfnDiff from '@aws-cdk/cloudformation-diff';
import { ResourceDifference } from '@aws-cdk/cloudformation-diff';
import * as cxapi from '@aws-cdk/cx-api';
import * as colors from 'colors/safe';
import * as promptly from 'promptly';
import { CloudFormationDeployments, DeployStackOptions } from './api/cloudformation-deployments';
import { ResourceIdentifierProperties, ResourcesToImport } from './api/util/cloudformation';
import { debug, error, print, success } from './logging';

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

/**
 * Resource importing utility class
 *
 * For each resource that is added in the new template (compared to currently applied template):
 * - look up the identification information for the resource type (if not supported for import, remove resource from template)
 * - identify a physical resource to be imported as the respective CDK construct (logical resource)
 *   - this can either be inferred directly from logical resource parameters (e.g. S3 bucket with explicit bucket name set)
 *   - or user will be interactively queried to provide the respective information
 *   - or the identification information can be loaded from a file
 * - look up the physical resource (perhaps using cloud control API?) and validate it
 *   - if not found, fail "resource to be imported does not exist"
 *   - if settings are different from the template, fail "drift detected" (unless run with --force)
 * - prepare ResourcesToImport CloudFormation structure and modify the template as needed:
 *   - resources skipped or not supporting import are removed from the template
 *   - resources without explicit DeletionPolicy have it added with a value of DELETE
 * - create a CFN change set of type import
 * - execute the change set
 */
export class ResourceImporter {
  private resourceIdentifiers: { [key: string]: string[] } | undefined;
  private currentTemplate: any;

  constructor(private stack: cxapi.CloudFormationStackArtifact, private cfn: CloudFormationDeployments) {}

  /**
   * Prepare a mapping of physical resources to be imported as respective CDK constructs by inferring it from the
   * construct's configuration when possible and by interactive prompts otherwise
   */
  public async createPhysicalResourceMap(): Promise<ResourceMap> {
    const importCandidates = await this.getAddedResources();

    const resourcesToImport: ResourceMap = {};
    for (let [logicalId, chg] of Object.entries(importCandidates)) {
      const resourceName = this.resourceTreePath(logicalId);
      debug(`Considering resource ${resourceName} (${logicalId}) of type ${chg.newResourceType} for import`);
      const resourceImportIdentifier = await this.identifyPhysicalResource(logicalId, chg);
      if (resourceImportIdentifier) {
        resourcesToImport[resourceName] = resourceImportIdentifier;
      }
    }
    return resourcesToImport;
  }

  /**
   * Based on the provided resource mapping, prepare CFN structures for import (template,
   * ResourcesToImport structure) and perform the import operation (CloudFormation deployment)
   *
   * @param resourceMap Mapping from CDK construct tree path to physical resource import identifiers
   * @param options Options to pass to CloudFormation deploy operation
   */
  public async importResources(resourceMap: ResourceMap, options: DeployStackOptions) {
    const resourcesToImport: ResourcesToImport = await this.prepareTemplateForImport(resourceMap);

    try {
      const result = await this.cfn.deployStack({
        ...options,
        resourcesToImport,
      });

      const message = result.noOp
        ? ' ✅  %s (no changes)'
        : ' ✅  %s';

      success('\n' + message, options.stack.displayName);
    } catch (e) {
      error('\n ❌  %s failed: %s', colors.bold(options.stack.displayName), e);
      throw e;
    }
  }

  /**
   * Perform a diff between the currently running and the new template, enusre that it is valid
   * for importing and return a list of resources that are being added in the new version
   *
   * @return mapping logicalResourceId -> resourceDifference
   */
  private async getAddedResources(): Promise<{ [logicalId: string]: ResourceDifference }> {
    const diff = cfnDiff.diffTemplate(await this.getCurrentTemplate(), this.stack.template);

    // Validate the diff: CloudFormation does not allow any changes to already existing resources on import
    // and so any change other than new resource addition is invalid - fail if detected (CDKMetadata resource
    // always changes, so we skip it here and deal with it before triggering the import operation)
    const nonAdditionChanges = Object.entries(diff.resources.changes).filter(chg => !chg[1].isAddition && chg[0] != 'CDKMetadata').map(chg => chg[0]);
    if (nonAdditionChanges.length) {
      const offendingResources = nonAdditionChanges.map(this.resourceTreePath);
      throw new Error('No resource updates or deletes are allowed on import operation. Make sure to resolve pending changes ' +
                      `to existing resources, before attempting an import. Updated/deleted resources: ${offendingResources.join(', ')}`);
    }

    // Resources in the new template, that are not present in the current template, are a potential import candidates
    return diff.resources.filter(chg => chg?.isAddition ?? false).changes;
  }

  /**
   * Get currently deployed template of the given stack (SINGLETON)
   *
   * @returns Currently deployed CloudFormation template
   */
  private async getCurrentTemplate(): Promise<any> {
    if (!this.currentTemplate) {
      this.currentTemplate = await this.cfn.readCurrentTemplate(this.stack);
    }
    return this.currentTemplate;
  }

  /**
   * Get a list of import identifiers for all resource types used in the given
   * template that do support the import operation (SINGLETON)
   *
   * @returns a mapping from a resource type to a list of property names that together identify the resource for import
   */
  private async getResourceIdentifiers(): Promise<ResourceIdentifiers> {
    if (!this.resourceIdentifiers) {
      this.resourceIdentifiers = {};
      const resourceIdentifierSummaries = await this.cfn.getTemplateSummary(this.stack);
      for (let summary of resourceIdentifierSummaries) {
        if ('ResourceType' in summary && summary.ResourceType && 'ResourceIdentifiers' in summary && summary.ResourceIdentifiers) {
          this.resourceIdentifiers[summary.ResourceType] = summary.ResourceIdentifiers;
        }
      }
    }
    return this.resourceIdentifiers;
  }

  // TODO: if --non-interactive (default if no stdin is not TTY) then suppress interactive prompts (fill in a placeholder instead)
  private async identifyPhysicalResource(logicalId: string, chg: cfnDiff.ResourceDifference): Promise<ResourceIdentifierProperties | undefined> {
    const resourceIdentifiers = await this.getResourceIdentifiers();
    const resourceName = this.resourceTreePath(logicalId);

    // Skip resources that do not support importing
    if (chg.newResourceType === undefined || !(chg.newResourceType in resourceIdentifiers)) {
      print(`Skipping import of ${resourceName} - unsupported resource type ${chg.newResourceType}`);
      return undefined;
    }

    let identifier: ResourceIdentifierProperties = {};
    let autoImport = true;
    for (let idpart of resourceIdentifiers[chg.newResourceType]) {
      if (chg.newProperties && (idpart in chg.newProperties)) {
        identifier[idpart] = chg.newProperties[idpart];
      } else {
        autoImport = false;
        const response = await promptly.prompt(
          `Enter ${colors.bold(idpart)} of ${chg.newResourceType} to import as ${colors.bold(resourceName)} (leave empty to skip): `,
          { default: '' },
        );
        if (!response) {
          print(`Skipping import of ${resourceName}`);
          return undefined;
        }
        identifier[idpart] = response;
      }
    }

    const props = Object.entries(identifier).map(x => `${x[0]}=${x[1]}`).join(', ');

    if (autoImport) {
      const importConfirmed = await promptly.confirm(
        `Import physical resource ${chg.newResourceType} with [${colors.bold(props)}] as ${colors.bold(resourceName)} (yes/no) [default: yes]? `,
        { default: 'yes' },
      );
      if (!importConfirmed) {
        print(`Skipping import of ${resourceName}`);
        return undefined;
      }
    }

    return identifier;
  }

  /**
   * Convert the internal "resource mapping" structure to CloudFormation accepted "ResourcesToImport" structure
   * @param resourceMap "Resource mapping" from CDK construct tree path to resource import identifiers
   * @returns ResourcesToImport structure as defined by CloudFormation API
   */
  private async prepareTemplateForImport(resourceMap: ResourceMap): Promise<ResourcesToImport> {
    // There's a CloudFormation limitation that on import operation, no other changes are allowed:
    // Since CDK always changes the CDKMetadata resource with a new value, as a workaround, we override
    // the template's metadata with currently deployed version
    const currentTemplate = await this.getCurrentTemplate();
    if (currentTemplate?.Resources?.CDKMetadata) {
      // stack was previously deployed
      this.stack.template.Resources.CDKMetadata = currentTemplate.Resources.CDKMetadata;
    } else {
      // new stack will be created
      delete this.stack.template.Resources.CDKMetadata;
    }

    const resourcesToImport: ResourcesToImport = [];
    for (let [logicalId, chg] of Object.entries(await this.getAddedResources())) {
      const identifiers = resourceMap[this.resourceTreePath(logicalId)];
      if (identifiers) {
        // TODO - check physical resource presence and configuration here
        // resource will be imported
        print(`Importing ${chg.newResourceType} (${Object.entries(identifiers).map((k, v) => k+'='+v).join(', ')}) as ${logicalId}`);
        resourcesToImport.push({
          LogicalResourceId: logicalId,
          ResourceType: chg.newResourceType!,
          ResourceIdentifier: identifiers,
        });
        // CloudFormation resource import API requires each resource that is being imported to have an explicit DeletionPolicy set. If the resource
        // doesn't have the DeletionPolicy set, inject it with the value of 'Delete' - CloudFormation default. It is only needed to be present during
        // the import operation - subsequent deploys drop the option from the template
        if (!this.stack.template.Resources[logicalId].DeletionPolicy) {
          this.stack.template.Resources[logicalId].DeletionPolicy = 'Delete';
        }
      } else {
        // resource wasn't chosen for import - for the import operation to succeed, this resource must be removed from the template
        print(`Skipping import of ${logicalId}`);
        delete this.stack.template.Resources[logicalId];
      }
    }
    return resourcesToImport;
  }

  /**
   * Convert CloudFormation logical resource ID to CDK construct tree path
   *
   * @param logicalId CloudFormation logical ID of the resource (the key in the template's Resources section)
   * @returns Forward-slash separated path of the resource in CDK construct tree, e.g. MyStack/MyBucket/Resource
   */
  private resourceTreePath(logicalId: string): string {
    const treePath = this.stack.template?.Resources?.[logicalId]?.Metadata?.['aws:cdk:path'];
    if (!treePath) {
      throw new Error(`Cannot determine CDK construct tree path for resource ${logicalId}. Was the provided CloudFormation template created by cdk synth?`);
    }
    return treePath;
  }
}
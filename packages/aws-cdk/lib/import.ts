import * as cfnDiff from '@aws-cdk/cloudformation-diff';
import * as cxapi from '@aws-cdk/cx-api';
import { ResourceToImport } from 'aws-sdk/clients/cloudformation';
import * as promptly from 'promptly';
import { CloudFormationDeployments } from './api/cloudformation-deployments';
import { ResourcesToImport } from './api/util/cloudformation';
import { debug, print } from './logging';

// For each resource that is to be added in the new template:
// - look up the identification information for the resource type [if not found, fail "type not supported"]
// - look up the physical resource (perhaps using cloud control API?) [if not found, fail "resource to be imported does not exist"]
// - assembe and return "resources to import" object to be passed on to changeset creation
//
// TEST: can we have a CFN changeset that both creates resources and import other resources?

export class ResourceImporter {
  private resourceIdentifiers: { [key: string]: string[] } = {};
  private currentTemplate: any;

  constructor(private stack: cxapi.CloudFormationStackArtifact, private cfn: CloudFormationDeployments) {}

  public async prepareImport(): Promise<ResourcesToImport> {
    this.currentTemplate = await this.cfn.readCurrentTemplate(this.stack);
    this.resourceIdentifiers = await this.fetchResourceIdentifiers();

    // There's a CloudFormation limitation that on import operation, no other changes are allowed:
    // Since CDK always changes the CDKMetadata resource with a new value, as a workaround, we override
    // the template's metadata with currently deployed version
    this.stack.template.Resources.CDKMetadata = this.currentTemplate.Resources.CDKMetadata;

    const diff = cfnDiff.diffTemplate(this.currentTemplate, this.stack.template);

    // All other update/delete changes will be treated as an error
    const updateDeleteChanges = diff.resources.filter(chg => !(chg?.isAddition ?? false)).changes;
    if (updateDeleteChanges.length) {
      const offendingResources = Object.keys(updateDeleteChanges).map(this.resourceDisplayName);
      throw new Error('No resource updates or deletes are allowed on import operation. Make sure to resolve pending changes ' +
                      `to existing resources, before attempting an import. Updated/deleted resources: ${offendingResources.join(', ')}`);
    }

    // Resources in the new template, that are not present in the current template, are a potential import candidates
    const importCandidates = diff.resources.filter(chg => chg?.isAddition ?? false).changes;

    const resourcesToImport: ResourcesToImport = [];
    for (let [logicalId, chg] of Object.entries(importCandidates)) {
      debug(`Considering resource ${logicalId} of type ${chg.newResourceType} for import`);
      const resourceImportHint = await this.chooseResourceForImport(logicalId, chg);
      if (resourceImportHint) {
        // resource will be imported
        resourcesToImport.push(resourceImportHint);
      } else {
        // resource wasn't chosen for import - for the import operation to succeed, this resource must be removed from the template
        delete this.stack.template.Resources[logicalId];
      }
    }
    return resourcesToImport;
  }

  private async chooseResourceForImport(logicalId: string, chg: cfnDiff.ResourceDifference): Promise<ResourceToImport | undefined> {
    const resourceName = this.resourceDisplayName(logicalId);

    // Skip resources that do not support importing
    if (chg.newResourceType === undefined || !(chg.newResourceType in this.resourceIdentifiers)) {
      print(`Skipping import of ${resourceName} - unsupported resource type ${chg.newResourceType}`);
      return undefined;
    }

    let identifier: { [key: string]: string } = {};
    let autoImport = true;
    for (let idpart of this.resourceIdentifiers[chg.newResourceType]) {
      if (chg.newProperties && (idpart in chg.newProperties)) {
        identifier[idpart] = chg.newProperties[idpart];
      } else {
        autoImport = false;
        const response = await promptly.prompt(
          `Enter ${idpart} of ${chg.newResourceType} to import as ${resourceName} (leave empty to skip): `,
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
        `Import physical resource ${chg.newResourceType} with [${props}] as ${resourceName} (yes/no) [default: yes]? `,
        { default: 'yes' },
      );
      if (!importConfirmed) {
        print(`Skipping import of ${resourceName}`);
        return undefined;
      }
    }

    print(`Physical resource of type ${chg.newResourceType} identified by [${props}] will be imported as ${resourceName}`);

    // CloudFormation resource import API requires each resource that is being imported to have an explicit DeletionPolicy set. If the resource
    // doesn't have the DeletionPolicy set, inject it with the value of 'Delete' - CloudFormation default. It is only needed to be present during
    // the import operation - subsequent deploys drop the option from the template
    if (!this.stack.template.Resources[logicalId].DeletionPolicy) {
      this.stack.template.Resources[logicalId].DeletionPolicy = 'Delete';
    }

    return {
      LogicalResourceId: logicalId,
      ResourceType: chg.newResourceType,
      ResourceIdentifier: identifier,
    };
  }


  /**
   * For the given template, retrieve information for all used resource types:
   *   - whether the resource type supports import operation
   *   - what properties uniquely identify the physical resource to be imported
   *
   * @returns a mapping from a resource type to a list of property names that together identify the resource for import
   */
  private async fetchResourceIdentifiers(): Promise<{ [key: string]: string[] }> {
    const resourceIdentifierSummaries = await this.cfn.getTemplateSummary(this.stack);
    let resourceIdentifiers: { [key: string]: string[] } = {};
    for (let summary of resourceIdentifierSummaries) {
      if ('ResourceType' in summary && summary.ResourceType && 'ResourceIdentifiers' in summary && summary.ResourceIdentifiers) {
        resourceIdentifiers[summary.ResourceType] = summary.ResourceIdentifiers;
      }
    }
    return resourceIdentifiers;
  }

  /**
   * CDK generated logical resource IDs are not very user friendly - whenever possible, use the path in the construct tree instead
   */
  private resourceDisplayName(logicalId: string): string {
    const treePath = this.stack.template?.Resources?.[logicalId]?.Metadata?.['aws:cdk:path'];
    if (treePath) {
      // remove the L1 construct id for better readability
      return treePath.replace(/\/Resource$/, '');
    }
    return logicalId;
  }
}
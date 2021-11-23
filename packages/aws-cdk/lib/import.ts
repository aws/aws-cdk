import * as cfnDiff from '@aws-cdk/cloudformation-diff';
import * as cxapi from '@aws-cdk/cx-api';
import * as promptly from 'promptly';
import { ResourcesToImport } from './api/util/cloudformation';

// Basic idea: we want to have a structure (ideally auto-generated from CFN definitions) that lists all resource types
// that support importing and for each type, the identification information
//
// For each resource that is to be added in the new template:
// - look up the identification information for the resource type [if not found, fail "type not supported"]
// - look up the physical resource (perhaps using cloud control API?) [if not found, fail "resource to be imported does not exist"]
// - assembe and return "resources to import" object to be passed on to changeset creation
//
// TEST: can we have a CFN changeset that both creates resources and import other resources?
const RESOURCE_IDENTIFIERS: { [key: string]: string[] } = {
  'AWS::S3::Bucket': ['BucketName'],
};

export async function prepareResourcesToImport(oldTemplate: any, newTemplate: cxapi.CloudFormationStackArtifact): Promise<ResourcesToImport> {
  const diff = cfnDiff.diffTemplate(oldTemplate, newTemplate.template);

  const additions: { [key: string]: cfnDiff.ResourceDifference } = {};
  diff.resources.forEachDifference((id, chg) => {
    if (chg.isAddition) {
      additions[id] = chg;
    }
  });

  const resourcesToImport: ResourcesToImport = [];
  for (let [id, chg] of Object.entries(additions)) {
    if (chg.newResourceType === undefined || !(chg.newResourceType in RESOURCE_IDENTIFIERS)) {
      throw new Error(`Resource ${id} is of type ${chg.newResourceType} that is not supported for import`);
    }

    let identifier: { [key: string]: string } = {};
    for (let idpart of RESOURCE_IDENTIFIERS[chg.newResourceType]) {
      if (chg.newProperties && (idpart in chg.newProperties)) {
        identifier[idpart] = chg.newProperties[idpart];
      } else {
        const displayName : string = newTemplate.template?.Resources?.[id]?.Metadata?.['aws:cdk:path'] ?? id;
        identifier[idpart] = await promptly.prompt(`Please enter ${idpart} of ${chg.newResourceType} to import as ${displayName.replace(/\/Resource$/, '')}: `);
      }
    }

    resourcesToImport.push({
      LogicalResourceId: id,
      ResourceType: chg.newResourceType,
      ResourceIdentifier: identifier,
    });
  }

  return resourcesToImport;
}
/*eslint-disable no-console*/
/* eslint-disable import/no-extraneous-dependencies */
import { SSM } from 'aws-sdk';

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  const props = event.ResourceProperties;
  const imports: string[] = props.Imports;
  const keyName: string = `cdk-strong-ref:${props.StackName}`;

  const ssm = new SSM({ region: props.Region });
  try {
    switch (event.RequestType) {
      case 'Create':
        console.info('Tagging SSM Parameter imports');
        await addTags(ssm, imports, keyName);
        return;
      case 'Update':
        const oldProps = event.OldResourceProperties;
        const oldExports: string[] = oldProps.Imports;
        const newExports = filterExports(imports, oldExports);
        const paramsToDelete = filterExports(oldExports, imports);
        console.info('Releasing unused SSM Parameter imports');
        if (Object.keys(paramsToDelete).length > 0) {
          await removeTags(ssm, paramsToDelete, keyName);
        }
        console.info('Tagging new SSM Parameter imports');
        await addTags(ssm, newExports, keyName);
        return;
      case 'Delete':
        console.info('Deleting all SSM Parameter exports');
        await deleteParametersByPath(ssm, `/cdk/exports/${props.StackName}/`);
        return;
      default:
        return;
    }
  } catch (e) {
    console.error('Error importing cross region stack exports: ', e);
    throw e;
  }
};

/**
 * Add tag to parameters for existing exports
 */
async function addTags(ssm: SSM, parameters: string[], keyName: string): Promise<void> {
  await Promise.all(parameters.map(async name => {
    try {
      return ssm.addTagsToResource({
        ResourceId: name,
        ResourceType: 'Parameter',
        Tags: [{
          Key: keyName,
          Value: 'true',
        }],
      }).promise();
    } catch (e) {
      throw new Error(`Error importing ${name}: ${e}`);
    }
  }));
}

/**
 * Remove tags from parameters
 */
async function removeTags(ssm: SSM, parameters: string[], keyName: string): Promise<void> {
  await Promise.all(parameters.map(async name => {
    try {
      return ssm.removeTagsFromResource({
        TagKeys: [keyName],
        ResourceType: 'Parameter',
        ResourceId: name,
      }).promise();
    } catch (e) {
      switch (e.code) {
        // if the parameter doesn't exist then there is nothing to release
        case 'InvalidResourceId':
          return;
        default:
          throw new Error(`Error releasing import ${name}: ${e}`);
      }
    }
  }));
}

/**
 * Get all parameters in a given path
 *
 * If the request fails for any reason it will fail the custom resource event.
 * Since this is only run when the resource is deleted that is probably the behavior
 * that is desired.
 */
async function getParametersByPath(ssm: SSM, path: string, nextToken?: string): Promise<SSM.Parameter[]> {
  const parameters: SSM.Parameter[] = [];
  return ssm.getParametersByPath({
    Path: path,
    NextToken: nextToken,
  }).promise().then(async getParametersByPathResult => {
    parameters.push(...getParametersByPathResult.Parameters ?? []);
    if (getParametersByPathResult.NextToken) {
      parameters.push(...await getParametersByPath(ssm, path, getParametersByPathResult.NextToken));
    }
      return parameters;
  });
}

/**
 * Delete all parameters in a give path
 */
async function deleteParametersByPath(ssm: SSM, path: string): Promise<void> {
  const allParams = await getParametersByPath(ssm, path);
  const names = allParams.map(param => param.Name).filter(x => !!x) as string[];
  await ssm.deleteParameters({
    Names: names,
  }).promise();
}

/**
 * Return only the items from source that do not exist in the filter
 *
 * @param source the source object to perform the filter on
 * @param filter filter out items that exist in this object
 */
function filterExports(source: string[], filter: string[]): string[] {
  return source.filter(key => !filter.includes(key));
}

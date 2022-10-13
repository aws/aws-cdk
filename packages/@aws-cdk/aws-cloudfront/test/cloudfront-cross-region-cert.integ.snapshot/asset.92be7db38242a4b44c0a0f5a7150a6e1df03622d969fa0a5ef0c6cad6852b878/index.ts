/*eslint-disable no-console*/
/* eslint-disable import/no-extraneous-dependencies */
import { SSM } from 'aws-sdk';
import { ExportReaderCRProps } from '../types';

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  const props: ExportReaderCRProps = event.ResourceProperties.ReaderProps;
  const imports: string[] = props.imports;
  const keyName: string = `aws-cdk:strong-ref:${props.prefix}`;

  const ssm = new SSM({ region: props.region });
  try {
    switch (event.RequestType) {
      case 'Create':
        console.info('Tagging SSM Parameter imports');
        await addTags(ssm, imports, keyName);
        return;
      case 'Update':
        const oldProps: ExportReaderCRProps = event.OldResourceProperties.ReaderProps;
        const oldExports: string[] = oldProps.imports;
        const newExports = except(imports, oldExports);
        const paramsToDelete = except(oldExports, imports);
        console.info('Releasing unused SSM Parameter imports');
        if (Object.keys(paramsToDelete).length > 0) {
          await removeTags(ssm, paramsToDelete, keyName);
        }
        console.info('Tagging new SSM Parameter imports');
        await addTags(ssm, newExports, keyName);
        return;
      case 'Delete':
        console.info('Deleting all SSM Parameter exports');
        await deleteParametersByPath(ssm, `/cdk/exports/${props.prefix}/`);
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
      return await ssm.addTagsToResource({
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
      return await ssm.removeTagsFromResource({
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
async function getParametersByPath(ssm: SSM, path: string): Promise<SSM.Parameter[]> {
  const parameters: SSM.Parameter[] = [];
  let nextToken: string | undefined;
  do {
    const response = await ssm.getParametersByPath({ Path: path, NextToken: nextToken }).promise();
    parameters.push(...response.Parameters ?? []);
    nextToken = response.NextToken;

  } while (nextToken);
  return parameters;
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
function except(source: string[], filter: string[]): string[] {
  return source.filter(key => !filter.includes(key));
}

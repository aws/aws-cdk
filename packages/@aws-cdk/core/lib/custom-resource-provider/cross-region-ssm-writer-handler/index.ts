/*eslint-disable no-console*/
/* eslint-disable import/no-extraneous-dependencies */
import { SSM } from 'aws-sdk';
type CrossRegionExports = { [exportName: string]: string };

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  const props = event.ResourceProperties;
  const exports: CrossRegionExports = props.Exports;

  const ssm = new SSM({ region: props.Region });
  try {
    switch (event.RequestType) {
      case 'Create':
        console.info(`Creating new SSM Parameter exports in region ${props.Region}`);
        await throwIfAnyExistingParameters(ssm, exports);
        await putParameters(ssm, exports);
        return;
      case 'Update':
        const oldProps = event.OldResourceProperties;
        const oldExports: CrossRegionExports = oldProps.Exports;
        const newExports = filter(exports, oldExports);
        await throwIfAnyExistingParameters(ssm, newExports);
        const paramsToDelete = filter(oldExports, exports);
        console.info(`Deleting unused SSM Parameter exports in region ${props.Region}`);
        if (Object.keys(paramsToDelete).length > 0) {
          await ssm.deleteParameters({
            Names: Object.keys(paramsToDelete),
          }).promise();
        }
        console.info(`Creating new SSM Parameter exports in region ${props.Region}`);
        await putParameters(ssm, newExports);
        return;
      case 'Delete':
        console.info(`Deleting all SSM Parameter exports in region ${props.Region}`);
        await ssm.deleteParameters({
          Names: Array.from(Object.keys(exports)),
        }).promise();
        return;
      default:
        return;
    }
  } catch (e) {
    console.error('Error processing event: ', e);
    throw e;
  }
};

/**
 * Create parameters for existing exports
 */
async function putParameters(ssm: SSM, parameters: CrossRegionExports): Promise<void> {
  await Promise.all(Array.from(Object.entries(parameters), ([name, value]) => {
    return ssm.putParameter({
      Name: name,
      Value: value,
      Type: 'String',
    }).promise();
  }));
}

/**
 * Query for existing parameters
 */
async function throwIfAnyExistingParameters(ssm: SSM, parameters: CrossRegionExports): Promise<void> {
  const result = await ssm.getParameters({
    Names: Object.keys(parameters),
  }).promise();
  if ((result.Parameters ?? []).length > 0) {
    const existing = result.Parameters!.map(param => param.Name);
    throw new Error(`Exports already exist: \n${existing.join('\n')}`);
  }
}

/**
 * Return only the items from source that do not exist in the filter
 * 
 * @param source the source object to perform the filter on
 * @param filter filter out items that exist in this object
 */
function filter(source: CrossRegionExports, filter: CrossRegionExports): CrossRegionExports {
  return Object.keys(source)
    .filter(key => !filter.hasOwnProperty(key))
    .reduce((acc: CrossRegionExports, curr: string) => {
      acc[curr] = source[curr];
      return acc;
    }, {});
}

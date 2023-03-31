/*eslint-disable no-console*/
/* eslint-disable import/no-extraneous-dependencies */
import { SSM } from 'aws-sdk';
import { CrossRegionExports, ExportWriterCRProps } from '../types';

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  const props: ExportWriterCRProps = event.ResourceProperties.WriterProps;
  const exports = props.exports as CrossRegionExports;

  const ssm = new SSM({ region: props.region });
  try {
    switch (event.RequestType) {
      case 'Create':
        console.info(`Creating new SSM Parameter exports in region ${props.region}`);
        await throwIfAnyInUse(ssm, exports);
        await putParameters(ssm, exports);
        return;
      case 'Update':
        const oldProps: ExportWriterCRProps = event.OldResourceProperties.WriterProps;
        const oldExports = oldProps.exports as CrossRegionExports;
        const newExports = except(exports, oldExports);

        // throw an error to fail the deployment if any export value is changing
        const changedExports = changed(oldExports, exports);
        if (changedExports.length > 0) {
          throw new Error('Some exports have changed!\n'+ changedExports.join('\n'));
        }
        // if we are removing any exports that are in use, then throw an
        // error to fail the deployment
        const removedExports = except(oldExports, exports);
        await throwIfAnyInUse(ssm, removedExports);
        // if the ones we are removing are not in use then delete them
        // skip if no export names are to be deleted
        const removedExportsNames = Object.keys(removedExports);
        if (removedExportsNames.length > 0) {
          await ssm.deleteParameters({
            Names: removedExportsNames,
          }).promise();
        }

        // also throw an error if we are creating a new export that already exists for some reason
        await throwIfAnyInUse(ssm, newExports);
        console.info(`Creating new SSM Parameter exports in region ${props.region}`);
        await putParameters(ssm, newExports);
        return;
      case 'Delete':
        // if any of the exports are currently in use then throw an error to fail
        // the stack deletion.
        await throwIfAnyInUse(ssm, exports);
        // if none are in use then delete all of them
        await ssm.deleteParameters({
          Names: Object.keys(exports),
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
 * Query for existing parameters that are in use
 */
async function throwIfAnyInUse(ssm: SSM, parameters: CrossRegionExports): Promise<void> {
  const tagResults: Map<string, Set<string>> = new Map();
  await Promise.all(Object.keys(parameters).map(async (name: string) => {
    const result = await isInUse(ssm, name);
    if (result.size > 0) {
      tagResults.set(name, result);
    }
  }));

  if (tagResults.size > 0) {
    const message: string = Object.entries(tagResults)
      .map((result: [string, string[]]) => `${result[0]} is in use by stack(s) ${result[1].join(' ')}`)
      .join('\n');
    throw new Error(`Exports cannot be updated: \n${message}`);
  }
}

/**
 * Check if a parameter is in use
 */
async function isInUse(ssm: SSM, parameterName: string): Promise<Set<string>> {
  const tagResults: Set<string> = new Set();
  try {
    const result = await ssm.listTagsForResource({
      ResourceId: parameterName,
      ResourceType: 'Parameter',
    }).promise();
    result.TagList?.forEach(tag => {
      const tagParts = tag.Key.split(':');
      if (tagParts[0] === 'aws-cdk' && tagParts[1] === 'strong-ref') {
        tagResults.add(tagParts[2]);
      }
    });
  } catch (e: any) {
    // an InvalidResourceId means that the parameter doesn't exist
    // which we should ignore since that means it's not in use
    if (e.code === 'InvalidResourceId') {
      return new Set();
    }
    throw e;
  }
  return tagResults;
}

/**
 * Return only the items from source that do not exist in the filter
 *
 * @param source the source object to perform the filter on
 * @param filter filter out items that exist in this object
 * @returns any exports that don't exist in the filter
 */
function except(source: CrossRegionExports, filter: CrossRegionExports): CrossRegionExports {
  return Object.keys(source)
    .filter(key => (!filter.hasOwnProperty(key)))
    .reduce((acc: CrossRegionExports, curr: string) => {
      acc[curr] = source[curr];
      return acc;
    }, {});
}

/**
 * Return items that exist in both the the old parameters and the new parameters,
 * but have different values
 *
 * @param oldParams the exports that existed previous to this execution
 * @param newParams the exports for the current execution
 * @returns any parameters that have different values
 */
function changed(oldParams: CrossRegionExports, newParams: CrossRegionExports): string[] {
  return Object.keys(oldParams)
    .filter(key => (newParams.hasOwnProperty(key) && oldParams[key] !== newParams[key]))
    .reduce((acc: string[], curr: string) => {
      acc.push(curr);
      return acc;
    }, []);
}

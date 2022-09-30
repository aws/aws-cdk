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
        await throwIfAnyInUse(ssm, exports);
        await putParameters(ssm, exports);
        return;
      case 'Update':
        const oldProps = event.OldResourceProperties;
        const oldExports: CrossRegionExports = oldProps.Exports;
        const newExports = filterExports(exports, oldExports);
        await throwIfAnyInUse(ssm, newExports);
        console.info(`Creating new SSM Parameter exports in region ${props.Region}`);
        await putParameters(ssm, newExports);
        return;
      case 'Delete':
        // consuming stack will delete parameters
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
    try {
      const result = await ssm.listTagsForResource({
        ResourceId: name,
        ResourceType: 'Parameter',
      }).promise();
      result.TagList?.forEach(tag => {
        const tagParts = tag.Key.split(':');
        if (tagParts[0] === 'cdk-strong-ref') {
          tagResults.has(name)
            ? tagResults.get(name)!.add(tagParts[1])
            : tagResults.set(name, new Set([tagParts[1]]));
        }
      });

    } catch (e) {
      // an InvalidResourceId means that the parameter doesn't exist
      // which we should ignore since that means it's not in use
      if (e.code === 'InvalidResourceId') {
        return;
      }
      throw e;
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
 * Return only the items from source that do not exist in the filter
 *
 * @param source the source object to perform the filter on
 * @param filter filter out items that exist in this object
 */
function filterExports(source: CrossRegionExports, filter: CrossRegionExports): CrossRegionExports {
  return Object.keys(source)
    .filter(key => (!filter.hasOwnProperty(key) || source[key] !== filter[key]))
    .reduce((acc: CrossRegionExports, curr: string) => {
      acc[curr] = source[curr];
      return acc;
    }, {});
}

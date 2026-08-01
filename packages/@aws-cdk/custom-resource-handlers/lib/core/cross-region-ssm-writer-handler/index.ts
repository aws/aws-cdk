
/* eslint-disable import/no-extraneous-dependencies */
import { SSM } from '@aws-sdk/client-ssm';
import type { CrossRegionExports, ExportWriterCRProps } from '../types';

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  const props: ExportWriterCRProps = event.ResourceProperties.WriterProps;
  const exports = props.exports as CrossRegionExports;

  const ssm = new SSM({ region: props.region });
  try {
    switch (event.RequestType) {
      case 'Create':
        console.info(`Creating new SSM Parameter exports in region ${props.region}`);
        await putParameters(ssm, exports);
        return;
      case 'Update':
        const oldProps: ExportWriterCRProps = event.OldResourceProperties.WriterProps;
        const oldExports = oldProps.exports as CrossRegionExports;
        const newExports = except(exports, oldExports);

        // delete removed exports
        const removedExports = except(oldExports, exports);
        const removedExportsNames = Object.keys(removedExports);
        await deleteParameters(ssm, removedExportsNames);

        // create new exports
        console.info(`Creating new SSM Parameter exports in region ${props.region}`);
        await putParameters(ssm, newExports);
        return;
      case 'Delete':
        await deleteParameters(ssm, Object.keys(exports));
        return;
      default:
        return;
    }
  } catch (e) {
    console.error('Error processing event: ', e);
    throw e;
  }
}

/**
 * Create parameters for existing exports
 */
async function putParameters(ssm: SSM, parameters: CrossRegionExports): Promise<void> {
  // This linter exemption could be wrong. It is added into enable linting after it was turned off for some time
  // eslint-disable-next-line @cdklabs/promiseall-no-unbounded-parallelism
  await Promise.all(Array.from(Object.entries(parameters), ([name, value]) => {
    return ssm.putParameter({
      Name: name,
      Value: value,
      Type: 'String',
      Overwrite: true,
    });
  }));
}

/**
 * Delete parameters no longer in use.
 * From https://docs.aws.amazon.com/systems-manager/latest/APIReference/API_DeleteParameters.html there
 * is a constraint on names. It must have size at least 1 and at most 10.
 */
async function deleteParameters(ssm: SSM, names: string[]) {
  // max allowed by DeleteParameters api
  const maxSize = 10;
  // more testable if we delete in order
  names.sort();
  for (let chunkStartIdx = 0; chunkStartIdx < names.length; chunkStartIdx += maxSize) {
    const chunkOfNames = names.slice(chunkStartIdx, chunkStartIdx + maxSize);
    // also observe minimum size constraint: Names parameter must have size at least 1
    if (chunkOfNames.length > 0) {
      await ssm.deleteParameters({
        Names: chunkOfNames,
      });
    }
  }
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

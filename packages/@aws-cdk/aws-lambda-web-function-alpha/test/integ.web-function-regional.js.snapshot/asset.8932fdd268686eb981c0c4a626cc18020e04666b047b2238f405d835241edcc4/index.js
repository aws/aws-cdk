// Runs in the Node.js runtime, which provides @aws-sdk/client-s3. It is plain JavaScript so that
// the package does not depend on the SDK at build time. Typed in index.d.ts.
const { S3Client, CopyObjectCommand } = require('@aws-sdk/client-s3');

/**
 * Copies a code asset into a versioned bucket that the Web Functions service can read.
 *
 * Returns the version ID of the copy, which the web function revision needs.
 */
exports.handler = async (event) => {
  const props = event.ResourceProperties;
  const physicalId = `${props.DestinationBucket}/${props.DestinationKey}`;

  if (event.RequestType === 'Delete') {
    // The destination bucket is emptied when it is removed
    return { PhysicalResourceId: physicalId };
  }

  const s3 = new S3Client({});
  const result = await s3.send(new CopyObjectCommand({
    Bucket: props.DestinationBucket,
    Key: props.DestinationKey,
    CopySource: encodeURI(`${props.SourceBucket}/${props.SourceKey}`),
  }));
  if (!result.VersionId) {
    throw new Error(`Versioning is not enabled on bucket ${props.DestinationBucket}`);
  }

  return { PhysicalResourceId: physicalId, Data: { VersionId: result.VersionId } };
};

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
const s3 = new S3Client();
export const handler = async (event) => {
  const now = new Date();
  console.log(JSON.stringify(event));
  if (event.headers['x-amz-firehose-access-key'] !== 'access-key') {
    return { statusCode: 401 };
  }

  const req = JSON.parse(event.body);
  await s3.send(new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: now.toISOString(),
    Body: event.body,
    ContentType: 'application/json',
  }));

  return {
    statusCode: 200,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      requestId: req.requestId,
      timestamp: now.getTime(),
    }),
  };
}

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
const s3 = new S3Client();
export const handler = async (event) => {
  console.log(JSON.stringify(event));
  const req = JSON.parse(event.body);
  await s3.send(new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: new Date().toISOString(),
    Body: event.body,
    ContentType: 'application/json',
  }));
  return {
    statusCode: 200,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      requestId: req.requestId,
      timestamp: Date.now(),
    }),
  };
}

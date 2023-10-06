exports.handler = async (event: any, _context: any) => {
  // eslint-disable-next-line import/no-extraneous-dependencies, @typescript-eslint/no-require-imports
  const { LambdaClient, TagResourceCommand } = require('@aws-sdk/client-lambda');

  // All global variables and imports are defined inside handler block to avoid name collision with the
  // assets index.ts file copied to the cdk - integ.out directory
  const client = new LambdaClient();

  let arn = process.env.FUNC_ARN;
  const value = Buffer.from(JSON.stringify(event, null, 2)).toString('base64');
  const input = {
    Resource: arn,
    Tags: {
      OutputValue: value,
    },
  };
  const command = new TagResourceCommand(input);
  await client.send(command);
};
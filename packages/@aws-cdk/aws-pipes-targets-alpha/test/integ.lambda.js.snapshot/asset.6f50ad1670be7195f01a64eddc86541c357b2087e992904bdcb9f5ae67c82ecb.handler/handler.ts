// eslint-disable-next-line import/no-extraneous-dependencies
import { LambdaClient, TagResourceCommand } from '@aws-sdk/client-lambda';

exports.handler = async (event: any, context: any) => {
  const client = new LambdaClient();
  const input = {
    Resource: context.invokedFunctionArn,
    Tags: {
      Identifier: event[0].body, // event is received in batches, we just take the first message to update the tag. See https://docs.aws.amazon.com/eventbridge/latest/userguide/pipes-targets-specifics.html
    },
  };
  const command = new TagResourceCommand(input);
  await client.send(command);
};

import { CloudFormation } from 'aws-sdk';
import got from 'got';
import { STACK_NAME } from './integ.token-authorizer';

let url: string;
beforeAll(async () => {
  const cloudFormation = new CloudFormation();
  const describeStacks = await cloudFormation.describeStacks({
    StackName: STACK_NAME,
  }).promise();

  url = describeStacks.Stacks![0].Outputs![0].OutputValue!;
});

test('without authorization header', async () => {
  const response = await got(url, {
    throwHttpErrors: false,
  });
  expect(response.statusCode).toBe(401);
});

test('with wrong authorization header', async () => {
  const response = await got(url, {
    headers: { Authorization: 'deny' },
    throwHttpErrors: false,
  });
  expect(response.statusCode).toBe(403);
});

test('with good authorization header', async () => {
  const response = await got(url, {
    headers: { Authorization: 'allow' },
  });
  expect(response.statusCode).toBe(200);
});

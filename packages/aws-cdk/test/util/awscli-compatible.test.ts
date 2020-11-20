import * as AWS from 'aws-sdk';
import { AwsCliCompatible } from '../../lib/api/aws-auth/awscli-compatible';
import { SdkProvider } from '../../lib/api/aws-auth/sdk-provider';
import { withMockedClassSingleton } from '../util';
import * as bockfs from '../bockfs';

beforeEach(() => {
  // Set to paths that don't exist so the SDK doesn't accidentally load this config
  process.env.AWS_CONFIG_FILE = '/home/dummydummy/.bxt/config';
  process.env.AWS_SHARED_CREDENTIALS_FILE = '/home/dummydummy/.bxt/credentials';
  // Scrub some environment variables that might be set if we're running on CodeBuild which will interfere with the tests.
  delete process.env.AWS_REGION;
  delete process.env.AWS_DEFAULT_REGION;
  delete process.env.AWS_ACCESS_KEY_ID;
  delete process.env.AWS_SECRET_ACCESS_KEY;
  delete process.env.AWS_SESSION_TOKEN;
});

test('on an EC2 instance, region lookup queries IMDS', async () => {
  return withMockedClassSingleton(AWS, 'MetadataService', async (mdService) => {
    mdService.request
      // First call for a token
      .mockImplementationOnce((_1, _2, cb) => { cb(undefined as any, 'token'); })
      // Second call for the region
      .mockImplementationOnce((_1, _2, cb) => { cb(undefined as any, JSON.stringify({ region: 'some-region' })); });

    const region = await AwsCliCompatible.region({ ec2instance: true });
    expect(region).toEqual('some-region');
  });
});

test('on EKS Pod, make sure WEB_IDENTITY_TOKEN is used', async () => {
  return withMockedClassSingleton(AWS, 'TokenFileWebIdentityCredentials', async (tfwiCreds) => {
    tfwiCreds.refresh
      // First call for a token
      .mockImplementation((cb) => { cb(undefined); });
    tfwiCreds.needsRefresh
      .mockImplementation(() => false);

    // Scrub some environment variables that are maybe set for Ecs Credentials
    delete process.env.ECS_CONTAINER_METADATA_URI_V4;
    delete process.env.ECS_CONTAINER_METADATA_URI;
    delete process.env.AWS_CONTAINER_CREDENTIALS_RELATIVE_URI;
    delete process.env.AWS_SHARED_CREDENTIALS_FILE;
    delete process.env.AWS_SDK_LOAD_CONFIG;

    bockfs({
      '/var/run/secrets/eks.amazonaws.com/serviceaccount/token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL29pZGMuZWtzLmV1LWNlbnRyYWwtMS5hbWF6b25hd3MuY29tL2lkLzEyMzQ1NjY3ODlBQkNERUZHSElKS0xNTk9QUVJTVFVXWFlaIiwiaWF0IjoxNjA1ODA2Mjc2LCJleHAiOjE2MzczNDIyNzYsImF1ZCI6InN0cy5hbWF6b25hd3MuY29tIiwic3ViIjoic3lzdGVtOnNlcnZpY2VhY2NvdW50OnRlc3Q6c2VydmljZWFjY291bnQiLCJrdWJlcm5ldGVzLmlvIjoieyAgICAgXCJuYW1lc3BhY2VcIjogXCJtb3AtYmFzZS0tcnVubmVyc1wiLCAgICAgXCJwb2RcIjogeyAgICAgICBcIm5hbWVcIjogXCJnaXRsYWJydW5uZXItY2RrYnVpbGQtZ2l0bGFiLXJ1bm5lci02NmI0YmY0Yjc3LTVycXZzXCIsICAgICAgIFwidWlkXCI6IFwiMWViZmQ5NTgtZDgwZi00ZTk0LWE5NDktOWRhMjU4YWQwNzlhXCIgICAgIH0sICAgICBcInNlcnZpY2VhY2NvdW50XCI6IHsgICAgICAgXCJuYW1lXCI6IFwiZ2l0bGFicnVubmVyLWNka2J1aWxkLWdpdGxhYi1ydW5uZXJcIiwgICAgICAgXCJ1aWRcIjogXCI1OTI2MjE0MC0xNTQ2LTRmMGYtODczMC1lOWFlODE5NTU1MjJcIiAgICAgfSAgIH0ifQ.s_n7Cn-KZ9Fi-EGjOqAbIom0_oStPAZ3TxD4N6OIZcM',
    });

    // Set environment variables that we want
    process.env.AWS_CONFIG_FILE = bockfs.path('/home/me/.bxt/config');
    process.env.AWS_ROLE_ARN = 'arn:aws:iam::12356789012:role/Assumable';
    process.env.AWS_WEB_IDENTITY_TOKEN_FILE = bockfs.path('/var/run/secrets/eks.amazonaws.com/serviceaccount/token');

    // WHEN
    await SdkProvider.withAwsCliCompatibleDefaults({});

    // THEN
    // expect(account?.accountId).toEqual(`${uid}the_account_#`);
    expect(tfwiCreds.refresh).toHaveBeenCalled();
  });
});

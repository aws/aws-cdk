#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as signer from 'aws-cdk-lib/aws-signer';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-signer-signing-profile');

new signer.SigningProfile(stack, 'SigningProfileLambda', {
  platform: signer.Platform.AWS_LAMBDA_SHA384_ECDSA,
});

new signer.SigningProfile(stack, 'SigningProfileOCI', {
  platform: signer.Platform.NOTATION_OCI_SHA384_ECDSA,
  signatureValidity: cdk.Duration.days(60),
});

new signer.SigningProfile(stack, 'SigningProfileWithName', {
  platform: signer.Platform.AWS_LAMBDA_SHA384_ECDSA,
  signingProfileName: 'test-signing-profile-name',
});

new IntegTest(app, 'cdk-integ-signer-signing-profile', {
  testCases: [stack],
});

import cxapi = require('@aws-cdk/cx-api');
import fs = require('fs-extra');
import os = require('os');
import path = require('path');
import { deployStack, DeployStackResult } from './deploy-stack';
import { ISDK } from './util/sdk';

// tslint:disable:max-line-length

/** @experimental */
export const BUCKET_NAME_OUTPUT = 'BucketName';
/** @experimental */
export const BUCKET_DOMAIN_NAME_OUTPUT = 'BucketDomainName';

/** @experimental */
export async function bootstrapEnvironment(environment: cxapi.Environment, aws: ISDK, toolkitStackName: string, roleArn: string | undefined, toolkitBucketName: string | undefined): Promise<DeployStackResult> {

  const template = {
    Description: "The CDK Toolkit Stack. It was created by `cdk bootstrap` and manages resources necessary for managing your Cloud Applications with AWS CDK.",
    Resources: {
      StagingBucket: {
        Type: "AWS::S3::Bucket",
        Properties: {
          BucketName: toolkitBucketName,
          AccessControl: "Private",
          BucketEncryption: { ServerSideEncryptionConfiguration: [{ ServerSideEncryptionByDefault: { SSEAlgorithm: "aws:kms" } }] }
        }
      }
    },
    Outputs: {
      [BUCKET_NAME_OUTPUT]: {
        Description: "The name of the S3 bucket owned by the CDK toolkit stack",
        Value: { Ref: "StagingBucket" }
      },
      [BUCKET_DOMAIN_NAME_OUTPUT]: {
        Description: "The domain name of the S3 bucket owned by the CDK toolkit stack",
        Value: { "Fn::GetAtt": ["StagingBucket", "DomainName"] }
      }
    }
  };

  const outdir = await fs.mkdtemp(path.join(os.tmpdir(), 'cdk-bootstrap'));
  const builder = new cxapi.CloudAssemblyBuilder(outdir);
  const templateFile = `${toolkitStackName}.template.json`;

  await fs.writeJson(path.join(builder.outdir, templateFile), template, { spaces: 2 });

  builder.addArtifact(toolkitStackName, {
    type: cxapi.ArtifactType.AWS_CLOUDFORMATION_STACK,
    environment: cxapi.EnvironmentUtils.format(environment.account, environment.region),
    properties: {
      templateFile
    },
  });

  const assembly = builder.build();
  return await deployStack({ stack: assembly.getStack(toolkitStackName), sdk: aws, roleArn });
}

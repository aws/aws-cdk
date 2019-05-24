import { Environment, ICloudFormationStackArtifact } from '@aws-cdk/cx-api';
import { deployStack, DeployStackResult } from './deploy-stack';
import { SDK } from './util/sdk';

// tslint:disable:max-line-length

export const BUCKET_NAME_OUTPUT = 'BucketName';
export const BUCKET_DOMAIN_NAME_OUTPUT = 'BucketDomainName';

export async function bootstrapEnvironment(environment: Environment, aws: SDK, toolkitStackName: string, roleArn: string | undefined, toolkitBucketName: string | undefined): Promise<DeployStackResult> {
  const synthesizedStack: ICloudFormationStackArtifact = {
    logicalIdToPathMap: { },
    messages: [],
    depends: [],
    autoDeploy: true,
    metadata: { },
    missing: { },
    environment,
    assets: [],
    template: {
      Description: "The CDK Toolkit Stack. It was created by `cdk bootstrap` and manages resources necessary for managing your Cloud Applications with AWS CDK.",
      Resources: {
        StagingBucket: {
          Type: "AWS::S3::Bucket",
          Properties: {
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
    },
    id: toolkitStackName,
    name: toolkitStackName,
    originalName: toolkitStackName
  };
  if (toolkitBucketName) {
    synthesizedStack.template.Resources.StagingBucket.Properties.BucketName = toolkitBucketName;
  }
  return await deployStack({ stack: synthesizedStack, sdk: aws, roleArn });
}

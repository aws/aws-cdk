import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';
import { Mode, SdkProvider } from '../aws-auth';
import { deployStack, DeployStackResult } from '../deploy-stack';
import { DEFAULT_TOOLKIT_STACK_NAME, ToolkitInfo } from '../toolkit-info';
import { BootstrapEnvironmentOptions, bootstrapVersionFromTemplate, BUCKET_DOMAIN_NAME_OUTPUT, BUCKET_NAME_OUTPUT } from './bootstrap-props';

// tslint:disable:max-line-length

/** @experimental */
export async function bootstrapEnvironment(environment: cxapi.Environment, sdkProvider: SdkProvider, options: BootstrapEnvironmentOptions): Promise<DeployStackResult> {
  const props = options.parameters ?? {};
  const toolkitStackName = options.toolkitStackName ?? DEFAULT_TOOLKIT_STACK_NAME;

  if (props.trustedAccounts?.length) {
    throw new Error('--trust can only be passed for the new bootstrap experience!');
  }
  if (props.cloudFormationExecutionPolicies?.length) {
    throw new Error('--cloudformation-execution-policies can only be passed for the new bootstrap experience!');
  }

  const template = {
    Description: 'The CDK Toolkit Stack. It was created by `cdk bootstrap` and manages resources necessary for managing your Cloud Applications with AWS CDK.',
    Resources: {
      StagingBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: props.bucketName,
          AccessControl: 'Private',
          BucketEncryption: {
            ServerSideEncryptionConfiguration: [{
              ServerSideEncryptionByDefault: {
                SSEAlgorithm: 'aws:kms',
                KMSMasterKeyID: props.kmsKeyId,
              },
            }]
          },
          PublicAccessBlockConfiguration: {
            BlockPublicAcls: true,
            BlockPublicPolicy: true,
            IgnorePublicAcls: true,
            RestrictPublicBuckets: true,
          },
        }
      },
      StagingBucketPolicy: {
        Type: 'AWS::S3::BucketPolicy',
        Properties: {
          Bucket: { Ref: 'StagingBucket' },
          PolicyDocument: {
            Id: 'AccessControl',
            Version: '2012-10-17',
            Statement: [
              {
                Sid: 'AllowSSLRequestsOnly',
                Action: 's3:*',
                Effect: 'Deny',
                Resource: [
                  { 'Fn::Sub': '${StagingBucket.Arn}' },
                  { 'Fn::Sub': '${StagingBucket.Arn}/*' },
                ],
                Condition: {
                  Bool: { 'aws:SecureTransport': 'false' }
                },
                Principal: '*'
              }
            ]
          }
        },

      },
    },
    Outputs: {
      [BUCKET_NAME_OUTPUT]: {
        Description: 'The name of the S3 bucket owned by the CDK toolkit stack',
        Value: { Ref: 'StagingBucket' }
      },
      [BUCKET_DOMAIN_NAME_OUTPUT]: {
        Description: 'The domain name of the S3 bucket owned by the CDK toolkit stack',
        Value: { 'Fn::GetAtt': ['StagingBucket', 'RegionalDomainName'] }
      }
    }
  };

  const resolvedEnvironment = await sdkProvider.resolveEnvironment(environment);
  const sdk = await sdkProvider.forEnvironment(resolvedEnvironment, Mode.ForWriting);
  const currentBootstrapStack = await ToolkitInfo.lookup(resolvedEnvironment, sdk, toolkitStackName);

  const outdir = await fs.mkdtemp(path.join(os.tmpdir(), 'cdk-bootstrap'));
  const builder = new cxapi.CloudAssemblyBuilder(outdir);
  const templateFile = `${toolkitStackName}.template.json`;

  const newVersion = bootstrapVersionFromTemplate(template);
  if (currentBootstrapStack && newVersion < currentBootstrapStack.version && !options.force) {
    throw new Error(`Refusing to downgrade existing bootstrap stack from version '${currentBootstrapStack.version}' to version '${newVersion}'. Use --force to force.`);
  }

  await fs.writeJson(path.join(builder.outdir, templateFile), template, { spaces: 2 });

  builder.addArtifact(toolkitStackName, {
    type: cxschema.ArtifactType.AWS_CLOUDFORMATION_STACK,
    environment: cxapi.EnvironmentUtils.format(environment.account, environment.region),
    properties: {
      templateFile
    },
  });

  const assembly = builder.buildAssembly();

  return await deployStack({
    stack: assembly.getStackByName(toolkitStackName),
    resolvedEnvironment,
    sdk: await sdkProvider.forEnvironment(resolvedEnvironment, Mode.ForWriting),
    sdkProvider,
    roleArn: options.roleArn,
    tags: props.tags,
    execute: props.execute
  });
}
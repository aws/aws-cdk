import { BootstrappingParameters, BUCKET_DOMAIN_NAME_OUTPUT, BUCKET_NAME_OUTPUT } from './bootstrap-props';

export function legacyBootstrapTemplate(params: BootstrappingParameters): any {
  return {
    Description: 'The CDK Toolkit Stack. It was created by `cdk bootstrap` and manages resources necessary for managing your Cloud Applications with AWS CDK.',
    Conditions: {
      UsePublicAccessBlockConfiguration: {
        'Fn::Equals': [
          params.publicAccessBlockConfiguration || params.publicAccessBlockConfiguration === undefined ? 'true' : 'false',
          'true',
        ],
      },
    },
    Resources: {
      StagingBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: params.bucketName,
          AccessControl: 'Private',
          BucketEncryption: {
            ServerSideEncryptionConfiguration: [{
              ServerSideEncryptionByDefault: {
                SSEAlgorithm: 'aws:kms',
                KMSMasterKeyID: params.kmsKeyId,
              },
            }],
          },
          PublicAccessBlockConfiguration: {
            'Fn::If': [
              'UsePublicAccessBlockConfiguration',
              {
                BlockPublicAcls: true,
                BlockPublicPolicy: true,
                IgnorePublicAcls: true,
                RestrictPublicBuckets: true,
              },
              { Ref: 'AWS::NoValue' },
            ],
          },
        },
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
                  Bool: { 'aws:SecureTransport': 'false' },
                },
                Principal: '*',
              },
            ],
          },
        },
      },
    },
    Outputs: {
      [BUCKET_NAME_OUTPUT]: {
        Description: 'The name of the S3 bucket owned by the CDK toolkit stack',
        Value: { Ref: 'StagingBucket' },
      },
      [BUCKET_DOMAIN_NAME_OUTPUT]: {
        Description: 'The domain name of the S3 bucket owned by the CDK toolkit stack',
        Value: { 'Fn::GetAtt': ['StagingBucket', 'RegionalDomainName'] },
      },
    },
  };
}

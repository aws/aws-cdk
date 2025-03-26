import { Template } from '../../assertions';
import * as cdk from '../../core';
import * as s3 from '../lib';

describe('S3 Bucket Metadata Table', () => {
  test('can configure metadata table', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const destinationBucket = new s3.Bucket(stack, 'DestinationBucket');

    // WHEN
    new s3.Bucket(stack, 'SourceBucket', {
      metadataTable: {
        destination: destinationBucket,
        tableName: 'my-metadata-table',
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      MetadataTableConfiguration: {
        S3TablesDestination: {
          TableBucketArn: {
            'Fn::GetAtt': [
              'DestinationBucket4BECDB47',
              'Arn',
            ],
          },
          TableName: 'my-metadata-table',
        },
      },
    });
  });

  test('does not set MetadataTableConfiguration when metadataTable is not provided', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new s3.Bucket(stack, 'MyBucket');

    // THEN
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::S3::Bucket', 1);

    // Verify the MetadataTableConfiguration property is not present
    const bucketResources = template.findResources('AWS::S3::Bucket');
    const bucketProps = Object.values(bucketResources)[0].Properties;
    expect(bucketProps).toBeUndefined();
  });
});

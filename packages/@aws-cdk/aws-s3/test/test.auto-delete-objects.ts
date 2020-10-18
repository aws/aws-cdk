import { expect, haveResource, not } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as sinon from 'sinon';
import * as s3 from '../lib';
import { handler } from '../lib/auto-delete-objects-handler/index';

export = {
  'when autoDeleteObjects is enabled, a custom resource is provisioned + a lambda handler for it'(test: Test) {
    const stack = new cdk.Stack();

    new s3.Bucket(stack, 'MyBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    expect(stack).to(haveResource('AWS::S3::Bucket'));
    expect(stack).to(haveResource('AWS::Lambda::Function'));
    expect(stack).to(haveResource('Custom::AutoDeleteObjects',
      {
        BucketName: { Ref: 'MyBucketF68F3FF0' },
        ServiceToken: {
          'Fn::GetAtt': [
            'CustomAutoDeleteObjectsCustomResourceProviderHandlerE060A45A',
            'Arn',
          ],
        },
      }));

    test.done();
  },

  'two buckets with autoDeleteObjects enabled share the same cr provider'(test: Test) {
    const app = new cdk.App();
    const stack = new cdk.Stack(app);

    new s3.Bucket(stack, 'MyBucketOne', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
    new s3.Bucket(stack, 'MyBucketTwo', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const template = app.synth().getStackArtifact(stack.artifactId).template;
    const resourceTypes = Object.values(template.Resources).map((r: any) => r.Type).sort();

    test.deepEqual(resourceTypes, [
      // custom resource provider resources
      'AWS::IAM::Role',
      'AWS::Lambda::Function',

      // buckets
      'AWS::S3::Bucket',
      'AWS::S3::Bucket',

      // auto delete object resources
      'Custom::AutoDeleteObjects',
      'Custom::AutoDeleteObjects',
    ]);

    test.done();
  },

  'when only one bucket has autoDeleteObjects enabled, only that bucket gets assigned a custom resource'(test: Test) {
    const app = new cdk.App();
    const stack = new cdk.Stack(app);

    new s3.Bucket(stack, 'MyBucketOne', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
    new s3.Bucket(stack, 'MyBucketTwo', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: false,
    });

    const template = app.synth().getStackArtifact(stack.artifactId).template;
    const resourceTypes = Object.values(template.Resources).map((r: any) => r.Type).sort();

    test.deepEqual(resourceTypes, [
      // custom resource provider resources
      'AWS::IAM::Role',
      'AWS::Lambda::Function',

      // buckets
      'AWS::S3::Bucket',
      'AWS::S3::Bucket',

      // auto delete object resource
      'Custom::AutoDeleteObjects',
    ]);

    // custom resource for MyBucket1 is present
    expect(stack).to(haveResource('Custom::AutoDeleteObjects',
      { BucketName: { Ref: 'MyBucketOneA6BE54C9' } }));

    // custom resource for MyBucket2 is not present
    expect(stack).to(not(haveResource('Custom::AutoDeleteObjects',
      { BucketName: { Ref: 'MyBucketTwoC7437026' } })));

    test.done();
  },

  'iam policy'(test: Test) {
    const stack = new cdk.Stack();

    new s3.Bucket(stack, 'MyBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    expect(stack).to(haveResource('AWS::IAM::Role', {
      Policies: [
        {
          PolicyName: 'Inline',
          PolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Resource: '*',
                Action: [
                  's3:GetObject*',
                  's3:GetBucket*',
                  's3:List*',
                  's3:DeleteObject*',
                  's3:PutObject*',
                  's3:Abort*',
                ],
              },
            ],
          },
        },
      ],
    }));

    test.done();
  },

  'when autoDeleteObjects is enabled, throws if removalPolicy is not specified'(test: Test) {
    const stack = new cdk.Stack();

    test.throws(() => new s3.Bucket(stack, 'MyBucket', { autoDeleteObjects: true }), /removal policy/);

    test.done();
  },

  'custom resource handler': {

    async 'does nothing on create event'(test: Test) {
      sinon.reset();
      const s3Mock = newS3ClientMock();

      const event: Partial<AWSLambda.CloudFormationCustomResourceCreateEvent> = {
        RequestType: 'Create',
        ResourceProperties: {
          ServiceToken: 'Foo',
          BucketName: 'MyBucket',
        },
      };
      await invokeHandler(event, s3Mock);

      sinon.assert.notCalled(s3Mock.listObjectVersions);
      sinon.assert.notCalled(s3Mock.deleteObjects);

      test.done();
    },

    async 'does nothing on update event'(test: Test) {
      sinon.reset();

      const s3Mock = newS3ClientMock();

      const event: Partial<AWSLambda.CloudFormationCustomResourceUpdateEvent> = {
        RequestType: 'Update',
        ResourceProperties: {
          ServiceToken: 'Foo',
          BucketName: 'MyBucket',
        },
      };
      await invokeHandler(event, s3Mock);

      sinon.assert.notCalled(s3Mock.listObjectVersions);
      sinon.assert.notCalled(s3Mock.deleteObjects);

      test.done();
    },

    async 'deletes no objects on delete event when bucket has no objects'(test: Test) {
      sinon.reset();

      const listObjectVersionsMock = sinon.fake.returns({ Versions: [] });
      const s3Mock = newS3ClientMock(listObjectVersionsMock);

      const event: Partial<AWSLambda.CloudFormationCustomResourceDeleteEvent> = {
        RequestType: 'Delete',
        ResourceProperties: {
          ServiceToken: 'Foo',
          BucketName: 'MyBucket',
        },
      };
      await invokeHandler(event, s3Mock);

      sinon.assert.calledOnce(s3Mock.listObjectVersions);
      sinon.assert.notCalled(s3Mock.deleteObjects);

      test.done();
    },

    async 'deletes all objects on delete event'(test: Test) {
      sinon.reset();

      const listObjectVersionsMock = sinon.fake.returns({
        Versions: [
          { Key: 'Key1', VersionId: 'VersionId1' },
          { Key: 'Key2', VersionId: 'VersionId2' },
        ],
      });
      const s3Mock = newS3ClientMock(listObjectVersionsMock);

      const event: Partial<AWSLambda.CloudFormationCustomResourceDeleteEvent> = {
        RequestType: 'Delete',
        ResourceProperties: {
          ServiceToken: 'Foo',
          BucketName: 'MyBucket',
        },
      };
      await invokeHandler(event, s3Mock);

      sinon.assert.calledOnce(s3Mock.listObjectVersions);
      sinon.assert.calledOnce(s3Mock.deleteObjects);

      test.done();
    },
  },
};

async function invokeHandler(event: Partial<AWSLambda.CloudFormationCustomResourceEvent>, s3client: any) {
  return handler(event as any, s3client);
}

function newS3ClientMock(listObjectVersionsMock?: any, deleteObjectsMock?: any) {
  return {
    listObjectVersions: sinon.stub().returns({
      promise: listObjectVersionsMock ?? sinon.fake.returns({}),
    }),
    deleteObjects: sinon.stub().returns({
      promise: deleteObjectsMock ?? sinon.fake.returns({}),
    }),
  };
}

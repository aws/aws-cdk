import type { SpecDatabase, Service } from '@aws-cdk/service-spec-types';
import { emptyDatabase } from '@aws-cdk/service-spec-types';
import { ref } from '@cdklabs/tskb';
import { Module, TypeScriptRenderer } from '@cdklabs/typewriter';
import { CDK_CORE } from '../lib/cdk/cdk';
import { BucketEncryptionMixin } from '../lib/type-mixins/bucket-encryption';

const renderer = new TypeScriptRenderer();
let db: SpecDatabase;
let service: Service;

beforeEach(() => {
  db = emptyDatabase();
  service = db.allocate('service', {
    name: 'aws-s3',
    shortName: 's3',
    capitalized: 'S3',
    cloudFormationNamespace: 'AWS::S3',
  });
});

test('BucketEncryptionMixin', () => {
  const sseByDefault = db.allocate('typeDefinition', {
    name: 'ServerSideEncryptionByDefault',
    properties: {
      SSEAlgorithm: {
        type: { type: 'string', allowedValues: ['aws:kms', 'AES256', 'aws:kms:dsse'] },
      },
      KMSMasterKeyID: {
        type: { type: 'string' },
      },
    },
  });

  const sseRule = db.allocate('typeDefinition', {
    name: 'ServerSideEncryptionRule',
    properties: {
      BucketKeyEnabled: { type: { type: 'boolean' } },
      ServerSideEncryptionByDefault: { type: { type: 'ref', reference: ref(sseByDefault) } },
    },
  });

  const resource = db.allocate('resource', {
    name: 'Bucket',
    primaryIdentifier: ['BucketName'],
    properties: {
      BucketName: { type: { type: 'string' } },
    },
    attributes: {},
    cloudFormationType: 'AWS::S3::Bucket',
  });

  db.link('hasResource', service, resource);
  db.link('usesType', resource, sseRule);
  db.link('usesType', resource, sseByDefault);

  const rootType = db.follow('usesType', resource).map(x => x.entity).find(td => td.name === 'ServerSideEncryptionRule')!;
  const module = new Module('aws-cdk-lib/aws-s3/mixins');
  CDK_CORE.import(module, 'cdk');
  new BucketEncryptionMixin(module, resource, db, rootType).build();

  expect(renderer.render(module)).toMatchSnapshot();
});

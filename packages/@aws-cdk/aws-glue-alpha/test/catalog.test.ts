import { App, Fn, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as glue from '../lib';

let app: App;
let stack: Stack;

beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack', { env: { account: '123456789012', region: 'us-east-1' } });
});

describe('Catalog.forAccount', () => {
  test('returns a stack-scoped singleton', () => {
    const a = glue.Catalog.forAccount(stack);
    const b = glue.Catalog.forAccount(stack);

    expect(a).toBe(b);
  });

  test('emits no encryption settings resource when nothing is configured', () => {
    glue.Catalog.forAccount(stack);

    Template.fromStack(stack).resourceCountIs('AWS::Glue::DataCatalogEncryptionSettings', 0);
  });

  test('catalogId is the account id', () => {
    const catalog = glue.Catalog.forAccount(stack);

    expect(catalog.catalogId).toEqual('123456789012');
  });
});

describe('encryption at rest', () => {
  test('disabled mode', () => {
    const catalog = glue.Catalog.forAccount(stack);
    catalog.encryptAtRest(glue.DataCatalogEncryptionAtRest.disabled());

    Template.fromStack(stack).hasResourceProperties('AWS::Glue::DataCatalogEncryptionSettings', {
      CatalogId: '123456789012',
      DataCatalogEncryptionSettings: {
        EncryptionAtRest: { CatalogEncryptionMode: 'DISABLED' },
      },
    });
  });

  test('SSE-KMS with a customer-managed key exposes the key and sets the ARN', () => {
    const key = new kms.Key(stack, 'Key');
    const catalog = glue.Catalog.forAccount(stack);
    catalog.encryptAtRest(glue.DataCatalogEncryptionAtRest.kms(key));

    expect(catalog.encryptionKey).toBe(key);
    Template.fromStack(stack).hasResourceProperties('AWS::Glue::DataCatalogEncryptionSettings', {
      DataCatalogEncryptionSettings: {
        EncryptionAtRest: {
          CatalogEncryptionMode: 'SSE-KMS',
          SseAwsKmsKeyId: { 'Fn::GetAtt': [Match.stringLikeRegexp('Key'), 'Arn'] },
        },
      },
    });
  });

  test('SSE-KMS without a key uses an AWS-managed key and exposes no key', () => {
    const catalog = glue.Catalog.forAccount(stack);
    catalog.encryptAtRest(glue.DataCatalogEncryptionAtRest.kms());

    expect(catalog.encryptionKey).toBeUndefined();
    Template.fromStack(stack).hasResourceProperties('AWS::Glue::DataCatalogEncryptionSettings', {
      DataCatalogEncryptionSettings: {
        EncryptionAtRest: {
          CatalogEncryptionMode: 'SSE-KMS',
          SseAwsKmsKeyId: Match.absent(),
        },
      },
    });
  });

  test('SSE-KMS-WITH-SERVICE-ROLE auto-grants the role on the key', () => {
    const key = new kms.Key(stack, 'Key');
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.ServicePrincipal('glue.amazonaws.com') });
    const catalog = glue.Catalog.forAccount(stack);
    catalog.encryptAtRest(glue.DataCatalogEncryptionAtRest.kmsWithServiceRole(role, key));

    Template.fromStack(stack).hasResourceProperties('AWS::Glue::DataCatalogEncryptionSettings', {
      DataCatalogEncryptionSettings: {
        EncryptionAtRest: {
          CatalogEncryptionMode: 'SSE-KMS-WITH-SERVICE-ROLE',
          CatalogEncryptionServiceRole: { 'Fn::GetAtt': [Match.stringLikeRegexp('Role'), 'Arn'] },
        },
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: ['kms:Decrypt', 'kms:Encrypt', 'kms:ReEncrypt*', 'kms:GenerateDataKey*'],
            Effect: 'Allow',
          }),
        ]),
      },
    });
  });

  test('service role without a key does not create a policy', () => {
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.ServicePrincipal('glue.amazonaws.com') });
    const catalog = glue.Catalog.forAccount(stack);
    catalog.encryptAtRest(glue.DataCatalogEncryptionAtRest.kmsWithServiceRole(role));

    expect(catalog.encryptionKey).toBeUndefined();
    Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 0);
  });
});

describe('connection password encryption', () => {
  test('defaults returnConnectionPasswordEncrypted to true', () => {
    const catalog = glue.Catalog.forAccount(stack);
    catalog.encryptConnectionPasswords({});

    Template.fromStack(stack).hasResourceProperties('AWS::Glue::DataCatalogEncryptionSettings', {
      DataCatalogEncryptionSettings: {
        ConnectionPasswordEncryption: { ReturnConnectionPasswordEncrypted: true },
      },
    });
  });

  test('exposes the connection password key', () => {
    const key = new kms.Key(stack, 'Key');
    const catalog = glue.Catalog.forAccount(stack);
    catalog.encryptConnectionPasswords({ kmsKey: key, returnConnectionPasswordEncrypted: false });

    expect(catalog.connectionPasswordKey).toBe(key);
    Template.fromStack(stack).hasResourceProperties('AWS::Glue::DataCatalogEncryptionSettings', {
      DataCatalogEncryptionSettings: {
        ConnectionPasswordEncryption: {
          ReturnConnectionPasswordEncrypted: false,
          KmsKeyId: { 'Fn::GetAtt': [Match.stringLikeRegexp('Key'), 'Arn'] },
        },
      },
    });
  });
});

describe('independence of the two encryption blocks', () => {
  test('the two keys may differ and neither block requires the other', () => {
    const atRestKey = new kms.Key(stack, 'AtRestKey');
    const passwordKey = new kms.Key(stack, 'PasswordKey');
    const catalog = glue.Catalog.forAccount(stack);

    catalog.encryptAtRest(glue.DataCatalogEncryptionAtRest.kms(atRestKey));
    catalog.encryptConnectionPasswords({ kmsKey: passwordKey });

    expect(catalog.encryptionKey).toBe(atRestKey);
    expect(catalog.connectionPasswordKey).toBe(passwordKey);
    // Both blocks live on a single settings resource.
    Template.fromStack(stack).resourceCountIs('AWS::Glue::DataCatalogEncryptionSettings', 1);
    Template.fromStack(stack).hasResourceProperties('AWS::Glue::DataCatalogEncryptionSettings', {
      DataCatalogEncryptionSettings: {
        EncryptionAtRest: { CatalogEncryptionMode: 'SSE-KMS' },
        ConnectionPasswordEncryption: { ReturnConnectionPasswordEncrypted: true },
      },
    });
  });

  test('connection password encryption alone does not emit an at-rest block', () => {
    const catalog = glue.Catalog.forAccount(stack);
    catalog.encryptConnectionPasswords({});

    Template.fromStack(stack).hasResourceProperties('AWS::Glue::DataCatalogEncryptionSettings', {
      DataCatalogEncryptionSettings: {
        EncryptionAtRest: Match.absent(),
        ConnectionPasswordEncryption: Match.objectLike({}),
      },
    });
  });
});

describe('single settings resource per catalog instance', () => {
  test('multiple mutations reuse one settings resource', () => {
    const catalog = glue.Catalog.forAccount(stack);
    catalog.encryptAtRest(glue.DataCatalogEncryptionAtRest.disabled());
    catalog.encryptAtRest(glue.DataCatalogEncryptionAtRest.kms());
    catalog.encryptConnectionPasswords({});

    Template.fromStack(stack).resourceCountIs('AWS::Glue::DataCatalogEncryptionSettings', 1);
  });

  test('the last at-rest configuration wins', () => {
    const catalog = glue.Catalog.forAccount(stack);
    catalog.encryptAtRest(glue.DataCatalogEncryptionAtRest.disabled());
    catalog.encryptAtRest(glue.DataCatalogEncryptionAtRest.kms());

    Template.fromStack(stack).hasResourceProperties('AWS::Glue::DataCatalogEncryptionSettings', {
      DataCatalogEncryptionSettings: {
        EncryptionAtRest: { CatalogEncryptionMode: 'SSE-KMS' },
      },
    });
  });
});

describe('duplicate settings', () => {
  test('two catalogs targeting the same id fail template validation (E3019)', () => {
    glue.Catalog.forAccount(stack).encryptAtRest(glue.DataCatalogEncryptionAtRest.kms());
    glue.Catalog.fromCatalogId(stack, 'Imported', '123456789012').encryptConnectionPasswords({});

    // Both settings resources carry the same CatalogId, which CloudFormation
    // template validation rejects as duplicate primary identifiers (E3019).
    expect(() => Template.fromStack(stack)).toThrow('E3019');
  });

  test('distinct catalog ids emit independent settings resources', () => {
    glue.Catalog.forAccount(stack).encryptAtRest(glue.DataCatalogEncryptionAtRest.kms());
    glue.Catalog.fromCatalogId(stack, 'Other', '999999999999').encryptConnectionPasswords({});

    Template.fromStack(stack).resourceCountIs('AWS::Glue::DataCatalogEncryptionSettings', 2);
  });
});

describe('new Catalog (CfnCatalog)', () => {
  test('creates an AWS::Glue::Catalog and can carry encryption via props', () => {
    const key = new kms.Key(stack, 'Key');
    const catalog = new glue.Catalog(stack, 'Catalog', {
      catalogName: 'my-catalog',
      encryptionAtRest: glue.DataCatalogEncryptionAtRest.kms(key),
    });

    expect(catalog.encryptionKey).toBe(key);
    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Catalog', {
      Name: 'my-catalog',
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Glue::DataCatalogEncryptionSettings', {
      DataCatalogEncryptionSettings: {
        EncryptionAtRest: { CatalogEncryptionMode: 'SSE-KMS' },
      },
    });
  });
});

describe('imports', () => {
  test('fromCatalogId sets id and arn', () => {
    const catalog = glue.Catalog.fromCatalogId(stack, 'Imported', 'some-catalog');

    expect(catalog.catalogId).toEqual('some-catalog');
    expect(stack.resolve(catalog.catalogArn)).toEqual({
      'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':glue:us-east-1:123456789012:catalog/some-catalog']],
    });
  });

  test('fromCatalogArn round-trips the id', () => {
    const arn = 'arn:aws:glue:us-east-1:123456789012:catalog/some-catalog';
    const catalog = glue.Catalog.fromCatalogArn(stack, 'Imported', arn);

    expect(catalog.catalogId).toEqual('some-catalog');
  });

  test('fromCatalogArn treats a resource-name-less ARN as the account catalog, using the ARN account', () => {
    const arn = 'arn:aws:glue:us-east-1:999999999999:catalog';
    const catalog = glue.Catalog.fromCatalogArn(stack, 'Imported', arn);

    expect(catalog.catalogId).toEqual('999999999999');
  });

  test('fromCatalogArn accepts a tokenized ARN without validation', () => {
    const arn = Fn.importValue('SomeCatalogArn');

    expect(() => glue.Catalog.fromCatalogArn(stack, 'Imported', arn)).not.toThrow();
  });

  test.each([
    ['a non-Glue ARN', 'arn:aws:s3:::my-bucket'],
    ['a non-catalog Glue ARN', 'arn:aws:glue:us-east-1:123456789012:database/some-db'],
  ])('fromCatalogArn fails for %s', (_, arn) => {
    expect(() => glue.Catalog.fromCatalogArn(stack, 'Imported', arn))
      .toThrow('expected a Glue catalog ARN');
  });

  test('an imported catalog can attach encryption as a sibling settings resource', () => {
    const catalog = glue.Catalog.fromCatalogId(stack, 'Imported', 'some-catalog');
    catalog.encryptAtRest(glue.DataCatalogEncryptionAtRest.kms());

    Template.fromStack(stack).hasResourceProperties('AWS::Glue::DataCatalogEncryptionSettings', {
      CatalogId: 'some-catalog',
    });
  });
});

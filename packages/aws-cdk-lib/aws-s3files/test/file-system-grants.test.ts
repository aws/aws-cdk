import { Match, Template } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import * as iam from '../../aws-iam';
import * as s3 from '../../aws-s3';
import { Stack } from '../../core';
import { FileSystem, FileSystemGrants } from '../lib';

let stack: Stack;
let vpc: ec2.Vpc;
let bucket: s3.IBucket;
let fileSystem: FileSystem;

beforeEach(() => {
  stack = new Stack(undefined, 'Stack', { env: { account: '123456789012', region: 'us-east-1' } });
  vpc = new ec2.Vpc(stack, 'Vpc');
  bucket = new s3.Bucket(stack, 'Bucket');
  fileSystem = new FileSystem(stack, 'FileSystem', { bucket, vpc });
});

describe('FileSystemGrants', () => {
  test('mount grants only s3files:ClientMount', () => {
    const role = new iam.Role(stack, 'Grantee', { assumedBy: new iam.AccountRootPrincipal() });
    fileSystem.grants.mount(role);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      Roles: [{ Ref: Match.stringLikeRegexp('^Grantee') }],
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 's3files:ClientMount',
            Resource: { 'Fn::GetAtt': [Match.stringLikeRegexp('^FileSystem'), 'FileSystemArn'] },
          }),
        ]),
      },
    });
  });

  test('write grants Mount + ClientWrite', () => {
    const user = new iam.User(stack, 'User');
    fileSystem.grants.write(user);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: ['s3files:ClientMount', 's3files:ClientWrite'],
          }),
        ]),
      },
    });
  });

  test('rootAccess grants Mount + ClientWrite + ClientRootAccess', () => {
    const role = new iam.Role(stack, 'RootRole', { assumedBy: new iam.AccountRootPrincipal() });
    fileSystem.grants.rootAccess(role);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: ['s3files:ClientMount', 's3files:ClientWrite', 's3files:ClientRootAccess'],
          }),
        ]),
      },
    });
  });

  test('imported role still receives a grant', () => {
    const role = iam.Role.fromRoleArn(stack, 'Imported', 'arn:aws:iam::123456789012:role/external');
    fileSystem.grants.mount(role);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      Roles: ['external'],
    });
  });

  test('grants on imported file system fall back to addToPrincipal', () => {
    const imported = FileSystem.fromFileSystemAttributes(stack, 'Imported', { fileSystemId: 'fs-12345678' });
    const role = new iam.Role(stack, 'Grantee2', { assumedBy: new iam.AccountRootPrincipal() });

    FileSystemGrants.fromFileSystem(imported).read(role);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      Roles: [{ Ref: Match.stringLikeRegexp('^Grantee2') }],
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({ Action: 's3files:ClientMount' }),
        ]),
      },
    });
  });

  test('actions() supports custom action sets', () => {
    const role = new iam.Role(stack, 'Custom', { assumedBy: new iam.AccountRootPrincipal() });
    fileSystem.grants.actions(role, ['s3files:DescribeFileSystem']);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({ Action: 's3files:DescribeFileSystem' }),
        ]),
      },
    });
  });
});

import * as fc from 'fast-check';

// We should be testing transitivity as well but it's too much code to generate
// arbitraries that satisfy the precondition enough times to be useful.

function makeNot(obj: any, key: string, notKey: string) {
  if (obj[notKey]) {
    obj[notKey] = obj[key];
    delete obj[key];
  } else {
    delete obj[notKey];
  }
}

/**
 * fc.option generates 'null' by default which our code is not robust against
 *
 * Use a variant that always produces 'undefined'.
 */
function maybe<A>(x: fc.Arbitrary<A>) {
  return fc.option(x, { nil: undefined });
}

//////////////////////////////////////////////////////////////////////
// IAM

const arbitraryArn = fc.oneof(fc.constantFrom('*', 'arn:resource', { Ref: 'SomeResource' }));
const arbitraryAction = fc.constantFrom('*', 's3:*', 's3:GetObject', 's3:PutObject', { Ref: 'SomeAction' });
const arbitraryPrincipal = fc.oneof<any>(
  fc.constant(undefined),
  fc.constant('*'),
  fc.record({ AWS: fc.oneof(fc.string(), fc.constant('*')) }),
  fc.record({ Service: fc.string() }),
  fc.string({ minLength: 1 }).map((svcName) => ({ Service: { 'Fn::Join': ['', [svcName, '.amazonaws.com']] } })),
  fc.record({ Federated: fc.string() }),
);
const arbitraryCondition = fc.oneof(
  fc.constant(undefined),
  fc.constant({ StringEquals: { Key: 'Value' } }),
  fc.constant({ StringEquals: { Key: 'Value' }, NumberEquals: { Key: 5 } }),
);

export const arbitraryStatement = fc.record({
  Sid: fc.oneof(fc.string(), fc.constant(undefined)),
  Effect: fc.constantFrom('Allow', 'Deny'),
  Resource: fc.array(arbitraryArn, { minLength: 0, maxLength: 2 }),
  NotResource: fc.boolean(),
  Action: fc.array(arbitraryAction, { minLength: 1, maxLength: 2 }),
  NotAction: fc.boolean(),
  Principal: fc.array(arbitraryPrincipal, { minLength: 0, maxLength: 2 }),
  NotPrincipal: fc.boolean(),
  Condition: arbitraryCondition,
}).map(record => {
  // This map() that shuffles keys is the easiest way to create variation between Action/NotAction etc.
  makeNot(record, 'Resource', 'NotResource');
  makeNot(record, 'Action', 'NotAction');
  makeNot(record, 'Principal', 'NotPrincipal');
  return record;
});

/**
 * Two statements where one is a modification of the other
 *
 * This is to generate two statements that have a higher chance of being similar
 * than generating two arbitrary statements independently.
 */
export const twoArbitraryStatements = fc.record({
  statement1: arbitraryStatement,
  statement2: arbitraryStatement,
  copySid: fc.boolean(),
  copyEffect: fc.boolean(),
  copyResource: fc.boolean(),
  copyAction: fc.boolean(),
  copyPrincipal: fc.boolean(),
  copyCondition: fc.boolean(),
}).map(op => {
  const original = op.statement1;
  const modified = Object.create(original, {});

  if (op.copySid) { modified.Sid = op.statement2.Sid; }
  if (op.copyEffect) { modified.Effect = op.statement2.Effect; }
  if (op.copyResource) { modified.Resource = op.statement2.Resource; modified.NotResource = op.statement2.NotResource; }
  if (op.copyAction) { modified.Action = op.statement2.Action; modified.NotAction = op.statement2.NotAction; }
  if (op.copyPrincipal) { modified.Principal = op.statement2.Principal; modified.NotPrincipal = op.statement2.NotPrincipal; }
  if (op.copyCondition) { modified.Condition = op.statement2.Condition; }

  return { statement1: original, statement2: modified };
});

//////////////////////////////////////////////////////////////////////
//  SECURITY GROUPS

export const arbitraryRule = fc.record({
  IpProtocol: fc.constantFrom('tcp', 'udp', 'icmp'),
  FromPort: fc.integer({ min: 80, max: 81 }),
  ToPort: fc.integer({ min: 81, max: 82 }),
  CidrIp: fc.constantFrom('0.0.0.0/0', '1.2.3.4/8', undefined, undefined),
  DestinationSecurityGroupId: fc.constantFrom('sg-1234', undefined),
  DestinationPrefixListId: fc.constantFrom('pl-1', undefined),
});

export const twoArbitraryRules = fc.record({
  rule1: arbitraryRule,
  rule2: arbitraryRule,
  copyIp: fc.boolean(),
  copyFromPort: fc.boolean(),
  copyToPort: fc.boolean(),
  copyCidrIp: fc.boolean(),
  copySecurityGroupId: fc.boolean(),
  copyPrefixListId: fc.boolean(),
}).map(op => {
  const original = op.rule1;
  const modified = Object.create(original, {});

  if (op.copyIp) { modified.IpProtocol = op.rule2.IpProtocol; }
  if (op.copyFromPort) { modified.FromPort = op.rule2.FromPort; }
  if (op.copyToPort) { modified.ToPort = op.rule2.ToPort; }
  if (op.copyCidrIp) { modified.CidrIp = op.rule2.CidrIp; }
  if (op.copySecurityGroupId) { modified.DestinationSecurityGroupId = op.rule2.DestinationSecurityGroupId; }
  if (op.copyPrefixListId) { modified.DestinationPrefixListId = op.rule2.DestinationPrefixListId; }

  return { rule1: original, rule2: modified };
});

function maybeIntrinsic<A>(x: fc.Arbitrary<A>) {
  return fc.oneof(
    x,
    x.map((value) => ({ 'Fn::If': ['Condition', value, { Ref: 'AWS::NoValue' }] })),
  );
}

const arbitraryPolicyDocument = fc.record({
  Version: fc.constant('2012-10-17'),
  Statement: maybeIntrinsic(fc.array(maybeIntrinsic(arbitraryStatement), { maxLength: 5 })),
});

//////////////////////////////////////////////////////////////////////
// Generate a template with a subset of a predefined number of resources in it

const arbitraryRole = fc.record({
  AssumeRolePolicyDocument: arbitraryPolicyDocument,
  ManagedPolicyArns: maybe(maybeIntrinsic(fc.array(arbitraryArn, { maxLength: 2 }))),
  Policies: maybe(maybeIntrinsic(fc.array(maybeIntrinsic(fc.record({
    PolicyName: fc.hexaString(),
    PolicyDocument: maybeIntrinsic(arbitraryPolicyDocument),
  })), { maxLength: 3 }))),
});

const arbitraryPolicy = fc.record({
  PolicyName: fc.hexaString(),
  PolicyDocument: maybeIntrinsic(arbitraryPolicyDocument),
});

const arbitraryBucketPolicy = fc.record({
  PolicyDocument: maybeIntrinsic(arbitraryPolicyDocument),
});

const arbitraryIngress = fc.record({
  CidrIp: maybe(fc.hexaString()),
  CidrIpv6: maybe(fc.hexaString()),
  Description: maybe(fc.hexaString()),
  FromPort: maybe(fc.integer()),
  IpProtocol: fc.hexaString(),
  SourcePrefixListId: maybe(fc.hexaString()),
  SourceSecurityGroupId: maybe(fc.hexaString()),
  ToPort: maybe(fc.integer()),
});

const arbitraryEgress = fc.record({
  CidrIp: maybe(fc.hexaString()),
  CidrIpv6: maybe(fc.hexaString()),
  Description: maybe(fc.hexaString()),
  DestinationPrefixListId: maybe(fc.hexaString()),
  DestinationSecurityGroupId: maybe(fc.hexaString()),
  IpProtocol: fc.hexaString(),
  FromPort: maybe(fc.integer()),
  ToPort: maybe(fc.integer()),
});

const arbitrarySecurityGroup = fc.record({
  SecurityGroupIngress: maybe(maybeIntrinsic(fc.array(maybeIntrinsic(arbitraryIngress), { maxLength: 5 }))),
  SecurityGroupEgress: maybe(maybeIntrinsic(fc.array(maybeIntrinsic(arbitraryEgress), { maxLength: 5 }))),
});

export const arbitraryTemplate = fc.record({
  role: maybe(arbitraryRole),
  policy: maybe(arbitraryPolicy),
  bucketWithPolicy: maybe(arbitraryBucketPolicy),
  securityGroup: maybe(arbitrarySecurityGroup),
  ingressRule: maybe(arbitraryIngress),
  egressRule: maybe(arbitraryEgress),
}).map((generate) => {
  return {
    Resources: Object.assign(
      {},
      mapVal(generate.role, (roleProps) => ({
        MyRole: {
          Type: 'AWS::IAM::Role',
          Properties: roleProps,
        },
      })),
      mapVal(generate.role && generate.policy, (policyProps) => ({
        MyPolicy: {
          Type: 'AWS::IAM::Policy',
          Properties: {
            Roles: [{ Ref: 'MyRole' }],
            ...policyProps,
          },
        },
      })),
      mapVal(generate.bucketWithPolicy, (bucketPol) => ({
        MyBucket: {
          Type: 'AWS::S3::Bucket',
        },
        MyBucketPolicy: {
          Type: 'AWS::S3::BucketPolicy',
          Properties: {
            Bucket: { Ref: 'MyBucket' },
            ...bucketPol,
          },
        },
      })),
      mapVal(generate.securityGroup, (sgProps) => ({
        MySecurityGroup: {
          Type: 'AWS::EC2::SecurityGroup',
          Properties: sgProps,
        },
      })),
      mapVal(generate.securityGroup && generate.ingressRule, (ingressProps) => ({
        MyIngress: {
          Type: 'AWS::EC2::SecurityGroupIngress',
          Properties: {
            GroupId: { Ref: 'MySecurityGroup' },
            ...ingressProps,
          },
        },
      })),
      mapVal(generate.securityGroup && generate.egressRule, (egressProps) => ({
        MyEgress: {
          Type: 'AWS::EC2::SecurityGroupEgress',
          Properties: {
            GroupId: { Ref: 'MySecurityGroup' },
            ...egressProps,
          },
        },
      })),
    ),
  };

  function mapVal<A, B>(cond: A, cb: (x: NonNullable<A>) => B): B | {} {
    return cond ? cb(cond) : {};
  }
});

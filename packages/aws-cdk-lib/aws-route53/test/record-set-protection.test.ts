import { Match, Template } from '../../assertions';
import { CfnParameter, Stack } from '../../core';
import { ARecord, CfnRecordSet, HostedZone, mixins, RecordTarget } from '../lib';

const protectionType = 'AWS::Route53::RecordSetProtection';

test('records are unprotected by default', () => {
  const stack = new Stack();
  const zone = new HostedZone(stack, 'Zone', { zoneName: 'example.com' });
  new ARecord(stack, 'Endpoint', { zone, target: RecordTarget.fromIpAddresses('192.0.2.1') });

  Template.fromStack(stack).resourceCountIs(protectionType, 0);
});

test('waits for both weighted A records before protecting their shared DNS name', () => {
  const stack = new Stack();
  const zone = new HostedZone(stack, 'Zone', { zoneName: 'example.com' });
  const records = ['Blue', 'Green'].map((id, i) => new ARecord(stack, id, {
    zone,
    recordName: 'www',
    weight: 50,
    setIdentifier: id,
    target: RecordTarget.fromIpAddresses(`192.0.2.${i + 1}`),
  }));
  records[0].with(new mixins.RecordSetProtection({ additionalRecords: [records[1]], comment: 'Production DNS' }));

  const template = Template.fromStack(stack);
  template.resourceCountIs(protectionType, 1);
  template.hasResource(protectionType, {
    Properties: {
      HostedZoneId: stack.resolve(zone.hostedZoneId),
      RecordName: 'www.example.com.',
      RecordType: 'A',
      Comment: 'Production DNS',
    },
    DependsOn: Object.keys(template.findResources('AWS::Route53::RecordSet')).sort(),
  });
});

test('supports L1 records and token-backed inputs', () => {
  const stack = new Stack();
  const name = new CfnParameter(stack, 'Name');
  const zone = new CfnParameter(stack, 'Zone');
  const comment = new CfnParameter(stack, 'Comment');
  const record = new CfnRecordSet(stack, 'Mail', {
    hostedZoneId: zone.valueAsString,
    name: name.valueAsString,
    type: 'MX',
    ttl: '300',
    resourceRecords: ['10 mail.example.com.'],
  });

  record.with(new mixins.RecordSetProtection({ comment: comment.valueAsString }));
  Template.fromStack(stack).hasResource(protectionType, {
    Properties: { HostedZoneId: { Ref: 'Zone' }, RecordName: { Ref: 'Name' }, RecordType: 'MX', Comment: { Ref: 'Comment' } },
    DependsOn: [stack.getLogicalId(record)],
  });
});

test('reuses one protection across repeated applications and equivalent record identities', () => {
  const stack = new Stack();
  const first = new CfnRecordSet(stack, 'Blue', {
    name: 'WWW.example.com.',
    type: 'A',
    hostedZoneId: '/hostedzone/Z123',
    weight: 50,
    setIdentifier: 'blue',
    ttl: '300',
    resourceRecords: ['192.0.2.1'],
  });
  const second = new CfnRecordSet(stack, 'Green', {
    name: 'www.example.com',
    type: 'A',
    hostedZoneId: 'Z123',
    weight: 50,
    setIdentifier: 'green',
    ttl: '300',
    resourceRecords: ['192.0.2.2'],
  });

  first.with(new mixins.RecordSetProtection(), new mixins.RecordSetProtection());
  second.with(new mixins.RecordSetProtection());

  const template = Template.fromStack(stack);
  template.resourceCountIs(protectionType, 1);
  template.hasResource(protectionType, {
    Properties: { Comment: Match.absent() },
    DependsOn: [stack.getLogicalId(first), stack.getLogicalId(second)].sort(),
  });
});

test('fails for conflicting comments on a shared protection', () => {
  const stack = new Stack();
  const record = new CfnRecordSet(stack, 'Record', { name: 'example.com', type: 'A', hostedZoneId: 'Z123' });
  record.with(new mixins.RecordSetProtection({ comment: 'one' }));
  expect(() => record.with(new mixins.RecordSetProtection({ comment: 'two' })))
    .toThrow('use the same protection comment for all records sharing');
});

test.each([
  { name: 'after.example.com.' },
  { type: 'AAAA' },
  { hostedZoneId: 'Z456' },
  { hostedZoneId: undefined },
])('fails at synthesis when the protected record identity changes %j', (change) => {
  const stack = new Stack();
  const record = new CfnRecordSet(stack, 'Record', { name: 'before.example.com.', type: 'A', hostedZoneId: 'Z123' });
  record.with(new mixins.RecordSetProtection());

  Object.assign(record, change);
  expect(() => Template.fromStack(stack)).toThrow('set the hosted zone, name and type before applying RecordSetProtection');
});

test.each(['additional record', 'separate application'])('fails when a weighted sibling changes identity after protection via %s', (grouping) => {
  const stack = new Stack();
  const props = { name: 'before.example.com.', type: 'A', hostedZoneId: 'Z123', weight: 50 };
  const blue = new CfnRecordSet(stack, 'Blue', { ...props, setIdentifier: 'blue' });
  const green = new CfnRecordSet(stack, 'Green', { ...props, setIdentifier: 'green' });
  if (grouping === 'additional record') {
    blue.with(new mixins.RecordSetProtection({ additionalRecords: [green] }));
  } else {
    blue.with(new mixins.RecordSetProtection());
    green.with(new mixins.RecordSetProtection());
  }

  green.name = 'after.example.com.';
  expect(() => Template.fromStack(stack)).toThrow('set the hosted zone, name and type before applying RecordSetProtection');
});

test('accepts equivalent identity spellings and edits to other record properties before synthesis', () => {
  const stack = new Stack();
  const record = new CfnRecordSet(stack, 'Record', { name: 'www.example.com.', type: 'A', hostedZoneId: 'Z123' });
  record.with(new mixins.RecordSetProtection());
  record.name = 'WWW.example.com';
  record.hostedZoneId = '/hostedzone/Z123';
  record.ttl = '300';

  const template = Template.fromStack(stack);
  template.hasResourceProperties(protectionType, { HostedZoneId: 'Z123', RecordName: 'www.example.com.', RecordType: 'A' });
  template.hasResourceProperties('AWS::Route53::RecordSet', { Name: 'WWW.example.com', TTL: '300' });
});

test('fails when the record only specifies a hosted zone name', () => {
  const stack = new Stack();
  const record = new CfnRecordSet(stack, 'Record', { name: 'www.example.com.', type: 'A', hostedZoneName: 'example.com.' });
  expect(() => record.with(new mixins.RecordSetProtection())).toThrow('set hostedZoneId on the record');
});

test('accepts 256 characters and fails for a longer comment', () => {
  expect(() => new mixins.RecordSetProtection({ comment: 'a'.repeat(256) })).not.toThrow();
  expect(() => new mixins.RecordSetProtection({ comment: 'a'.repeat(257) })).toThrow('protection comment must be at most 256 characters');
});

test.each([
  { name: 'other.example.com' },
  { type: 'AAAA' },
  { hostedZoneId: 'Z456' },
])('fails for an additional record with a different identity %j', (override) => {
  const stack = new Stack();
  const props = { name: 'www.example.com', type: 'A', hostedZoneId: 'Z123' };
  const first = new CfnRecordSet(stack, 'First', props);
  const other = new CfnRecordSet(stack, 'Other', { ...props, ...override });
  expect(() => first.with(new mixins.RecordSetProtection({ additionalRecords: [other] })))
    .toThrow("must share the protected record's hosted zone, name and type");
  Template.fromStack(stack).resourceCountIs(protectionType, 0);
});

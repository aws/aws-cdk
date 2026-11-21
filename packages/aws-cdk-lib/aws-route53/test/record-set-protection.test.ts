import { Match, Template } from '../../assertions';
import type { IResolveContext } from '../../core';
import { App, Aspects, CfnParameter, Fn, Lazy, Mixins, Stack, Token } from '../../core';
import { ARecord, CfnRecordSet, HostedZone, mixins, RecordTarget } from '../lib';

const protectionType = 'AWS::Route53::RecordSetProtection';

test('records are unprotected by default', () => {
  const stack = new Stack();
  const zone = new HostedZone(stack, 'Zone', { zoneName: 'example.com' });
  new ARecord(stack, 'Endpoint', { zone, target: RecordTarget.fromIpAddresses('192.0.2.1') });

  Template.fromStack(stack).resourceCountIs(protectionType, 0);
});

test('ignores a hosted zone without record sets', () => {
  const stack = new Stack();
  const zone = new HostedZone(stack, 'Zone', { zoneName: 'example.com' });
  const protection = new mixins.RecordSetProtection();
  expect(protection.supports(zone.node.defaultChild!)).toBe(false);
  zone.with(protection);

  Template.fromStack(stack).resourceCountIs(protectionType, 0);
});

test('waits for both weighted A records before protecting their shared DNS name', () => {
  const stack = new Stack();
  const zone = new HostedZone(stack, 'Zone', { zoneName: 'example.com' });
  ['Blue', 'Green'].forEach((id, i) => new ARecord(stack, id, {
    zone,
    recordName: 'www',
    weight: 50,
    setIdentifier: id,
    target: RecordTarget.fromIpAddresses(`192.0.2.${i + 1}`),
  }));
  Mixins.of(stack).apply(new mixins.RecordSetProtection({ comment: 'Production DNS' }));

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

test.each(['literal', 'join'])('keeps the same %s protection when applications are reversed', (identity) => {
  function synthesize(reverse: boolean) {
    const stack = new Stack();
    const suffix = new CfnParameter(stack, 'Suffix');
    const records = ['Blue', 'Green'].map((id, i) => {
      const name = identity === 'join' ? Fn.join('', ['www.', suffix.valueAsString, '.']) : ['WWW.example.com.', 'www.example.com'][i];
      return new CfnRecordSet(stack, id, {
        name,
        type: 'A',
        hostedZoneId: ['/hostedzone/Z123', 'Z123'][i],
        setIdentifier: id,
        weight: 50,
        ttl: '300',
        resourceRecords: [`192.0.2.${i + 1}`],
      });
    });

    for (const record of reverse ? records.reverse() : records) {
      const comment = record.node.id === 'Green' ? 'Production DNS' : undefined;
      record.with(new mixins.RecordSetProtection({ comment }), new mixins.RecordSetProtection());
    }

    const template = Template.fromStack(stack);
    template.resourceCountIs(protectionType, 1);
    template.hasResource(protectionType, {
      Properties: { Comment: 'Production DNS', RecordType: 'A' },
      DependsOn: records.map(record => stack.getLogicalId(record)).sort(),
    });
    return template.findResources(protectionType);
  }

  expect(synthesize(true)).toEqual(synthesize(false));
});

test('stack-wide application groups records by hosted zone, name and type', () => {
  const stack = new Stack();
  const records = [
    { id: 'Blue', zone: 'Z1', name: 'www.example.com.', type: 'A' },
    { id: 'Green', zone: 'Z1', name: 'www.example.com.', type: 'A' },
    { id: 'Ipv6', zone: 'Z1', name: 'www.example.com.', type: 'AAAA' },
    { id: 'Api', zone: 'Z1', name: 'api.example.com.', type: 'A' },
    { id: 'OtherZone', zone: 'Z2', name: 'www.example.com.', type: 'A' },
  ].map(({ id, zone, name, type }) => new CfnRecordSet(stack, id, {
    hostedZoneId: zone,
    name,
    type,
    setIdentifier: id,
    weight: 50,
    ttl: '300',
    resourceRecords: [type === 'AAAA' ? '2001:db8::1' : '192.0.2.1'],
  }));
  Mixins.of(stack).apply(new mixins.RecordSetProtection());

  const template = Template.fromStack(stack);
  template.resourceCountIs(protectionType, 4);
  for (const group of [records.slice(0, 2), [records[2]], [records[3]], [records[4]]]) {
    const record = group[0];
    template.hasResource(protectionType, {
      Properties: { HostedZoneId: record.hostedZoneId, RecordName: record.name, RecordType: record.type, Comment: Match.absent() },
      DependsOn: group.map(member => stack.getLogicalId(member)).sort(),
    });
  }
});

test('keeps protections local to their stacks in the same app', () => {
  const app = new App();
  const stacks = ['First', 'Second'].map(id => new Stack(app, id));
  const records = stacks.map(stack => {
    const record = new CfnRecordSet(stack, `Record${stack.node.id}`, { name: 'example.com.', type: 'A', hostedZoneId: 'Z123' });
    record.with(new mixins.RecordSetProtection({ comment: stack.stackName }));
    return record;
  });

  for (const record of records) {
    const stack = Stack.of(record);
    const template = Template.fromStack(stack);
    template.resourceCountIs(protectionType, 1);
    template.hasResource(protectionType, {
      Properties: { Comment: stack.stackName },
      DependsOn: [stack.getLogicalId(record)],
    });
  }
});

test('distinguishes hosted zones with the same logical ID in different producer stacks', () => {
  const app = new App();
  const consumer = new Stack(app, 'Consumer');
  const zones = ['First', 'Second'].map(id => {
    const producer = new Stack(app, id);
    return new HostedZone(producer, 'Zone', { zoneName: 'example.com' });
  });
  const records = zones.map((zone, i) => new CfnRecordSet(consumer, `Record${i}`, {
    name: 'www.example.com.', type: 'A', hostedZoneId: zone.hostedZoneId, ttl: '300', resourceRecords: ['192.0.2.1'],
  }));
  Mixins.of(consumer).apply(new mixins.RecordSetProtection());

  const template = Template.fromStack(consumer);
  template.resourceCountIs(protectionType, 2);
  for (const record of records) {
    const recordId = consumer.getLogicalId(record);
    const zone = template.findResources('AWS::Route53::RecordSet')[recordId].Properties.HostedZoneId;
    template.hasResource(protectionType, { Properties: { HostedZoneId: zone }, DependsOn: [recordId] });
  }
});

test('uses the final value of independently constructed lazy names', () => {
  const stack = new Stack();
  let name: string | undefined;
  for (const id of ['Blue', 'Green']) {
    const record = new CfnRecordSet(stack, id, {
      hostedZoneId: 'Z123',
      type: 'A',
      setIdentifier: id,
      weight: 50,
      ttl: '300',
      resourceRecords: ['192.0.2.1'],
      name: Lazy.string({ produce: () => name }),
    });
    record.with(new mixins.RecordSetProtection());
  }
  name = 'www.example.com.';

  const template = Template.fromStack(stack);
  template.resourceCountIs(protectionType, 1);
  template.hasResource(protectionType, {
    Properties: { RecordName: name },
    DependsOn: Object.keys(template.findResources('AWS::Route53::RecordSet')).sort(),
  });
});

test('resolves the name in the same scope as the protected record', () => {
  const stack = new Stack(undefined, 'Dns');
  const name = Token.asString({
    creationStack: [],
    resolve: (context: IResolveContext) => `${context.scope.node.id.toLowerCase()}.example.com.`,
  });
  const record = new CfnRecordSet(stack, 'Blue', { name, hostedZoneId: 'Z123', type: 'A' });
  record.with(new mixins.RecordSetProtection());
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::Route53::RecordSet', { Name: 'dns.example.com.' });
  template.hasResourceProperties(protectionType, { RecordName: 'dns.example.com.' });
});

test('fails if a later aspect changes a token used to group records', () => {
  const stack = new Stack();
  let currentName = 'before.example.com.';
  const name = Token.asString({ creationStack: [], resolve: () => currentName });
  const record = new CfnRecordSet(stack, 'Record', { name, hostedZoneId: 'Z123', type: 'A' });
  record.with(new mixins.RecordSetProtection());
  Aspects.of(record).add({ visit: () => { currentName = 'after.example.com.'; } });

  expect(() => Template.fromStack(stack)).toThrow('set the hosted zone, name and type before applying RecordSetProtection');
});

test('allows the app to use the protection scope name after applying the mixin', () => {
  const stack = new Stack();
  const record = new CfnRecordSet(stack, 'Record', { name: 'www.example.com.', hostedZoneId: 'Z123', type: 'A' });
  record.with(new mixins.RecordSetProtection());
  new CfnParameter(stack, 'Route53RecordSetProtections');

  Template.fromStack(stack).hasResource(protectionType, { DependsOn: [stack.getLogicalId(record)] });
});

test('fails for conflicting comments on a shared protection', () => {
  const stack = new Stack();
  const props = { name: 'example.com.', type: 'A', hostedZoneId: 'Z123' };
  const blue = new CfnRecordSet(stack, 'Blue', { ...props, weight: 50, setIdentifier: 'blue' });
  const green = new CfnRecordSet(stack, 'Green', { ...props, weight: 50, setIdentifier: 'green' });
  expect(() => {
    blue.with(new mixins.RecordSetProtection({ comment: 'one' }));
    green.with(new mixins.RecordSetProtection({ comment: 'two' }));
    Template.fromStack(stack);
  }).toThrow('use the same protection comment for all records sharing');
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

test('fails when a protected weighted sibling changes identity', () => {
  const stack = new Stack();
  const props = { name: 'before.example.com.', type: 'A', hostedZoneId: 'Z123', weight: 50 };
  const blue = new CfnRecordSet(stack, 'Blue', { ...props, setIdentifier: 'blue' });
  const green = new CfnRecordSet(stack, 'Green', { ...props, setIdentifier: 'green' });
  blue.with(new mixins.RecordSetProtection());
  green.with(new mixins.RecordSetProtection());

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

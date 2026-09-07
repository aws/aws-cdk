import type { Service, Resource, SpecDatabase } from '@aws-cdk/service-spec-types';
import { emptyDatabase } from '@aws-cdk/service-spec-types';
import { TypeScriptRenderer } from '@cdklabs/typewriter';
import { EventBridgeBuilder } from '../../scripts/spec2eventbridge/builder';

const renderer = new TypeScriptRenderer();
let db: SpecDatabase;
let service: Service;
let resource: Resource;

beforeEach(() => {
  db = emptyDatabase();
  service = db.allocate('service', {
    name: 'aws-service',
    shortName: 'service',
    capitalized: 'Service',
    cloudFormationNamespace: 'AWS::Service',
  });

  resource = db.allocate('resource', {
    name: 'Resource',
    primaryIdentifier: ['ResourceId'],
    properties: {
      ResourceId: { type: { type: 'string' }, required: true },
    },
    attributes: {},
    cloudFormationType: 'AWS::Service::Resource',
  });
  db.link('hasResource', service, resource);
});

function renderAllModules(builder: EventBridgeBuilder): string {
  const rendered: string[] = [];
  for (const [, module] of builder.modules) {
    if (!module.isEmpty()) {
      rendered.push(renderer.render(module));
    }
  }
  return rendered.join('\n');
}

test('generates standalone event when event has no resourcesField', () => {
  const detailTypeDef = db.allocate('eventTypeDefinition', {
    name: 'Created',
    properties: {
      prop1: { type: { type: 'string' } },
      prop2: { type: { type: 'string' } },
    },
  });

  const event = db.allocate('event', {
    name: 'aws.service@Created',
    description: '',
    source: 'aws.service',
    detailType: 'Created',
    rootProperty: { $ref: detailTypeDef.$id },
    resourcesField: [],
  });
  db.link('serviceHasEvent', service, event);

  const builder = new EventBridgeBuilder({ db });
  builder.addService(service);

  const rendered = renderAllModules(builder);
  expect(rendered).toMatchSnapshot();
  expect(rendered).toContain('static eventPattern');
  expect(rendered).not.toContain('ResourceEvents');
});

test('generates multiple event methods on a resource events class', () => {
  // The resourcesField type must have a property whose name matches the resource reference prop.
  // "id" matches "resourceId" via `${resource.name}${propName}` -> "Resourceid" -> "resourceid"
  const resourceFieldTypeDef = db.allocate('eventTypeDefinition', {
    name: 'Resource',
    properties: {
      id: { type: { type: 'string' } },
    },
  });

  const createdDetail = db.allocate('eventTypeDefinition', {
    name: 'Created',
    properties: {
      resource: { type: { type: 'ref', reference: { $ref: resourceFieldTypeDef.$id } } },
      prop1: { type: { type: 'string' } },
    },
  });

  const deletedDetail = db.allocate('eventTypeDefinition', {
    name: 'Deleted',
    properties: {
      resource: { type: { type: 'ref', reference: { $ref: resourceFieldTypeDef.$id } } },
      prop1: { type: { type: 'string' } },
    },
  });

  const createdEvent = db.allocate('event', {
    name: 'aws.service@Created',
    description: '',
    source: 'aws.service',
    detailType: 'Created',
    rootProperty: { $ref: createdDetail.$id },
    resourcesField: [{
      type: { $ref: resourceFieldTypeDef.$id },
      resource: { $ref: resource.$id },
    }],
  });

  const deletedEvent = db.allocate('event', {
    name: 'aws.service@Deleted',
    description: '',
    source: 'aws.service',
    detailType: 'Deleted',
    rootProperty: { $ref: deletedDetail.$id },
    resourcesField: [{
      type: { $ref: resourceFieldTypeDef.$id },
      resource: { $ref: resource.$id },
    }],
  });

  db.link('resourceHasEvent', resource, createdEvent);
  db.link('resourceHasEvent', resource, deletedEvent);
  db.link('serviceHasEvent', service, createdEvent);
  db.link('serviceHasEvent', service, deletedEvent);

  const builder = new EventBridgeBuilder({ db });
  builder.addService(service);

  const rendered = renderAllModules(builder);
  expect(rendered).toMatchSnapshot();
});

test('generates nested type definitions for complex event shapes', () => {
  const resourceFieldTypeDef = db.allocate('eventTypeDefinition', {
    name: 'ResourceRef',
    properties: {
      id: { type: { type: 'string' } },
    },
  });

  const nestedType = db.allocate('eventTypeDefinition', {
    name: 'Metadata',
    properties: {
      prop1: { type: { type: 'string' } },
      prop2: { type: { type: 'string' } },
    },
  });

  const detailTypeDef = db.allocate('eventTypeDefinition', {
    name: 'Created',
    properties: {
      resource: { type: { type: 'ref', reference: { $ref: resourceFieldTypeDef.$id } } },
      metadata: { type: { type: 'ref', reference: { $ref: nestedType.$id } } },
      prop1: { type: { type: 'string' } },
    },
  });

  const event = db.allocate('event', {
    name: 'aws.service@Created',
    description: '',
    source: 'aws.service',
    detailType: 'Created',
    rootProperty: { $ref: detailTypeDef.$id },
    resourcesField: [{
      type: { $ref: resourceFieldTypeDef.$id },
      resource: { $ref: resource.$id },
    }],
  });
  db.link('resourceHasEvent', resource, event);
  db.link('serviceHasEvent', service, event);

  const builder = new EventBridgeBuilder({ db });
  builder.addService(service);

  const rendered = renderAllModules(builder);
  expect(rendered).toMatchSnapshot();
});

test('excluded service produces no events', () => {
  const macieService = db.allocate('service', {
    name: 'aws-macie',
    shortName: 'macie',
    capitalized: 'Macie',
    cloudFormationNamespace: 'AWS::Macie',
  });

  db.link('hasResource', macieService, resource);

  const detailTypeDef = db.allocate('eventTypeDefinition', {
    name: 'Created',
    properties: {
      prop1: { type: { type: 'string' } },
    },
  });

  const event = db.allocate('event', {
    name: 'aws.macie@Created',
    description: '',
    source: 'aws.macie',
    detailType: 'Created',
    rootProperty: { $ref: detailTypeDef.$id },
    resourcesField: [],
  });
  db.link('serviceHasEvent', macieService, event);

  const builder = new EventBridgeBuilder({ db });
  builder.addService(macieService);

  const rendered = renderAllModules(builder);
  expect(rendered).toBe('');
});

test('special characters in property names are sanitized', () => {
  const detailTypeDef = db.allocate('eventTypeDefinition', {
    name: 'Created',
    properties: {
      'source-class': { type: { type: 'string' } },
      'dest-class': { type: { type: 'string' } },
      'foo:bar:id': { type: { type: 'string' } },
    },
  });

  const event = db.allocate('event', {
    name: 'aws.service@Created-event',
    description: '',
    source: 'aws.service',
    detailType: 'Created',
    rootProperty: { $ref: detailTypeDef.$id },
    resourcesField: [],
  });
  db.link('serviceHasEvent', service, event);

  const builder = new EventBridgeBuilder({ db });
  builder.addService(service);

  const rendered = renderAllModules(builder);
  expect(rendered).toMatchSnapshot();
  expect(rendered).toContain('CreatedEvent');

  // camelCase sanitized names
  expect(rendered).toContain('sourceClass');
  expect(rendered).toContain('destClass');
  expect(rendered).toContain('fooBarId');
  // Original names preserved in converter mapping
  expect(rendered).toContain('"source-class"');
  expect(rendered).toContain('"dest-class"');
  expect(rendered).toContain('"foo:bar:id"');
});

test('mixed resource-bound and standalone events in the same service', () => {
  const resourceFieldTypeDef = db.allocate('eventTypeDefinition', {
    name: 'ResourceRef',
    properties: {
      resourceId: { type: { type: 'string' } },
    },
  });

  // Resource-bound event
  const createdDetail = db.allocate('eventTypeDefinition', {
    name: 'Created',
    properties: {
      resource: { type: { type: 'ref', reference: { $ref: resourceFieldTypeDef.$id } } },
      prop1: { type: { type: 'number' } },
    },
  });

  const createdEvent = db.allocate('event', {
    name: 'aws.service@Created',
    description: '',
    source: 'aws.service',
    detailType: 'Created',
    rootProperty: { $ref: createdDetail.$id },
    resourcesField: [{
      type: { $ref: resourceFieldTypeDef.$id },
      resource: { $ref: resource.$id },
    }],
  });

  // Standalone event (no resource binding)
  const deletedDetail = db.allocate('eventTypeDefinition', {
    name: 'Deleted',
    properties: {
      prop1: { type: { type: 'string' } },
    },
  });

  const deletedEvent = db.allocate('event', {
    name: 'aws.service@Deleted',
    description: '',
    source: 'aws.service',
    detailType: 'Deleted',
    rootProperty: { $ref: deletedDetail.$id },
    resourcesField: [],
  });

  db.link('resourceHasEvent', resource, createdEvent);
  db.link('serviceHasEvent', service, createdEvent);
  db.link('serviceHasEvent', service, deletedEvent);

  const builder = new EventBridgeBuilder({ db });
  builder.addService(service);

  const rendered = renderAllModules(builder);
  expect(rendered).toMatchSnapshot();
});

test('unresolvable resourcesField makes event standalone', () => {
  const detailTypeDef = db.allocate('eventTypeDefinition', {
    name: 'Created',
    properties: {
      prop1: { type: { type: 'string' } },
      prop2: { type: { type: 'string' } },
    },
  });

  const event = db.allocate('event', {
    name: 'aws.service@Created',
    description: '',
    source: 'aws.service',
    detailType: 'Created',
    rootProperty: { $ref: detailTypeDef.$id },
    resourcesField: [{
      type: { $ref: detailTypeDef.$id },
      resource: { $ref: resource.$id },
    }],
  });
  db.link('resourceHasEvent', resource, event);
  db.link('serviceHasEvent', service, event);

  const builder = new EventBridgeBuilder({ db });
  builder.addService(service);

  const rendered = renderAllModules(builder);
  expect(rendered).toMatchSnapshot();
  expect(rendered).not.toContain('class ResourceEvents');
  expect(rendered).toContain('class Created');
});

test('service with no events produces no output', () => {
  const builder = new EventBridgeBuilder({ db });
  builder.addService(service);

  const rendered = renderAllModules(builder);
  expect(rendered).toBe('');
});

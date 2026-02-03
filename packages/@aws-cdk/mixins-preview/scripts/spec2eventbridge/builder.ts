import type { Resource, Service, SpecDatabase, Event, TypeDefinition, Property } from '@aws-cdk/service-spec-types';
import { naming } from '@aws-cdk/spec2cdk';
import { CDK_CORE } from '@aws-cdk/spec2cdk/lib/cdk/cdk';
import { TypeConverter } from '@aws-cdk/spec2cdk/lib/cdk/type-converter';
import type { Expression } from '@cdklabs/typewriter';
import { ExternalModule, Module, ClassType, InterfaceType, StructType, Type, expr, stmt, MemberVisibility, FreeFunction } from '@cdklabs/typewriter';
import type { AddServiceProps, LibraryBuilderProps } from '@aws-cdk/spec2cdk/lib/cdk/library-builder';
import { LibraryBuilder } from '@aws-cdk/spec2cdk/lib/cdk/library-builder';
import type { LocatedModule, ServiceSubmoduleProps } from '@aws-cdk/spec2cdk/lib/cdk/service-submodule';
import { BaseServiceSubmodule } from '@aws-cdk/spec2cdk/lib/cdk/service-submodule';
import { eventNamespaceName } from '@aws-cdk/spec2cdk/lib/naming';
import { ResourceReference, type ReferenceProp } from '@aws-cdk/spec2cdk/lib/cdk/reference-props';
import { log } from '@aws-cdk/spec2cdk/lib/util';

/**
 * Error thrown to skip generation of an event and discard all generated code for it
 */
class SkipEventError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SkipEventError';
  }
}

class EventBridgeServiceModule extends BaseServiceSubmodule {
  public readonly constructLibModule: ExternalModule;

  public constructor(props: ServiceSubmoduleProps) {
    super(props);
    this.constructLibModule = new ExternalModule(`aws-cdk-lib/${props.submoduleName}`);
  }
}

export interface EventBridgeBuilderProps extends LibraryBuilderProps {
  filePattern?: string;
}

export class EventBridgeBuilder extends LibraryBuilder<EventBridgeServiceModule> {
  private readonly filePattern: string;
  private tempModule?: Module;

  public constructor(props: EventBridgeBuilderProps) {
    super(props);
    this.filePattern = props.filePattern ?? '%moduleName%/events.generated.ts';
  }

  protected createServiceSubmodule(service: Service, submoduleName: string): EventBridgeServiceModule {
    const hasEvents = this.db.follow('serviceHasEvent', service);
    const submodule = new EventBridgeServiceModule({
      submoduleName,
      service,
    });

    if (hasEvents.length != 0) {
      const tempModuleName = `@aws-cdk/mixins-preview/${submodule.submoduleName}/events-temp`;
      this.tempModule = new Module(tempModuleName);
      CDK_CORE.import(this.tempModule, 'cdk');
      submodule.constructLibModule.import(this.tempModule, 'service');
      const awsEvents = new ExternalModule('aws-cdk-lib/aws-events');
      awsEvents.import(this.tempModule, 'events');

      // Generate standalone events (events without matching resources) at service level
      this.generateStandaloneEvents(submodule, service);
    }

    return submodule;
  }

  protected addResourceToSubmodule(submodule: EventBridgeServiceModule, resource: Resource, _props?: AddServiceProps): void {
    const events = this.db.follow('resourceHasEvent', resource).map((e) => e.entity);
    if (events.length === 0) {
      return;
    }

    const service = this.db.incoming('hasResource', resource).only().entity;

    if (this.tempModule == null) {
      throw Error("shouldn't happen");
    }
    const eventsClass = new EventBridgeEventsClass(this.tempModule, this.db, resource, events, submodule.constructLibModule);
    eventsClass.build();

    // Only create the real module and register if we successfully generated at least one event
    if (eventsClass.hasSuccessfulEvents()) {
      const eventsModule = this.obtainEventsModule(submodule, service);

      // Recreate the class in the real module
      const realEventsClass = new EventBridgeEventsClass(eventsModule.module, this.db, resource, events, submodule.constructLibModule);
      realEventsClass.build();

      submodule.registerResource(resource.cloudFormationType, realEventsClass);
    }
  }

  private generateStandaloneEvents(submodule: EventBridgeServiceModule, service: Service): void {
    const allServiceEvents = this.db.follow('serviceHasEvent', service).map((e) => e.entity);

    if (allServiceEvents.length === 0) {
      return;
    }

    // Find events that have no resource fields (standalone events)
    const standaloneEvents = allServiceEvents.filter(event => event.resourcesField.length === 0);

    if (standaloneEvents.length === 0) {
      return;
    }

    // Generate standalone event classes for events without resources
    if (this.tempModule == null) {
      throw Error("shouldn't happen - tempModule should exist if there are events");
    }

    // Use a dummy resource for standalone events (we only need the service context)
    const dummyResource: Resource = {
      $id: `${service.$id}/DummyResource`,
      name: 'Service',
      cloudFormationType: 'AWS::Service::Dummy',
      documentation: '',
      attributes: {},
      properties: {},
    };

    const standaloneEventsClass = new EventBridgeEventsClass(
      this.tempModule,
      this.db,
      dummyResource,
      standaloneEvents,
      submodule.constructLibModule,
    );
    standaloneEventsClass.build();

    // Only create the real module if we successfully generated at least one standalone event
    if (standaloneEventsClass.hasSuccessfulEvents()) {
      const eventsModule = this.obtainEventsModule(submodule, service);

      // Recreate the standalone events in the real module
      const realStandaloneEventsClass = new EventBridgeEventsClass(
        eventsModule.module,
        this.db,
        dummyResource,
        standaloneEvents,
        submodule.constructLibModule,
      );
      realStandaloneEventsClass.build();
    }
  }

  private createEventsModule(submodule: EventBridgeServiceModule, service: Service): LocatedModule<Module> {
    const module = new Module(`@aws-cdk/mixins-preview/${submodule.submoduleName}/events`);
    const filePath = this.pathFor(this.filePattern, submodule.submoduleName, service);

    submodule.registerModule({ module, filePath });

    // Add ts-ignore for potentially unused service import (when there are only standalone events)
    module.documentation.push('@ts-ignore TS6133');

    CDK_CORE.import(module, 'cdk');
    submodule.constructLibModule.import(module, 'service');

    const awsEvents = new ExternalModule('aws-cdk-lib/aws-events');
    awsEvents.import(module, 'events');

    return { module, filePath };
  }

  private obtainEventsModule(submodule: EventBridgeServiceModule, service: Service): LocatedModule<Module> {
    const mod = this.createEventsModule(submodule, service);
    if (this.modules.has(mod.filePath)) {
      return {
        module: this.modules.get(mod.filePath)!,
        filePath: mod.filePath,
      };
    }

    return this.rememberModule(mod);
  }
}

/**
 * Shared context for generating event-related code
 */
interface EventGenerationContext {
  db: SpecDatabase;
  resource: Resource;
  refInterface: Type;
  referenceName: string;
  referenceProps: ReferenceProp[];
}

/**
 * Generates converter functions and type definitions for events
 */
class SharedConverterGenerator {
  constructor(
    private readonly scope: Module,
    private readonly context: EventGenerationContext,
  ) { }

  /**
   * Creates a TypeConverter with deduplication for nested type definitions
   */
  createTypeConverterForNamespace(namespaceScope: ClassType, event: Event, eventNsName: string, hasResource: boolean): TypeConverter {
    const createdTypes = new Map<string, StructType>();

    return new TypeConverter({
      db: this.context.db,
      resource: this.context.resource,
      resourceClass: namespaceScope,
      isEventBridgeType: true,
      typeDefinitionConverter: (typeDef, converter) => {
        const sanitizedName = naming.sanitizeTypeName(typeDef.name);

        if (createdTypes.has(sanitizedName)) {
          throw Error('Type with the same name are being generated multiple times in the same namespace');
        }

        const structType = new StructType(namespaceScope, {
          export: true,
          name: sanitizedName,
          docs: {
            summary: typeDef.documentation || `Type definition for ${typeDef.name}`,
          },
        });

        createdTypes.set(sanitizedName, structType);

        const build = () => {
          if (Object.keys(typeDef.properties).length > 0) {
            this.addPropertiesAndCreateConverter({
              target: structType,
              properties: typeDef.properties,
              typeConverter: converter,
              converterNamePrefix: `convert${eventNsName}${sanitizedName}ToEventPattern`,
              eventNsName,
              event,
              typeDef,
              addMetadata: false,
              hasResource,
            });
          }
        };

        return { structType, build };
      },
    });
  }

  /**
   * Shared method to add properties to a target (interface or struct) and create a converter function.
   */
  addPropertiesAndCreateConverter({
    target,
    properties,
    typeConverter,
    converterNamePrefix,
    eventNsName,
    event,
    typeDef,
    addMetadata,
    hasResource,
  }: {
    target: InterfaceType | StructType;
    properties: Record<string, Property>;
    typeConverter: TypeConverter;
    converterNamePrefix: string;
    eventNsName: string;
    event: Event;
    typeDef: TypeDefinition;
    addMetadata: boolean;
    hasResource: boolean;
  }): FreeFunction {
    const propertyMappings = new Map<string, { original: string; type: Type; resolver?: Expression }>();
    let nonUndefinedResolvers = 0;

    for (const [propName, propSpec] of Object.entries(properties)) {
      // Check if this property is a resource field and get its resolver
      const resolver = hasResource ? this.getResolver(event, typeDef, propName, propSpec) : undefined;
      if (resolver) nonUndefinedResolvers++;

      // Replace colons with dashes before camelCasing (aws:s3:arn -> aws-s3-arn -> awsS3Arn)
      const camelCaseName = naming.propertyNameFromCloudFormation(propName.replace(/:/g, '-'));
      let propType = typeConverter.typeFromProperty(propSpec);
      propertyMappings.set(camelCaseName, { original: propName, type: propType, resolver });

      if (propType.primitive) {
        propType = Type.arrayOf(Type.STRING);
      }
      const defaultDoc = resolver ?
        `Filter with the ${this.context.resource.name} reference` :
        'Do not filter on this field';

      target.addProperty({
        name: camelCaseName,
        type: propType,
        optional: true,
        immutable: true,
        docs: {
          summary: propSpec.documentation || `${propName} property`,
          remarks: `Specify an array of string values to match this event if the actual value of ${propName} is one of the values in the array. Use one of the constructors on the \`aws_events.Match\`  for more advanced matching options.`,
          default: defaultDoc,
        },
      });
    }

    if (addMetadata) {
      target.addProperty({
        name: 'eventMetadata',
        type: CDK_CORE.AWSEventMetadataProps,
        optional: true,
        immutable: true,
        docs: {
          summary: 'EventBridge event metadata',
          default: '-',
        },
      });
    }

    // Generate converter function
    const converterFunction = new FreeFunction(this.scope, {
      name: converterNamePrefix,
      returnType: Type.ANY,
    });

    const paramName = 'obj';
    converterFunction.addParameter({
      name: paramName,
      type: target.type,
      optional: true,
    });

    // Add iRef parameter only if event has resource
    if (hasResource) {
      converterFunction.addParameter({
        name: 'iRef',
        type: this.context.refInterface,
        optional: true,
      });
    }

    // Build object mapping with recursive conversion for nested structs
    const mappings = Array.from(propertyMappings.entries()).map(([camelCase, { original, type, resolver }]) => {
      const propAccess = expr.directCode(`${paramName}?.${camelCase}`);
      let valueExpr: Expression = propAccess;

      // If property is a struct, call its converter recursively
      if (type.symbol) {
        const propStruct = type.symbol.findDeclaration();
        if (propStruct && propStruct.kind === 'struct') {
          const propStructName = naming.sanitizeTypeName(propStruct.name);
          const propConverterName = `convert${eventNsName}${propStructName}ToEventPattern`;
          if (hasResource) {
            valueExpr = expr.ident(propConverterName).call(propAccess, expr.ident('iRef'));
          } else {
            valueExpr = expr.ident(propConverterName).call(propAccess);
          }
        }
      }

      // If property has a resolver, use it as fallback: property ?? resolver
      if (resolver) {
        valueExpr = expr.binOp(propAccess, '??', resolver);
      }

      return [original, valueExpr] as const;
    });

    if (event.resourcesField.some(r => r.type.$ref === typeDef.$id) && nonUndefinedResolvers !== 1) {
      throw new SkipEventError(`Event ${event.name} has ${nonUndefinedResolvers} non-undefined resolvers for ${typeDef.name}`);
    }

    converterFunction.addBody(
      stmt.constVar(
        expr.ident('ret'),
        expr.binOp(expr.object(mappings), 'as', expr.ident('any')),
      ),
      stmt.forConst(expr.destructuringArray(expr.ident('key'), expr.ident('value')), expr.ident('Object.entries(ret)'), stmt.block(
        stmt.if_(expr.eq(expr.ident('value'), expr.UNDEFINED)).then(stmt.directCode('delete ret[key]')),
      )),
      stmt.directCode('if (Object.keys(ret).length === 0) return undefined;'),
      stmt.ret(expr.ident('ret')),
    );

    return converterFunction;
  }

  private getResolver(event: Event, typeDef: TypeDefinition, propName: string, prop: Property): Expression | undefined {
    const rscField = event.resourcesField.find(r => r.type.$ref === typeDef.$id);
    if (!rscField) {
      return undefined;
    }

    let targetProp;
    const sanitizePropName = (name: string) => name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

    if (!rscField.fieldName) {
      const possibleNames = [propName, `${this.context.resource.name}${propName}`].map(n => sanitizePropName(n));
      targetProp = this.context.referenceProps.find(r => possibleNames.includes(r.declaration.name.toLowerCase()));
      if (!targetProp) {
        return undefined;
      }
    } else if (rscField.fieldName === propName) {
      targetProp = this.context.referenceProps.find(r => r.declaration.name.toLowerCase() === sanitizePropName(propName));
      if (!targetProp) {
        throw new SkipEventError(`Could not find property ${event.name}.${propName} in the ref interface. Available properties: ${this.context.referenceProps.map(r => r.declaration.name).join(', ')}`);
      }
    } else {
      return undefined;
    }

    if (prop.type.type !== 'string') {
      throw Error(`${event.name} ${propName} is not a string, but ${prop.type.type}`);
    }

    return expr.list([expr.directCode(`iRef?.${this.context.referenceName}.${targetProp.declaration.name}`)]);
  }
}

/**
 * Generates standalone event namespace classes (e.g., ObjectCreated)
 */
class StandaloneEventGenerator {
  constructor(
    private readonly scope: Module,
    private readonly context: EventGenerationContext,
    private readonly converterGenerator: SharedConverterGenerator,
  ) { }

  generateEventClass(event: Event): { detailInterface: InterfaceType; converterFunction: FreeFunction } {
    const eventsEventPattern = Type.fromName(new ExternalModule('aws-cdk-lib/aws-events'), 'EventPattern');
    const namespaceName = eventNamespaceName(event.name);
    const rootProperty = this.context.db.get('eventTypeDefinition', event.rootProperty);
    const hasResource = event.resourcesField.length > 0;

    // Create namespace class to hold event types
    const eventNamespace = new ClassType(this.scope, {
      name: namespaceName,
      export: true,
      docs: {
        summary: `${event.name} event types for ${this.context.resource.name}`,
      },
    });

    const typeConverter = this.converterGenerator.createTypeConverterForNamespace(eventNamespace, event, namespaceName, hasResource);

    // Create detail interface with event properties
    const detailInterface = new InterfaceType(eventNamespace, {
      name: `${namespaceName}Props`,
      export: true,
      docs: {
        summary: `Props type for ${this.context.resource.name} ${event.name} event`,
      },
    });

    // Add properties and create converter function
    const converterFunction = this.converterGenerator.addPropertiesAndCreateConverter({
      target: detailInterface,
      properties: rootProperty.properties,
      typeConverter,
      converterNamePrefix: `convert${namespaceName}DetailToEventPattern`,
      eventNsName: namespaceName,
      event,
      typeDef: rootProperty,
      addMetadata: true,
      hasResource,
    });

    // Add static pattern method to namespace class
    const methodName = naming.eventPatternMethodName(namespaceName);
    const eventPatternMethod = eventNamespace.addMethod({
      name: methodName,
      static: true,
      returnType: eventsEventPattern,
      docs: {
        summary: `EventBridge event pattern for ${this.context.resource.name} ${event.detailType}`,
      },
    });

    eventPatternMethod.addParameter({
      name: 'options',
      type: detailInterface.type,
      optional: true,
    });

    // Call converter without iRef for standalone usage
    const converterArgs = [expr.ident('options')];

    eventPatternMethod.addBody(
      stmt.ret(
        expr.object({
          source: expr.list([expr.lit(event.source)]),
          detailType: expr.list([expr.lit(event.detailType)]),
          detail: expr.ident(converterFunction.name).call(...converterArgs),
          version: expr.directCode('options?.eventMetadata?.version'),
          resources: expr.directCode('options?.eventMetadata?.resources'),
          region: expr.directCode('options?.eventMetadata?.region'),
        }),
      ),
    );

    return { detailInterface, converterFunction };
  }
}

/**
 * Generates resource-bound event methods (e.g., BucketEvents class methods)
 */
class ResourceBoundEventsGenerator {
  constructor(
    private readonly resourceClass: ClassType,
    private readonly context: EventGenerationContext,
  ) { }

  addEventMethod(event: Event, detailInterface: InterfaceType, converterFunction: FreeFunction): void {
    const eventsEventPattern = Type.fromName(new ExternalModule('aws-cdk-lib/aws-events'), 'EventPattern');
    const namespaceName = eventNamespaceName(event.name);
    const methodName = naming.eventPatternMethodName(namespaceName);

    const eventPatternMethod = this.resourceClass.addMethod({
      name: methodName,
      returnType: eventsEventPattern,
      docs: {
        summary: `EventBridge event pattern for ${this.context.resource.name} ${event.detailType}`,
      },
    });

    eventPatternMethod.addParameter({
      name: 'options',
      type: detailInterface.type,
      optional: true,
    });

    // Call converter with iRef for resource-bound usage
    eventPatternMethod.addBody(
      stmt.ret(
        expr.object({
          source: expr.list([expr.lit(event.source)]),
          detailType: expr.list([expr.lit(event.detailType)]),
          detail: expr.ident(converterFunction.name).call(expr.ident('options'), expr.this_().prop(this.context.referenceName)),
          version: expr.directCode('options?.eventMetadata?.version'),
          resources: expr.directCode('options?.eventMetadata?.resources'),
          region: expr.directCode('options?.eventMetadata?.region'),
        }),
      ),
    );
  }
}

/**
 * Main class that orchestrates event generation for a resource
 */
class EventBridgeEventsClass extends ClassType {
  private readonly context: EventGenerationContext;
  private successfulEventCount = 0;

  constructor(
    scope: Module,
    db: SpecDatabase,
    resource: Resource,
    private readonly events: Event[],
    constructLibModule: ExternalModule,
  ) {
    super(scope, {
      name: `${resource.name}Events`,
      export: true,
      docs: {
        summary: `EventBridge event patterns for ${resource.name}`,
      },
    });

    this.context = {
      db,
      resource,
      refInterface: Type.fromName(constructLibModule, naming.referenceInterfaceName(resource.name)),
      referenceName: naming.referenceInterfaceAttributeName(resource.name),
      referenceProps: new ResourceReference(resource).referenceProps,
    };
  }

  public build() {
    this.generateEvents();

    // Don't add class infrastructure for dummy resources (standalone events only)
    if (this.context.resource.cloudFormationType === 'AWS::Service::Dummy') {
      return;
    }

    // Only add class infrastructure if we successfully generated at least one resource-bound event
    const resourceBoundEvents = this.events.filter(e => e.resourcesField.length > 0);
    const hasResourceBoundEvents = resourceBoundEvents.some(e => {
      // Check if this event was successfully generated by checking if it has methods
      try {
        const namespaceName = eventNamespaceName(e.name);
        const methodName = naming.eventPatternMethodName(namespaceName);
        return this.methods.some(m => m.name === methodName);
      } catch {
        return false;
      }
    });

    if (hasResourceBoundEvents) {
      this.addReferenceProperty();
      this.addConstructor();
      this.addFactoryMethod();
    }
  }

  public hasSuccessfulEvents(): boolean {
    return this.successfulEventCount > 0;
  }

  private generateEvents() {
    const module = Module.of(this);
    const converterGenerator = new SharedConverterGenerator(module, this.context);
    const standaloneGenerator = new StandaloneEventGenerator(module, this.context, converterGenerator);
    const resourceBoundGenerator = new ResourceBoundEventsGenerator(this, this.context);

    for (const event of this.events) {
      try {
        const hasResource = event.resourcesField.length > 0;

        // Generate standalone event class (for all events) and get the generated artifacts
        const { detailInterface, converterFunction } = standaloneGenerator.generateEventClass(event);

        // Generate resource-bound method (only for events with resources)
        if (hasResource) {
          resourceBoundGenerator.addEventMethod(event, detailInterface, converterFunction);
        }

        this.successfulEventCount++;
      } catch (error) {
        if (error instanceof SkipEventError) {
          log.debug(`Skipping event ${event.name} for ${this.context.resource.name}: ${error.message}`);
          continue;
        }
        throw error;
      }
    }
  }

  private addReferenceProperty() {
    const refPropertyName = naming.referenceInterfaceAttributeName(this.context.resource.name);
    this.addProperty({
      name: refPropertyName,
      type: this.context.refInterface,
      immutable: true,
      visibility: MemberVisibility.Private,
      docs: {
        summary: `Reference to the ${this.context.resource.name} construct`,
      },
    });
  }

  private addConstructor() {
    const refPropertyName = naming.referenceInterfaceAttributeName(this.context.resource.name);
    const ctor = this.addInitializer({ visibility: MemberVisibility.Private });
    ctor.addParameter({
      name: refPropertyName,
      type: this.context.refInterface,
    });
    ctor.addBody(stmt.assign(expr.this_().prop(refPropertyName), expr.ident(refPropertyName)));
  }

  private addFactoryMethod() {
    const refPropertyName = naming.referenceInterfaceAttributeName(this.context.resource.name);
    const factory = this.addMethod({
      name: `from${this.context.resource.name}`,
      static: true,
      returnType: this.type,
      docs: {
        summary: `Create ${this.context.resource.name}Events from a ${this.context.resource.name} reference`,
      },
    });
    factory.addParameter({
      name: refPropertyName,
      type: this.context.refInterface,
    });
    factory.addBody(stmt.ret(this.newInstance(expr.ident(refPropertyName))));
  }
}

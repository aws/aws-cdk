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

  public constructor(props: EventBridgeBuilderProps) {
    super(props);
    this.filePattern = props.filePattern ?? '%moduleName%/events.generated.ts';
  }

  protected createServiceSubmodule(service: Service, submoduleName: string): EventBridgeServiceModule {
    return new EventBridgeServiceModule({
      submoduleName,
      service,
    });
  }

  protected addResourceToSubmodule(submodule: EventBridgeServiceModule, resource: Resource, _props?: AddServiceProps): void {
    const events = this.db.follow('resourceHasEvent', resource).map((e) => e.entity);
    if (events.length === 0) {
      return;
    }

    const service = this.db.incoming('hasResource', resource).only().entity;

    // Create a temporary module to test if events can be generated
    const tempModuleName = `@aws-cdk/mixins-preview/${submodule.submoduleName}/events-temp`;
    const tempModule = new Module(tempModuleName);
    CDK_CORE.import(tempModule, 'cdk');
    submodule.constructLibModule.import(tempModule, 'service');
    const awsEvents = new ExternalModule('aws-cdk-lib/aws-events');
    awsEvents.import(tempModule, 'events');

    const eventsClass = new EventBridgeEventsClass(tempModule, this.db, resource, events, submodule.constructLibModule);
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

  private createEventsModule(submodule: EventBridgeServiceModule, service: Service): LocatedModule<Module> {
    const module = new Module(`@aws-cdk/mixins-preview/${submodule.submoduleName}/events`);
    const filePath = this.pathFor(this.filePattern, submodule.submoduleName, service);

    submodule.registerModule({ module, filePath });

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

class EventBridgeEventsClass extends ClassType {
  private readonly refInterface: Type;
  /** The property name on the reference interface that holds the reference object (e.g. "roleRef") */
  private readonly referenceName: string;
  /** The property of the reference interface (e.g roleName, roleArn) */
  private readonly referenceProps: ReferenceProp[];
  /** Count of successfully generated events */
  private successfulEventCount = 0;

  constructor(
    scope: Module,
    private readonly db: SpecDatabase,
    private readonly resource: Resource,
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

    this.refInterface = Type.fromName(constructLibModule, naming.referenceInterfaceName(resource.name));
    this.referenceName = naming.referenceInterfaceAttributeName(resource.name);
    this.referenceProps = new ResourceReference(resource).referenceProps;
  }

  public build() {
    this.generateEvents();

    // Only add class infrastructure if we successfully generated at least one event
    if (this.successfulEventCount > 0) {
      this.addReferenceProperty();
      this.addConstructor();
      this.addFactoryMethod();
    }
  }

  /**
   * Returns true if at least one event was successfully generated
   */
  public hasSuccessfulEvents(): boolean {
    return this.successfulEventCount > 0;
  }

  /**
   * Validates that an event can be generated by checking for resource field issues
   * Throws SkipEventError if validation fails
   */

  /**
   * Shared method to add properties to a target (interface or struct) and create a converter function.
   * This method processes a set of properties, adds them to the target type with proper naming
   * and documentation, and generates a converter function that maps TypeScript property names
   * back to their original EventBridge format.
   *
   * The converter function automatically handles nested struct properties by recursively calling
   * their respective converter functions.
   */
  private addPropertiesAndCreateConverter({
    target,
    properties,
    typeConverter,
    converterNamePrefix,
    eventNsName,
    event,
    typeDef,
    addMetadata,
  }: {
    /** The interface or struct to add properties to */
    target: InterfaceType | StructType;
    /** The properties to process from the event specification */
    properties: Record<string, Property>;
    /** TypeConverter instance to resolve property types */
    typeConverter: TypeConverter;
    /** Name for the generated converter function */
    converterNamePrefix: string;
    /** Event namespace name for naming nested converters */
    eventNsName: string;
    /** Event object for resource field identification */
    event: Event;
    /** Type definition for resource field identification */
    typeDef: TypeDefinition;
    addMetadata: boolean;
  }): FreeFunction {
    const propertyMappings = new Map<string, { original: string; type: Type; resolver?: Expression }>();
    const module = Module.of(this);
    let nonUndefinedResolvers = 0;

    for (const [propName, propSpec] of Object.entries(properties)) {
      // Check if this property is a resource field and get its resolver
      const resolver = this.getResolver(event, typeDef, propName, propSpec);
      if (resolver) nonUndefinedResolvers++;

      // Replace colons with dashes before camelCasing (aws:s3:arn -> aws-s3-arn -> awsS3Arn)
      const camelCaseName = naming.propertyNameFromCloudFormation(propName.replace(/:/g, '-'));
      let propType = typeConverter.typeFromProperty(propSpec);
      propertyMappings.set(camelCaseName, { original: propName, type: propType, resolver });

      if (propType.primitive) {
        propType = Type.arrayOf(Type.STRING);
      }
      const defaultDoc = resolver ?
        `Filter with the ${this.resource.name} reference` :
        'Do not filter on this field';
      // Suppress JSII5019 when property name conflicts with the declaring type name
      const docTags = camelCaseName.toLowerCase() === target.name.toLowerCase()
        ? { jsii: 'suppress JSII5019 Generated code' }
        : undefined;
      // Always add property to interface (even if it has a resolver)
      target.addProperty({
        name: camelCaseName,
        type: propType,
        optional: true,
        immutable: true,
        docs: {
          summary: propSpec.documentation || `${propName} property`,
          remarks: `Specify an array of string values to match this event if the actual value of ${propName} is one of the values in the array. Use one of the constructors on the \`aws_events.Match\`  for more advanced matching options.`,
          default: defaultDoc,
          docTags,
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
    const converterFunction = new FreeFunction(module, {
      name: converterNamePrefix,
      returnType: Type.ANY,
    });

    const paramName = 'obj';
    converterFunction.addParameter({
      name: paramName,
      type: target.type,
      optional: true,
    });

    // Add iRef parameter for accessing reference properties
    converterFunction.addParameter({
      name: 'iRef',
      type: this.refInterface,
    });

    // Build object mapping with recursive conversion for nested structs
    const mappings = Array.from(propertyMappings.entries()).map(([camelCase, { original, type, resolver }]) => {
      // Use optional chaining for safe property access since obj can be undefined
      const propAccess = expr.directCode(`${paramName}?.${camelCase}`);
      let valueExpr: Expression = propAccess;

      // If property is a struct, call its converter recursively (passing iRef)
      // Always call converter even if property is undefined, so resolvers can inject values
      if (type.symbol) {
        const propStruct = type.symbol.findDeclaration();
        if (propStruct && propStruct.kind === 'struct') {
          const propStructName = naming.sanitizeTypeName(propStruct.name);
          const propConverterName = `convert${eventNsName}${propStructName}ToEventPattern`;
          valueExpr = expr.ident(propConverterName).call(propAccess, expr.ident('iRef'));
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
    // TODO: do better
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

  /**
   * Creates a TypeConverter with deduplication for nested type definitions
   */
  private createTypeConverterForNamespace(namespaceScope: ClassType, event: Event, eventNsName: string): TypeConverter {
    const createdTypes = new Map<string, StructType>();

    return new TypeConverter({
      db: this.db,
      resource: this.resource,
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
            });
          }
        };

        return { structType, build };
      },
    });
  }

  /**
   * Generates event namespaces, interfaces, and pattern methods for each event
   * Creates: namespace class, detail interface, pattern props, and event pattern method
   */
  private generateEvents() {
    const eventsEventPattern = Type.fromName(new ExternalModule('aws-cdk-lib/aws-events'), 'EventPattern');

    for (const event of this.events) {
      try {
        // console.log(event.name);
        const namespaceName = eventNamespaceName(event.name);
        const rootProperty = this.db.get('eventTypeDefinition', event.rootProperty);

        // Create namespace class to hold event types
        const eventNamespace = new ClassType(this, {
          name: namespaceName,
          export: true,
          docs: {
            summary: `${event.name} event types for ${this.resource.name}`,
          },
        });

        const typeConverter = this.createTypeConverterForNamespace(eventNamespace, event, namespaceName);

        // Create detail interface with event properties
        const detailInterface = new InterfaceType(eventNamespace, {
          name: `${namespaceName}Props`,
          export: true,
          docs: {
            summary: `Props type for ${this.resource.name} ${event.name} event`,
          },
        });

        // Add properties and create converter function
        const converterFunction = this.addPropertiesAndCreateConverter({
          target: detailInterface,
          properties: rootProperty.properties,
          typeConverter,
          converterNamePrefix: `convert${namespaceName}DetailToEventPattern`,
          eventNsName: namespaceName,
          event,
          typeDef: rootProperty,
          addMetadata: true,
        });

        // Create event pattern method that returns events.EventPattern
        const methodName = naming.eventPatternMethodName(namespaceName);
        const eventPatternMethod = this.addMethod({
          name: methodName,
          returnType: eventsEventPattern,
          docs: {
            summary: `EventBridge event pattern for ${this.resource.name} ${event.detailType}`,
          },
        });
        eventPatternMethod.addParameter({
          name: 'options',
          type: detailInterface.type,
          optional: true,
        });

        eventPatternMethod.addBody(
          stmt.ret(
            expr.object({
              source: expr.list([expr.lit(event.source)]),
              detailType: expr.list([expr.lit(event.detailType)]),
              detail: expr.ident(converterFunction.name).call(expr.ident('options'), expr.this_().prop(this.referenceName)),
              version: expr.directCode('options?.eventMetadata?.version'),
              resources: expr.directCode('options?.eventMetadata?.resources'),
              region: expr.directCode('options?.eventMetadata?.region'),
            }),
          ),
        );

        // Event generated successfully
        this.successfulEventCount++;
      } catch (error) {
        if (error instanceof SkipEventError) {
          log.debug(`Skipping event ${event.name} for ${this.resource.name}: ${error.message}`);
          // Event generation is skipped, all generated code for this event is discarded
          continue;
        }
        throw error;
      }
    }
  }

  private addReferenceProperty() {
    const refPropertyName = naming.referenceInterfaceAttributeName(this.resource.name);
    this.addProperty({
      name: refPropertyName,
      type: this.refInterface,
      immutable: true,
      visibility: MemberVisibility.Private,
      docs: {
        summary: `Reference to the ${this.resource.name} construct`,
      },
    });
  }

  private addConstructor() {
    const refPropertyName = naming.referenceInterfaceAttributeName(this.resource.name);
    const ctor = this.addInitializer({ visibility: MemberVisibility.Private });
    ctor.addParameter({
      name: refPropertyName,
      type: this.refInterface,
    });
    ctor.addBody(stmt.assign(expr.this_().prop(refPropertyName), expr.ident(refPropertyName)));
  }

  private addFactoryMethod() {
    const refPropertyName = naming.referenceInterfaceAttributeName(this.resource.name);
    const factory = this.addMethod({
      name: `from${this.resource.name}`,
      static: true,
      returnType: this.type,
      docs: {
        summary: `Create ${this.resource.name}Events from a ${this.resource.name} reference`,
      },
    });
    factory.addParameter({
      name: refPropertyName,
      type: this.refInterface,
    });
    factory.addBody(stmt.ret(this.newInstance(expr.ident(refPropertyName))));
  }

  private getResolver(event: Event, typeDef: TypeDefinition, propName: string, prop: Property): Expression | undefined {
    const rscField = event.resourcesField.find(r => r.type.$ref === typeDef.$id);
    if (!rscField) {
      return undefined;
    }
    // Get the target property
    let targetProp;
    const sanitizePropName = (name: string) => name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    if (!rscField.fieldName) {
      const possibleNames = [propName, `${this.resource.name}${propName}`].map(n => sanitizePropName(n));
      targetProp = this.referenceProps.find(r => possibleNames.includes(r.declaration.name.toLowerCase()));
      if (!targetProp) {
        // Cannot throw because we don't know if the property we are looking at should be the one in the ref
        return undefined;
      }
    } else if (rscField.fieldName === propName) {
      targetProp = this.referenceProps.find(r => r.declaration.name.toLowerCase() === sanitizePropName(propName));
      if (!targetProp) {
        // We know that we should have found something
        throw new SkipEventError(`Could not find property ${event.name}.${propName} in the ref interface. Available properties: ${this.referenceProps.map(r => r.declaration.name).join(', ')}`);
      }
    } else {
      return undefined;
    }
    // Return accessor
    if (prop.type.type !== 'string') {
      throw Error(`${event.name} ${propName} is not a string, but ${prop.type.type}`);
    }
    return expr.list([expr.ident('iRef').prop(this.referenceName).prop(targetProp.declaration.name)]);
  }
}

import type { Resource, Service, SpecDatabase, Event, TypeDefinition, Property } from '@aws-cdk/service-spec-types';
import { naming } from '@aws-cdk/spec2cdk';
import { CDK_CORE } from '@aws-cdk/spec2cdk/lib/cdk/cdk';
import { TypeConverter } from '@aws-cdk/spec2cdk/lib/cdk/type-converter';
import type { Expression, Method } from '@cdklabs/typewriter';
import { ExternalModule, Module, ClassType, InterfaceType, StructType, Type, expr, stmt, MemberVisibility, FreeFunction } from '@cdklabs/typewriter';
import type { AddServiceProps, LibraryBuilderProps } from '@aws-cdk/spec2cdk/lib/cdk/library-builder';
import { LibraryBuilder } from '@aws-cdk/spec2cdk/lib/cdk/library-builder';
import type { LocatedModule, ServiceSubmoduleProps } from '@aws-cdk/spec2cdk/lib/cdk/service-submodule';
import { BaseServiceSubmodule } from '@aws-cdk/spec2cdk/lib/cdk/service-submodule';
import { eventNamespaceName } from '@aws-cdk/spec2cdk/lib/naming';
import { ResourceReference, type ReferenceProp } from '@aws-cdk/spec2cdk/lib/cdk/reference-props';

const EXCLUDED_SERVICE = new Set([
  'aws-macie', // Excluded because the Macie EventBridge schema includes property names
  // such as IP addresses and ISO timestamps (e.g. "2017-04-03T16:12:53+00:00"),
  // which do not represent meaningful or usable fields for EventBridge events.

]);
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

  public canBindToResource(event: Event, resource: Resource): boolean {
    const rootProperty = this.db.get('eventTypeDefinition', event.resourcesField[0].type);
    const referenceProps = new ResourceReference(resource).referenceProps;
    let nonUndefinedResolvers = 0;

    const sanitize = (name: string) => name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

    for (const [propName] of Object.entries(rootProperty.properties)) {
      const rscField = event.resourcesField.find(r => r.type.$ref === rootProperty.$id);
      if (!rscField) continue;

      let targetProp;
      if (!rscField.fieldName) {
        const possibleNames = [propName, `${resource.name}${propName}`].map(sanitize);
        targetProp = referenceProps.find(r => possibleNames.includes(r.declaration.name.toLowerCase()));
      } else if (rscField.fieldName === propName) {
        targetProp = referenceProps.find(r => r.declaration.name.toLowerCase() === sanitize(propName));
        // fieldName explicitly names this property but it's not in the ref
        if (!targetProp) return false;
      }

      if (targetProp) nonUndefinedResolvers++;
    }

    if (event.resourcesField.some(r => r.type.$ref === rootProperty.$id) && nonUndefinedResolvers !== 1) {
      return false;
    }

    return true;
  }

  protected createServiceSubmodule(service: Service, submoduleName: string): EventBridgeServiceModule {
    const hasEvents = this.db.follow('serviceHasEvent', service);
    const submodule = new EventBridgeServiceModule({
      submoduleName,
      service,
    });

    if (EXCLUDED_SERVICE.has(service.name)) {
      return submodule;
    }

    if (hasEvents.length != 0) {
      const allServiceEvents = hasEvents.map((e) => e.entity);

      const hasBindableEvents = allServiceEvents.some(event => {
        if (event.resourcesField.length === 0) return false;
        const resource = this.db.get('resource', event.resourcesField[0].resource.$ref);
        return this.canBindToResource(event, resource);
      });

      const eventsModule = this.createEventsModule(submodule, service, hasBindableEvents);
      this.rememberModule(eventsModule);

      this.generateStandaloneEvents(submodule, service);
    }

    return submodule;
  }

  protected addResourceToSubmodule(submodule: EventBridgeServiceModule, resource: Resource, _props?: AddServiceProps): void {
    const allEvents = this.db.follow('resourceHasEvent', resource).map((e) => e.entity);
    const bindableEvents = allEvents.filter(e => e.resourcesField.length === 0 || this.canBindToResource(e, resource));
    if (bindableEvents.length === 0) {
      return;
    }

    const service = this.db.incoming('hasResource', resource).only().entity;
    const eventsModule = this.obtainEventsModule(submodule, service);

    const eventsClass = new EventBridgeEventsClass(eventsModule.module, this.db, resource, bindableEvents, submodule.constructLibModule);
    eventsClass.build();

    if (eventsClass.resourceClass != undefined) {
      submodule.registerResource(resource.cloudFormationType, eventsClass.resourceClass);
    }
  }

  // Generate standalone events (events without matching resources) at service level
  private generateStandaloneEvents(submodule: EventBridgeServiceModule, service: Service): void {
    const allServiceEvents = this.db.follow('serviceHasEvent', service).map((e) => e.entity);

    const standaloneEvents = allServiceEvents.filter(event => {
      if (event.resourcesField.length === 0) return true;
      const resources = [this.db.get('resource', event.resourcesField[0].resource.$ref)];
      // If the event can bind to ANY of its linked resources, it's not standalone
      return !resources.some(r => this.canBindToResource(event, r));
    });

    if (allServiceEvents.length === 0) {
      return;
    }

    const eventsModule = this.obtainEventsModule(submodule, service);

    const eventsClass = new EventBridgeEventsClass(
      eventsModule.module,
      this.db,
      undefined,
      standaloneEvents,
      submodule.constructLibModule,
    );
    eventsClass.build();
  }

  private createEventsModule(submodule: EventBridgeServiceModule, service: Service, includeServiceImport: boolean): LocatedModule<Module> {
    const module = new Module(`@aws-cdk/mixins-preview/${submodule.submoduleName}/events`);
    const filePath = this.pathFor(this.filePattern, submodule.submoduleName, service);

    submodule.registerModule({ module, filePath });

    CDK_CORE.import(module, 'cdk');
    if (includeServiceImport) {
      submodule.constructLibModule.import(module, 'service');
    }

    const awsEvents = new ExternalModule('aws-cdk-lib/aws-events');
    awsEvents.import(module, 'events');

    return { module, filePath };
  }

  private obtainEventsModule(submodule: EventBridgeServiceModule, service: Service): LocatedModule<Module> {
    const filePath = this.pathFor(this.filePattern, submodule.submoduleName, service);

    if (!this.modules.has(filePath)) {
      throw new Error(`Events module for ${service.name} was not created in createServiceSubmodule`);
    }

    return {
      module: this.modules.get(filePath)!,
      filePath,
    };
  }
}

/**
 * Shared context for generating event-related code
 */
interface EventGenerationContext {
  db: SpecDatabase;
  resource?: Resource;
  refInterface?: Type;
  referenceName?: string;
  referenceProps?: ReferenceProp[];
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
  createTypeConverterForNamespace(namespaceScope: ClassType,
    event: Event, eventsName: string, hasResource: boolean, rootPropertyId?: string): TypeConverter {
    const createdTypes = new Map<string, StructType>();
    // TypeConverter is needed to convert spec Property types into typewriter Types (e.g., string -> Array<string>,
    // $ref -> StructType) and to resolve nested TypeDefinitions via the typeDefinitionConverter callback.
    // It requires a Resource, but standalone events have no associated resource.
    const dummyResource: Resource = {
      $id: 'bugbug/DummyResource',
      name: 'Service',
      cloudFormationType: 'AWS::Service::Dummy',
      documentation: '',
      attributes: {},
      properties: {},
    };

    return new TypeConverter({
      db: this.context.db,
      resource: this.context.resource ?? dummyResource,
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
          // Skip creating converter for root property as it's handled separately with "Detail" in the name
          if (rootPropertyId && typeDef.$id === rootPropertyId) {
            return;
          }

          if (Object.keys(typeDef.properties).length > 0) {
            this.addPropertiesAndCreateConverter({
              target: structType,
              properties: typeDef.properties,
              typeConverter: converter,
              converterNamePrefix: `convert${eventsName}${sanitizedName}ToEventPattern`,
              eventsName: eventsName,
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
   * This method processes a set of properties, adds them to the target type with proper naming
   * and documentation, and generates a converter function that maps TypeScript property names
   * back to their original EventBridge format.
   *
   * The converter function automatically handles nested struct properties by recursively calling
   * their respective converter functions.
   */
  addPropertiesAndCreateConverter({
    target,
    properties,
    typeConverter,
    converterNamePrefix,
    eventsName,
    event,
    typeDef,
    addMetadata,
    hasResource,
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
    eventsName: string;
    /** Event object for resource field identification */
    event: Event;
    /** Type definition for resource field identification */
    typeDef: TypeDefinition;
    addMetadata: boolean;
    hasResource: boolean;
  }): FreeFunction {
    const propertyMappings = new Map<string, { original: string; type: Type; resolver?: Expression }>();
    let nonUndefinedResolvers = 0;

    for (const [propName, propSpec] of Object.entries(properties)) {
      const resolver = hasResource ? this.getResolver(event, typeDef, propName, propSpec) : undefined;
      if (resolver) nonUndefinedResolvers++;

      // Replace colons with dashes before camelCasing (aws:s3:arn -> aws-s3-arn -> awsS3Arn)
      const camelCaseName = naming.santitizeFieldName(naming.propertyNameFromCloudFormation(propName.replace(/:/g, '-')));
      let propType = typeConverter.typeFromProperty(propSpec);
      propertyMappings.set(camelCaseName, { original: propName, type: propType, resolver });

      if (propType.primitive) {
        propType = Type.arrayOf(Type.STRING);
      }
      const defaultDoc = resolver ?
        `Filter with the ${this.context.resource?.name ?? 'resource'} reference` :
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

    if (hasResource && this.context.refInterface) {
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
          const propConverterName = `convert${eventsName}${propStructName}ToEventPattern`;
          if (hasResource && this.context.refInterface) {
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

    if (!this.context.resource || !this.context.referenceProps || !this.context.referenceName) {
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
        throw new Error(`Could not find property ${event.name}.${propName} in the ref interface. Available properties: ${this.context.referenceProps.map(r => r.declaration.name).join(', ')}`);
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
 * Adds the EventBridge event pattern return body to a method.
 * Shared between standalone static methods and resource-bound instance methods.
 */
function addEventPatternBody({ method, event, detailExpr }: { method: Method; event: Event; detailExpr: Expression }): void {
  method.addBody(
    stmt.ret(
      expr.object({
        source: expr.list([expr.lit(event.source)]),
        detailType: expr.list([expr.lit(event.detailType)]),
        detail: detailExpr,
        version: expr.directCode('options?.eventMetadata?.version'),
        resources: expr.directCode('options?.eventMetadata?.resources'),
        region: expr.directCode('options?.eventMetadata?.region'),
      }),
    ),
  );
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
    // When generating standalone (resource is undefined), treat as no-resource even if resourcesField exists
    const hasResource = event.resourcesField.length > 0 && this.context.resource !== undefined;

    const eventNamespace = new ClassType(this.scope, {
      name: namespaceName,
      export: true,
      docs: {
        summary: `EventBridge event pattern for ${event.name}`,
      },
    });

    const typeConverter = this.converterGenerator.createTypeConverterForNamespace(eventNamespace, event,
      namespaceName, hasResource, rootProperty.$id);

    const detailInterface = new InterfaceType(eventNamespace, {
      name: `${namespaceName}Props`,
      export: true,
      docs: {
        summary: `Props type for ${event.name} event`,
      },
    });

    const converterFunction = this.converterGenerator.addPropertiesAndCreateConverter({
      target: detailInterface,
      properties: rootProperty.properties,
      typeConverter,
      converterNamePrefix: `convert${namespaceName}DetailToEventPattern`,
      eventsName: namespaceName,
      event,
      typeDef: rootProperty,
      addMetadata: true,
      hasResource,
    });

    const methodName = naming.eventPatternMethodName(namespaceName);
    const eventPatternMethod = eventNamespace.addMethod({
      name: methodName,
      static: true,
      returnType: eventsEventPattern,
      docs: {
        summary: `EventBridge event pattern for ${event.detailType}`,
      },
    });

    eventPatternMethod.addParameter({
      name: 'options',
      type: detailInterface.type,
      optional: true,
    });

    addEventPatternBody({
      method: eventPatternMethod,
      event,
      detailExpr: expr.ident(converterFunction.name).call(expr.ident('options')),
    });

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
    if (!this.context.resource || !this.context.referenceName) {
      throw new Error('Resource is required for resource-bound events');
    }

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

    addEventPatternBody({
      method: eventPatternMethod,
      event,
      detailExpr: expr.ident(converterFunction.name).call(expr.ident('options'), expr.this_().prop(this.context.referenceName)),
    });
  }
}

/**
 * Main class that orchestrates event generation for a resource
 */
class EventBridgeEventsClass {
  private readonly context: EventGenerationContext;
  private successfulEventCount = 0;
  public resourceClass?: ClassType;

  constructor(
    private readonly scope: Module,
    db: SpecDatabase,
    resource: Resource | undefined,
    private readonly events: Event[],
    constructLibModule: ExternalModule,
  ) {
    this.context = {
      db,
      resource,
      refInterface: resource ? Type.fromName(constructLibModule, naming.referenceInterfaceName(resource.name)) : undefined,
      referenceName: resource ? naming.referenceInterfaceAttributeName(resource.name) : undefined,
      referenceProps: resource ? new ResourceReference(resource).referenceProps : undefined,
    };
  }

  public build() {
    this.generateEvents();

    if (this.resourceClass) {
      this.addReferenceProperty();
      this.addConstructor();
      this.addFactoryMethod();
    }
  }

  public hasSuccessfulEvents(): boolean {
    return this.successfulEventCount > 0;
  }

  private generateEvents() {
    const converterGenerator = new SharedConverterGenerator(this.scope, this.context);
    const standaloneGenerator = new StandaloneEventGenerator(this.scope, this.context, converterGenerator);

    for (const event of this.events) {
      const hasResource = event.resourcesField.length > 0;

      const { detailInterface, converterFunction } = standaloneGenerator.generateEventClass(event);

      if (hasResource && this.context.resource) {
        if (!this.resourceClass) {
          this.resourceClass = new ClassType(this.scope, {
            name: `${this.context.resource.name}Events`,
            export: true,
            docs: {
              summary: `EventBridge event patterns for ${this.context.resource.name}`,
            },
          });
        }
        const resourceBoundGenerator = new ResourceBoundEventsGenerator(this.resourceClass, this.context);
        resourceBoundGenerator.addEventMethod(event, detailInterface, converterFunction);
      }

      this.successfulEventCount++;
    }
  }

  private addReferenceProperty() {
    if (!this.resourceClass || !this.context.resource || !this.context.refInterface || !this.context.referenceName) return;

    this.resourceClass.addProperty({
      name: this.context.referenceName,
      type: this.context.refInterface,
      immutable: true,
      visibility: MemberVisibility.Private,
      docs: {
        summary: `Reference to the ${this.context.resource.name} construct`,
      },
    });
  }

  private addConstructor() {
    if (!this.resourceClass || !this.context.resource || !this.context.refInterface || !this.context.referenceName) return;

    const ctor = this.resourceClass.addInitializer({ visibility: MemberVisibility.Private });
    ctor.addParameter({
      name: this.context.referenceName,
      type: this.context.refInterface,
    });
    ctor.addBody(stmt.assign(expr.this_().prop(this.context.referenceName), expr.ident(this.context.referenceName)));
  }

  private addFactoryMethod() {
    if (!this.resourceClass || !this.context.resource || !this.context.refInterface || !this.context.referenceName) return;

    const factory = this.resourceClass.addMethod({
      name: `from${this.context.resource.name}`,
      static: true,
      returnType: this.resourceClass.type,
      docs: {
        summary: `Create ${this.context.resource.name}Events from a ${this.context.resource.name} reference`,
      },
    });
    factory.addParameter({
      name: this.context.referenceName,
      type: this.context.refInterface,
    });
    factory.addBody(stmt.ret(this.resourceClass.newInstance(expr.ident(this.context.referenceName))));
  }
}

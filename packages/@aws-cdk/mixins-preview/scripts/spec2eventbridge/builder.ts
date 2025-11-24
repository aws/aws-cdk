/* eslint-disable no-console */
import type { Resource, Service, SpecDatabase, Event } from '@aws-cdk/service-spec-types';
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
    this.filePattern = props.filePattern ?? '%moduleName%/%serviceShortName%.events.generated.ts';
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
    const eventsModule = this.obtainEventsModule(submodule, service);

    const eventsClass = new EventBridgeEventsClass(eventsModule.module, this.db, resource, events, submodule.constructLibModule);
    submodule.registerResource(resource.cloudFormationType, eventsClass);

    eventsClass.build();
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
  }

  public build() {
    this.addReferenceProperty();
    this.addConstructor();
    this.addFactoryMethod();
    this.generateEvents();
  }

  /**
   * Creates a TypeConverter with deduplication for nested type definitions
   */
  private createTypeConverterForNamespace(namespaceScope: ClassType, event: Event, eventNsName: string): TypeConverter {
    const createdTypes = new Map<string, StructType>();
    const module = Module.of(this);

    return new TypeConverter({
      db: this.db,
      resource: this.resource,
      resourceClass: namespaceScope,
      isEventBridgeType: true,
      typeDefinitionConverter: (typeDef, converter) => {
        const sanitizedName = naming.sanitizeTypeName(typeDef.name);

        // Check if we already created this type
        if (createdTypes.has(sanitizedName)) {
          return { structType: createdTypes.get(sanitizedName)!, build: () => {} };
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
          const propertyMappings = new Map<string, { original: string; type: Type }>();

          for (const [propName, propSpec] of Object.entries(typeDef.properties)) {
            if (event.resourcesField.some(r => r.type.$ref === typeDef.$id && r.fieldName === propName)) {
              console.log('Found you');
            }
            // Replace colons with dashes before camelCasing (aws:s3:arn -> aws-s3-arn -> awsS3Arn)
            const camelCaseName = naming.propertyNameFromCloudFormation(propName.replace(/:/g, '-'));
            const propType = converter.typeFromProperty(propSpec);
            propertyMappings.set(camelCaseName, { original: propName, type: propType });

            structType.addProperty({
              name: camelCaseName,
              type: propType,
              optional: !propSpec.required,
              docs: {
                summary: propSpec.documentation || `${propName} property`,
              },
            });
          }

          // Generate converter function for this nested type
          if (propertyMappings.size > 0) {
            const converterFunctionName = `convert${eventNsName}${sanitizedName}ToEventPattern`;
            const converterFunction = new FreeFunction(module, {
              name: converterFunctionName,
              returnType: Type.ANY,
            });

            converterFunction.addParameter({
              name: 'obj',
              type: structType.type,
            });

            // Build object mapping - recursively call converters for complex types
            const mappings = Array.from(propertyMappings.entries()).map(([camelCase, { original, type }]) => {
              const propAccess = expr.ident('obj').prop(camelCase);
              let valueExpr: Expression = propAccess;

              // If property is a struct, call its converter (with undefined check for optional props)
              if (type.symbol) {
                const propStruct = type.symbol.findDeclaration();
                if (propStruct && propStruct.kind === 'struct') {
                  const propStructName = naming.sanitizeTypeName(propStruct.name);
                  const propConverterName = `convert${eventNsName}${propStructName}ToEventPattern`;
                  // Use conditional: obj.prop ? converter(obj.prop) : undefined
                  valueExpr = expr.cond(propAccess).then(
                    expr.ident(propConverterName).call(propAccess),
                  ).else(expr.UNDEFINED);
                }
              }

              return [original, valueExpr] as const;
            });

            converterFunction.addBody(
              stmt.ret(expr.object(mappings)),
            );
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
      // eslint-disable-next-line no-console
      console.log('Generating event for', this.resource.cloudFormationType, event.name);
      const namespaceName = eventNamespaceName(event.name);

      // Create namespace class to hold event types
      const eventNamespace = new ClassType(this, {
        name: namespaceName,
        export: true,
        docs: {
          summary: `${event.name} event types for ${this.resource.name}`,
        },
      });

      const typeConverter = this.createTypeConverterForNamespace(eventNamespace, event, namespaceName);
      const rootProperty = this.db.get('eventTypeDefinition', event.rootProperty);

      // Create detail interface with event properties
      const detailInterface = new InterfaceType(eventNamespace, {
        name: `${namespaceName}Detail`,
        export: true,
        docs: {
          summary: `Detail type for ${this.resource.name} ${event.name} event`,
        },
      });

      // Track property mappings for converter function
      const propertyMappings = new Map<string, string>();

      for (const [propName, propDef] of Object.entries(rootProperty.properties)) {
        // Replace colons with dashes before camelCasing (aws:s3:arn -> aws-s3-arn -> awsS3Arn)
        const camelCaseName = naming.propertyNameFromCloudFormation(propName.replace(/:/g, '-'));
        propertyMappings.set(camelCaseName, propName);

        detailInterface.addProperty({
          name: camelCaseName,
          type: typeConverter.typeFromSpecType(propDef.type),
          optional: !propDef.required,
          immutable: true,
          docs: {
            summary: `${propName} property`,
            default: propDef.required ? undefined : '-',
          },
        });
      }

      // Generate converter function to map camelCase back to original names
      const converterFunctionName = `convert${namespaceName}DetailToEventPattern`;
      const module = Module.of(this);

      const converterFunction = new FreeFunction(module, {
        name: converterFunctionName,
        returnType: Type.ANY,
      });

      converterFunction.addParameter({
        name: 'detail',
        type: detailInterface.type,
      });

      // Build object mapping
      const mappings = Array.from(propertyMappings.entries()).map(([camelCase, original]) =>
        [original, expr.ident('detail').prop(camelCase)] as const,
      );

      converterFunction.addBody(
        stmt.ret(expr.object(mappings)),
      );

      // Create pattern props interface extending detail with metadata
      const propInterface = new InterfaceType(eventNamespace, {
        name: 'PatternProps',
        export: true,
        extends: [detailInterface.type],
        docs: {
          summary: `Properties for ${this.resource.name} ${event.name} event pattern`,
        },
      });
      propInterface.addProperty({
        name: 'eventMetadata',
        type: CDK_CORE.AWSEventMetadataProp,
        optional: true,
        immutable: true,
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
      const eventPatternMethodParam = eventPatternMethod.addParameter({
        name: 'options',
        type: propInterface.type,
        optional: true,
      });

      const eventMetadata = expr.ident('eventMetadata');

      eventPatternMethod.addBody(
        stmt.if_(expr.not(expr.ident(eventPatternMethodParam.spec.name)))
          .then(
            stmt.ret(
              expr.object({
                source: expr.list([expr.lit(event.source)]),
                detailType: expr.list([expr.lit(event.detailType)]),
              }),
            ),
          ),
        stmt.constVar(
          expr.destructuringObject(eventMetadata, expr.directCode('...detail')),
          expr.ident(eventPatternMethodParam.spec.name),
        ),
        stmt.ret(
          expr.object({
            source: expr.list([expr.lit(event.source)]),
            detailType: expr.list([expr.lit(event.detailType)]),
            detail: expr.cond(expr.ident('detail')).then(expr.ident(converterFunction.name).call(expr.ident('detail'))).else(expr.UNDEFINED),
            version: expr.directCode('eventMetadata?.version'),
            resources: expr.directCode('eventMetadata?.resources'),
            region: expr.directCode('eventMetadata?.region'),
          }),
        ),
      );
    }
  }

  private addReferenceProperty() {
    const refPropertyName = naming.referenceInterfaceAttributeName(this.resource.name);
    this.addProperty({
      name: refPropertyName,
      type: this.refInterface,
      immutable: true,
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
}

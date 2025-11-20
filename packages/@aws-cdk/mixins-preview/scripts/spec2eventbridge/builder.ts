import type { Resource, Service, SpecDatabase, Event } from '@aws-cdk/service-spec-types';
import { naming } from '@aws-cdk/spec2cdk';
import { CDK_CORE } from '@aws-cdk/spec2cdk/lib/cdk/cdk';
import { TypeConverter } from '@aws-cdk/spec2cdk/lib/cdk/type-converter';
import { ExternalModule, Module, ClassType, InterfaceType, StructType, Type, expr, stmt, MemberVisibility, Splat } from '@cdklabs/typewriter';
import type { AddServiceProps, LibraryBuilderProps } from '@aws-cdk/spec2cdk/lib/cdk/library-builder';
import { LibraryBuilder } from '@aws-cdk/spec2cdk/lib/cdk/library-builder';
import type { LocatedModule, ServiceSubmoduleProps } from '@aws-cdk/spec2cdk/lib/cdk/service-submodule';
import { BaseServiceSubmodule } from '@aws-cdk/spec2cdk/lib/cdk/service-submodule';

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
    const events = this.db.follow('hasEvent', resource).map((e) => e.entity);
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
    this.generateEventInterfaces();
    this.addReferenceProperty();
    this.addConstructor();
    this.addFactoryMethod();
    this.addEventPatternMethods();
  }

  private createTypeConverterForNamespace(namespaceScope: ClassType): TypeConverter {
    return new TypeConverter({
      db: this.db,
      resource: this.resource,
      resourceClass: namespaceScope,
      typeDefinitionConverter: (typeDef, converter) => {
        const structType = new StructType(namespaceScope, {
          export: true,
          name: typeDef.name,
          docs: {
            summary: typeDef.documentation || `Type definition for ${typeDef.name}`,
          },
        });

        const build = () => {
          for (const [propName, propSpec] of Object.entries(typeDef.properties)) {
            structType.addProperty({
              name: propName,
              type: converter.typeFromProperty(propSpec),
              optional: !propSpec.required,
              docs: {
                summary: propSpec.documentation || `${propName} property`,
              },
            });
          }
        };

        return { structType, build };
      },
    });
  }

  private generateEventInterfaces() {
    for (const event of this.events) {
      const eventNamespace = new ClassType(this, {
        name: event.name,
        export: true,
        docs: {
          summary: `${event.name} event types for ${this.resource.name}`,
        },
      });

      const typeConverter = this.createTypeConverterForNamespace(eventNamespace);

      const detailInterface = new InterfaceType(eventNamespace, {
        name: 'Detail',
        export: true,
        docs: {
          summary: `Detail type for ${this.resource.name} ${event.name} event`,
        },
      });

      for (const [propName, propDef] of Object.entries(event.properties)) {
        detailInterface.addProperty({
          name: propName,
          type: typeConverter.typeFromSpecType((propDef as any).type),
          optional: true,
          docs: {
            summary: `${propName} property`,
          },
        });
      }

      const eventPatternInterface = new InterfaceType(eventNamespace, {
        name: 'EventPattern',
        export: true,
        extends: [CDK_CORE.AWSEventMetadata],
        docs: {
          summary: `EventBridge event pattern for ${this.resource.name} ${event.name}`,
        },
      });

      eventPatternInterface.addProperty({
        name: 'detail',
        type: detailInterface.type,
        optional: true,
      });

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
      });
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

  private addEventPatternMethods() {
    const module = Module.of(this);
    for (const event of this.events) {
      const methodName = naming.eventPatternMethodName(event.name);
      const returnType = Type.fromName(module, naming.eventPatternTypeName(this.name, event.name));
      const propType = Type.fromName(module, naming.eventPatternPropsTypeName(this.name, event.name));

      const method = this.addMethod({
        name: methodName,
        returnType,
        docs: {
          summary: `EventBridge event pattern for ${this.resource.name} ${event.name}`,
        },
      });

      method.addParameter({
        name: 'options',
        type: propType,
        optional: true,
      });

      const eventMetadata = expr.ident('eventMetadata');
      const detail = expr.ident('detail');

      method.addBody(
        stmt.constVar(
          expr.destructuringObject(eventMetadata, expr.directCode('...detail')),
          expr.binOp(expr.ident('options'), '??', expr.lit({})),
        ),
        stmt.ret(
          expr.object({
            detail: expr.object({
              'source': expr.lit(event.source),
              'detail-type': expr.lit(event.detailType),
            }, new Splat(detail)),
            version: expr.directCode('eventMetadata?.version'),
            resources: expr.directCode('eventMetadata?.resources'),
            region: expr.directCode('eventMetadata?.region'),
          }),
        ),
      );
    }
  }
}

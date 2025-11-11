import { Event, Resource, SpecDatabase } from '@aws-cdk/service-spec-types';
import { ClassType, IScope, InterfaceType, MemberVisibility, Module, SelectiveModuleImport, Splat, StructType, Type, expr, stmt } from '@cdklabs/typewriter';
import { CDK_CORE } from './cdk';
import { TypeConverter } from './type-converter';
import { eventPatternMethodName, eventPatternPropsTypeName, eventPatternTypeName, referenceInterfaceName, referenceInterfaceAttributeName } from '../naming/conventions';

export class EventBridgeEventsClass extends ClassType {
  /**
   * Create EventBridgeEventsClass if the resource has events
   * Returns undefined if no events exist
   */
  public static create(
    scope: IScope,
    db: SpecDatabase,
    resource: Resource,
    refInterfaceType: Type,
    interfacesModule: Module,
    importPath: string,
  ): EventBridgeEventsClass | undefined {
    const events = db.follow('hasEvent', resource).map((e) => e.entity);
    if (events.length === 0) {
      return undefined;
    }

    // Check if this class already exists in the scope, this happens for AWS::CloudFormation
    // as it is both created as a module and in core
    const className = `${resource.name}Events`;
    const existingType = scope.tryFindType(scope.qualifyName(className));
    if (existingType) {
      return undefined;
    }

    const eventsClass = new EventBridgeEventsClass(scope, db, resource, events, refInterfaceType);

    // Add import for the reference interface
    const refInterfaceName = referenceInterfaceName(resource.name);
    Module.of(eventsClass).addImport(
      new SelectiveModuleImport(
        interfacesModule,
        importPath,
        [refInterfaceName],
      ),
    );

    return eventsClass;
  }

  private readonly module: Module;

  constructor(
    scope: IScope,
    private readonly db: SpecDatabase,
    private readonly resource: Resource,
    private readonly events: Event[],
    private readonly refInterface: Type,
  ) {
    super(scope, {
      name: `${resource.name}Events`,
      export: true,
      docs: {
        summary: `EventBridge event patterns for ${resource.name}`,
      },
    });

    this.module = Module.of(this);
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
      const eventName = event.name;

      // Create a ClassType to act as a namespace container for this event
      const eventNamespace = new ClassType(this, {
        name: eventName,
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
    const refPropertyName = referenceInterfaceAttributeName(this.resource.name);
    this.addProperty({
      name: refPropertyName,
      type: this.refInterface,
      immutable: true,
    });
  }

  private addConstructor() {
    const refPropertyName = referenceInterfaceAttributeName(this.resource.name);
    const ctor = this.addInitializer({ visibility: MemberVisibility.Private });
    ctor.addParameter({
      name: refPropertyName,
      type: this.refInterface,
    });
    ctor.addBody(stmt.assign(expr.this_().prop(refPropertyName), expr.ident(refPropertyName)));
  }

  private addFactoryMethod() {
    const refPropertyName = referenceInterfaceAttributeName(this.resource.name);
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
    for (const event of this.events) {
      const eventName = event.name;
      const methodName = eventPatternMethodName(eventName);
      const returnType = Type.fromName(this.module, eventPatternTypeName(this.name, eventName));
      const propType = Type.fromName(this.module, eventPatternPropsTypeName(this.name, eventName));

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

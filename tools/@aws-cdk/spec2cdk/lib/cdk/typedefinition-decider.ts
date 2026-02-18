import type { Property, Resource, TypeDefinition } from '@aws-cdk/service-spec-types';
import type { Expression, PropertySpec, Type } from '@cdklabs/typewriter';
import type { PropertyMapping } from './cloudformation-mapping';
import type { RelationshipDecider } from './relationship-decider';
import { ResolverBuilder } from './resolver-builder';
import { deprecationMessage } from './resource-decider';
import type { TypeConverter } from './type-converter';
import { cloudFormationDocLink } from '../naming';
import { splitDocumentation } from '../util';

/**
 * Decide how properties get mapped between model types, Typescript types, and CloudFormation
 */
export class TypeDefinitionDecider {
  public readonly properties = new Array<TypeDefProperty>();
  private readonly resolverBuilder: ResolverBuilder;

  constructor(
    private readonly resource: Resource,
    private readonly typeDefinition: TypeDefinition,
    private readonly converter: TypeConverter,
    private readonly relationshipDecider: RelationshipDecider,
  ) {
    this.resolverBuilder = new ResolverBuilder(this.converter, this.relationshipDecider, this.converter.module);
    this.convertProperties();
    this.properties.sort((p1, p2) => p1.propertySpec.name.localeCompare(p2.propertySpec.name));
  }

  private convertProperties() {
    for (const [name, prop] of Object.entries(this.typeDefinition.properties)) {
      this.handlePropertyDefault(name, prop);
    }
  }

  /**
   * Default mapping for a property
   */
  private handlePropertyDefault(cfnName: string, prop: Property) {
    const optional = !prop.required;

    const resolverResult = this.resolverBuilder.buildResolver(prop, cfnName, true);

    this.properties.push({
      propertySpec: {
        name: resolverResult.name,
        type: resolverResult.propType,
        optional,
        docs: {
          ...splitDocumentation(prop.documentation),
          default: prop.defaultValue ?? undefined,
          see: cloudFormationDocLink({
            resourceType: this.resource.cloudFormationType,
            propTypeName: this.typeDefinition.name,
            propName: cfnName,
          }),
          deprecated: deprecationMessage(prop),
        },
      },
      baseType: resolverResult.baseType,
      cfnMapping: {
        cfnName,
        propName: resolverResult.name,
        baseType: resolverResult.baseType,
        optional,
      },
      resolver: resolverResult.resolver,
    });
  }
}

export interface TypeDefProperty {
  readonly propertySpec: PropertySpec;
  /** The type that was converted (does not have the IResolvable union) */
  readonly baseType: Type;
  readonly cfnMapping: PropertyMapping;
  readonly resolver: (_: Expression) => Expression;
}

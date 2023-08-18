import { Property, Resource, TypeDefinition } from '@aws-cdk/service-spec-types';
import { PropertySpec, Type } from '@cdklabs/typewriter';
import { PropertyMapping } from './cloudformation-mapping';
import { deprecationMessage } from './resource-decider';
import { NON_RESOLVABLE_PROPERTY_NAMES } from './tagging';
import { TypeConverter } from './type-converter';
import { cloudFormationDocLink, propertyNameFromCloudFormation } from '../naming';
import { splitDocumentation } from '../util';

/**
 * Decide how properties get mapped between model types, Typescript types, and CloudFormation
 */
export class TypeDefinitionDecider {
  public readonly properties = new Array<TypeDefProperty>();

  constructor(
    private readonly resource: Resource,
    private readonly typeDefinition: TypeDefinition,
    private readonly converter: TypeConverter,
  ) {
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
    const name = propertyNameFromCloudFormation(cfnName);
    const baseType = this.converter.typeFromProperty(prop);

    // Whether or not a property is made `IResolvable` originally depended on
    // the name of the property. These conditions were probably expected to coincide,
    // but didn't.
    const type = cfnName in NON_RESOLVABLE_PROPERTY_NAMES ? baseType : this.converter.makeTypeResolvable(baseType);
    const optional = !prop.required;

    this.properties.push({
      propertySpec: {
        name,
        type,
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
      baseType,
      cfnMapping: {
        cfnName,
        propName: name,
        baseType,
        optional,
      },
    });
  }
}

export interface TypeDefProperty {
  readonly propertySpec: PropertySpec;
  /** The type that was converted (does not have the IResolvable union) */
  readonly baseType: Type;
  readonly cfnMapping: PropertyMapping;
}

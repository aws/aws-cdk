import { Resource, TypeDefinition } from '@aws-cdk/service-spec-types';
import { ClassType, Module, Stability, StructType } from '@cdklabs/typewriter';
import { CloudFormationMapping } from './cloudformation-mapping';
import { TypeConverter } from './type-converter';
import { TypeDefinitionDecider } from './typedefinition-decider';
import { cloudFormationDocLink, structNameFromTypeDefinition } from '../naming';
import { splitDocumentation } from '../util';

export interface TypeDefinitionStructOptions {
  readonly typeDefinition: TypeDefinition;
  readonly converter: TypeConverter;
  readonly resource: Resource;
  readonly resourceClass: ClassType;
}

/**
 * Builds a struct type for a TypeDefinition in the database model
 *
 * Uses the TypeDefinitionDecider for the actual decisions, and carries those out.
 */
export class TypeDefinitionStruct extends StructType {
  private readonly typeDefinition: TypeDefinition;
  private readonly converter: TypeConverter;
  private readonly resource: Resource;
  private readonly module: Module;

  constructor(options: TypeDefinitionStructOptions) {
    super(options.resourceClass, {
      export: true,
      name: structNameFromTypeDefinition(options.typeDefinition),
      docs: {
        ...splitDocumentation(options.typeDefinition.documentation),
        stability: Stability.External,
        see: cloudFormationDocLink({
          resourceType: options.resource.cloudFormationType,
          propTypeName: options.typeDefinition.name,
        }),
      },
    });

    this.typeDefinition = options.typeDefinition;
    this.converter = options.converter;
    this.resource = options.resource;

    this.module = Module.of(this);
  }

  public build() {
    const cfnMapping = new CloudFormationMapping(this.module, this.converter);

    const decider = new TypeDefinitionDecider(this.resource, this.typeDefinition, this.converter);

    for (const prop of decider.properties) {
      this.addProperty(prop.propertySpec);
      cfnMapping.add(prop.cfnMapping);
    }

    cfnMapping.makeCfnProducer(this.module, this);
    cfnMapping.makeCfnParser(this.module, this);
  }
}

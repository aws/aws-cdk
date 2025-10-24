import type { Resource, SpecDatabase } from '@aws-cdk/service-spec-types';
import { naming, util } from '@aws-cdk/spec2cdk';
import { AstBuilder } from '@aws-cdk/spec2cdk/lib/cdk/ast';
import { CDK_CORE } from '@aws-cdk/spec2cdk/lib/cdk/cdk';
import type { IScope } from '@cdklabs/typewriter';
import { Module, ClassType, Stability, StructType } from '@cdklabs/typewriter';

export class MixinAstBuilder<T extends Module> extends AstBuilder<T> {
  public addResource(resource: Resource) {
    const resourceClass = new L1PropsMixin(this.module, this.db, resource, {
      deprecated: this.deprecated,
    });
    this.resources[resource.cloudFormationType] = resourceClass.spec.name;

    resourceClass.build();
  }
}

interface L1PropsMixinProps {
  readonly deprecated?: string;
}

class L1PropsMixin extends ClassType {
  public readonly module: Module;
  public readonly propsType: StructType;
  // public readonly decider: ResourceDecider;
  // private readonly converter: TypeConverter;

  constructor(
    scope: IScope,
    public readonly db: SpecDatabase,
    private readonly resource: Resource,
    public readonly props: L1PropsMixinProps = {},
  ) {
    super(scope, {
      export: true,
      name: `Cfn${resource.name}PropsMixin`,
      docs: {
        ...util.splitDocumentation(resource.documentation),
        stability: Stability.External,
        docTags: { cloudformationResource: resource.cloudFormationType },
        see: naming.cloudFormationDocLink({
          resourceType: resource.cloudFormationType,
        }),
        ...util.maybeDeprecated(props.deprecated),
      },
      extends: CDK_CORE.CfnResource,
      implements: [],
    });

    this.module = Module.of(this);

    this.propsType = new StructType(this.scope, {
      export: true,
      name: naming.propStructNameFromResource(this.resource),
      docs: {
        summary: `Properties for defining a \`${this.name}\``,
        stability: Stability.External,
        see: naming.cloudFormationDocLink({
          resourceType: this.resource.cloudFormationType,
        }),
        ...util.maybeDeprecated(props.deprecated),
      },
    });

    // this.converter = TypeConverter.forResource({
    //   db: db,
    //   resource: this.resource,
    //   resourceClass: this,
    // });

    // this.decider = new ResourceDecider(this.resource, this.converter);
  }

  /**
   * Build the elements of the L1PropsMixin Class and types
   */
  public build() {
  }
}

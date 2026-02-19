import type { Resource, SpecDatabase, TypeDefinition } from '@aws-cdk/service-spec-types';
import { ExternalModule, Stability, Type, expr, stmt, $this, $T, ThingSymbol, type Module } from '@cdklabs/typewriter';
import { CDK_CORE, CONSTRUCTS } from '../cdk/cdk';
import { naming } from '../index';
import { TypeMixin } from './generate';

/**
 * Generated mixin for configuring server-side encryption on S3 buckets.
 *
 * Extends ClassType following the same pattern as L1PropsMixin.
 */
export class BucketEncryptionMixin extends TypeMixin {
  constructor(scope: Module, resource: Resource, db: SpecDatabase, rootType: TypeDefinition) {
    super(scope, resource, db, rootType, {
      export: true,
      name: 'BucketEncryption',
      extends: CDK_CORE.Mixin,
      docs: {
        summary: 'Mixin for configuring server-side encryption on S3 buckets.',
        stability: Stability.External,
      },
    });
  }

  public build() {
    this.convertTypes();

    const rootStruct = this.findRootStruct();
    if (!rootStruct) return;

    const module = this.scope as Module;
    const service = this.db.incoming('hasResource', this.resource).only().entity;
    const constructLibModule = new ExternalModule(`aws-cdk-lib/${service.name}`);
    constructLibModule.import(module, 'service');
    CONSTRUCTS.import(module, 'constructs');
    CDK_CORE.helpers.import(module, 'internal', { fromLocation: '../../../core/lib/helpers-internal' });

    const cfnClassName = naming.classNameFromResource(this.resource);
    const cfnType = Type.fromName(constructLibModule, cfnClassName);
    const flattenFunctionName = `flatten${this.name}${this.rootType.name}`;

    this.makeConstructor(rootStruct);
    this.makeSupportsMethod(cfnType, cfnClassName);
    this.makeApplyToMethod(cfnClassName, flattenFunctionName);
  }

  private makeConstructor(rootStruct: Type) {
    this.addProperty({ name: 'rule', type: rootStruct, immutable: true, protected: true });
    const init = this.addInitializer({});
    const ruleParam = init.addParameter({ name: 'rule', type: rootStruct });
    init.addBody(
      expr.sym(new ThingSymbol('super', this.scope)).call(),
      stmt.assign($this.rule, ruleParam),
    );
  }

  private makeSupportsMethod(cfnType: Type, cfnClassName: string) {
    const supports = this.addMethod({
      name: 'supports',
      returnType: Type.ambient(`construct is service.${cfnType.symbol}`),
    });
    const construct = supports.addParameter({ name: 'construct', type: CONSTRUCTS.IConstruct });
    supports.addBody(
      stmt.ret($T(cfnType)[`is${cfnClassName}`](construct)),
    );
  }

  private makeApplyToMethod(cfnClassName: string, flattenFunctionName: string) {
    const applyTo = this.addMethod({ name: 'applyTo', returnType: Type.VOID });
    applyTo.addParameter({ name: 'construct', type: CONSTRUCTS.IConstruct });
    applyTo.addBody(
      expr.directCode(`new internal.CfnPropsMixin(service.${cfnClassName}, { bucketEncryption: { serverSideEncryptionConfiguration: [${flattenFunctionName}(this.rule)] } }, { strategy: cdk.PropertyMergeStrategy.override() }).applyTo(construct)`),
    );
  }
}

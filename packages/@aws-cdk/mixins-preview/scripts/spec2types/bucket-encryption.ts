import { naming } from '@aws-cdk/spec2cdk';
import { CDK_CORE, CONSTRUCTS } from '@aws-cdk/spec2cdk/lib/cdk/cdk';
import { ExternalModule, Stability, Type, expr, stmt, $this, $T, ThingSymbol, CallableProxy } from '@cdklabs/typewriter';
import { MIXINS_CORE } from '../spec2mixins/helpers';
import type { MixinBuilderContext } from './generate';

export const bucketEncryptionClassSpec = {
  implements: [MIXINS_CORE.IMixin],
  extends: MIXINS_CORE.Mixin,
  docs: {
    summary: 'Mixin for configuring server-side encryption on S3 buckets.',
    stability: Stability.External,
    docTags: { mixin: 'true' },
  },
};

export function buildBucketEncryptionMixin(ctx: MixinBuilderContext) {
  const { module, mixinClass, rootStruct, flattenFunctionName, resource, db } = ctx;

  const service = db.incoming('hasResource', resource).only().entity;
  const constructLibModule = new ExternalModule(`aws-cdk-lib/${service.name}`);
  constructLibModule.import(module, 'service');
  CONSTRUCTS.import(module, 'constructs');
  MIXINS_CORE.import(module, 'core', { fromLocation: '../../core' });

  const cfnClassName = naming.classNameFromResource(resource);
  const cfnType = Type.fromName(constructLibModule, cfnClassName);

  // Property + constructor
  mixinClass.addProperty({ name: 'rule', type: rootStruct, immutable: true, protected: true });
  const init = mixinClass.addInitializer({});
  const ruleParam = init.addParameter({ name: 'rule', type: rootStruct });
  init.addBody(
    expr.sym(new ThingSymbol('super', module)).call(),
    stmt.assign($this.rule, ruleParam),
  );

  // supports
  const supports = mixinClass.addMethod({
    name: 'supports',
    returnType: Type.ambient(`construct is service.${cfnType.symbol}`),
  });
  const construct = supports.addParameter({ name: 'construct', type: CONSTRUCTS.IConstruct });
  supports.addBody(
    stmt.ret(
      expr.binOp(
        CallableProxy.fromName('CfnResource.isCfnResource', CDK_CORE).invoke(construct),
        '&&',
        $T(cfnType)[`is${cfnClassName}`](construct),
      ),
    ),
  );

  // applyTo
  const applyTo = mixinClass.addMethod({ name: 'applyTo', returnType: Type.VOID });
  const target = applyTo.addParameter({ name: 'construct', type: CONSTRUCTS.IConstruct });
  applyTo.addBody(
    stmt.if_(expr.not(CallableProxy.fromMethod(supports).invoke(target))).then(stmt.ret()),
    expr.directCode(`construct.bucketEncryption = { serverSideEncryptionConfiguration: [${flattenFunctionName}(this.rule) as any] }`),
  );
}

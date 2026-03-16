import type * as reflect from 'jsii-reflect';
import { Linter } from '../linter';

const IMIXIN_FQN = 'constructs.IMixin';
const MIXIN_FQN = 'aws-cdk-lib.Mixin';
const EXCLUDED_PACKAGES = ['@aws-cdk/cfn-property-mixins', '@aws-cdk/mixins-preview'];

interface MixinLinterContext {
  readonly classType: reflect.ClassType;
}

export const mixinLinter = new Linter<MixinLinterContext>(assembly => {
  if (!assembly.system.tryFindFqn(IMIXIN_FQN)) {
    return [];
  }

  const iMixin = assembly.system.findInterface(IMIXIN_FQN);

  return assembly.allClasses
    .filter(c => !c.abstract)
    .filter(c => c.getInterfaces(true).some(i => i.fqn === iMixin.fqn))
    .filter(c => !EXCLUDED_PACKAGES.some(pkg => c.fqn.startsWith(`${pkg}.`)))
    .map(classType => ({ classType }));
});

// Rule 1: IMixin implementors must extend Mixin base class
mixinLinter.add({
  code: 'mixin-extends-base',
  message: 'classes implementing IMixin must extend the Mixin base class',
  eval: e => {
    const mixinBase = e.ctx.classType.system.tryFindFqn(MIXIN_FQN);
    if (!mixinBase || !mixinBase.isClassType()) return;

    e.assert(
      e.ctx.classType.extends(mixinBase),
      e.ctx.classType.fqn,
    );
  },
});

// Rule 2: Mixin classes must live in lib/mixins/ on disk
mixinLinter.add({
  code: 'mixin-file-location',
  message: 'mixin classes must be defined in a lib/mixins/ directory',
  eval: e => {
    const loc = e.ctx.classType.locationInModule;
    e.assert(
      loc && loc.filename.includes('/mixins/'),
      e.ctx.classType.fqn,
      loc ? `(found at ${loc.filename})` : undefined,
    );
  },
});

// Rule 3: Mixin classes must be in the .mixins. jsii namespace
mixinLinter.add({
  code: 'mixin-namespace',
  message: 'mixin classes must be in a "mixins" jsii submodule namespace',
  eval: e => {
    const ns = e.ctx.classType.namespace;
    e.assert(
      ns && ns.split('.').includes('mixins'),
      e.ctx.classType.fqn,
      ns ? `(found in namespace "${ns}")` : undefined,
    );
  },
});

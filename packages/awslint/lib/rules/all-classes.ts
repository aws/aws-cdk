import * as reflect from 'jsii-reflect';
import { Linter } from '../linter';
import { AbstractBaseReflection } from './abstract';
import { ConstructReflection } from './construct';

export const allClassesScopeLinter = new Linter<AllClassScopeReflection>(assembly => assembly.classes
  .map(construct => new AllClassScopeReflection(construct)));

export class AllClassScopeReflection {
  public readonly assembly: reflect.Assembly;
  public readonly sys: reflect.TypeSystem;
  public readonly constructClasses: ConstructReflection[];
  public readonly abstractClasses: AbstractBaseReflection[];

  constructor(public readonly classType: reflect.ClassType) {
    this.assembly = classType.assembly;
    this.sys = this.assembly.system;
    this.constructClasses = ConstructReflection.findAllConstructs(this.assembly);
    this.abstractClasses = AbstractBaseReflection.findAllAbstractBaseClasses(this.assembly);
  }
}

allClassesScopeLinter.add({
  code: 'construct-must-have-abstract-base-class',
  message: 'construct must have an abstract base class of format <ConstructName>Base',
  eval: e => {
    const values = getConstructAndAbstractClass(e.ctx.constructClasses, e.ctx.abstractClasses);

    if (values == undefined) {
      throw new Error('Could not find Construct Class and its extended AbstractBase Class');
    }

    e.assert(`${values.construct.classType.name}Base` === values.abstract.classType.name, e.ctx.classType.fqn);
  },
});

allClassesScopeLinter.add({
  code: 'construct-must-extend-abstract-base-class',
  message: 'construct must extend abstract base class of format <ConstructName>Base',
  eval: e => {
    const values = getConstructAndAbstractClass(e.ctx.constructClasses, e.ctx.abstractClasses);
    if (values == undefined) {
      throw new Error('Could not find Construct Class and its extended AbstractBase Class');
    }

    e.assert(values.construct.classType.extends(values.abstract.classType), e.ctx.classType.fqn);
  },
});

function getConstructAndAbstractClass(constructClasses: ConstructReflection[], abstractClasses: AbstractBaseReflection[])
  : {construct: ConstructReflection, abstract: AbstractBaseReflection} | undefined {
  for (const construct of constructClasses) {
    for (const abstract of abstractClasses) {
      if (`${construct.classType.name}Base` === abstract.classType.name) {
        return { construct, abstract };
      }
    }
  }
  return undefined;
}

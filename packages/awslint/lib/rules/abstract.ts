import * as reflect from 'jsii-reflect';
import { Linter } from '../linter';
import { CoreTypes } from './core-types';

export const abstractBaseLinter = new Linter<AbstractBaseReflection>(assembly => assembly.classes
  .filter(t => CoreTypes.isAbstractBaseClass(t))
  .map(construct => new AbstractBaseReflection(construct)));

export class AbstractBaseReflection {
  public static findAllAbstractBaseClasses(assembly: reflect.Assembly) {
    return assembly.classes
      .filter(t => CoreTypes.isAbstractBaseClass(t))
      .map(construct => new AbstractBaseReflection(construct));
  }

  public readonly assembly: reflect.Assembly;
  public readonly sys: reflect.TypeSystem;

  constructor(public readonly classType: reflect.ClassType) {
    this.assembly = classType.assembly;
    this.sys = this.assembly.system;
  }
}

abstractBaseLinter.add({
  code: 'abstract-base-class-must-implement-construct-interface',
  message: 'abstract base class of format <ConstructName>Base must implement interface of format I<ConstructName>',
  eval: e => {
    const className = e.ctx.classType.name;

    if (!((className).substring(className.lastIndexOf('Base')) == 'Base')) {
      return ;
    }

    const constructInterfaceName = `I${className.replace('Base', '')}`;
    const listOfImplementedInterfaces = e.ctx.classType.getInterfaces()
      .filter(interfaceType => interfaceType.name === constructInterfaceName);

    e.assert(listOfImplementedInterfaces.length != 0, e.ctx.classType.fqn);
  },
});

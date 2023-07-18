import * as reflect from 'jsii-reflect';
import { memberFqn } from './util';
import { Linter } from '../linter';

export const integrationLinter = new Linter<IntegrationReflection>(assembly => assembly.interfaces
  .filter(IntegrationReflection.isIntegrationInterface)
  .map(construct => new IntegrationReflection(construct)));

const BIND_METHOD_NAME = 'bind';

class IntegrationReflection {
  public static isIntegrationInterface(x: reflect.InterfaceType): boolean {
    return x.allMethods.some(m => m.name === BIND_METHOD_NAME);
  }

  constructor(public readonly integrationInterface: reflect.InterfaceType) {
  }

  public get bindMethod(): reflect.Method {
    return this.integrationInterface.allMethods.find(m => m.name === BIND_METHOD_NAME)!;
  }
}

integrationLinter.add({
  code: 'integ-return-type',
  message: '\'bind(...)\' should return a type named \'XxxConfig\'',
  eval: e => {
    const returnsFqn = e.ctx.bindMethod.returns.type.fqn;

    e.assert(returnsFqn && returnsFqn.endsWith('Config'), memberFqn(e.ctx.bindMethod));
  },
});

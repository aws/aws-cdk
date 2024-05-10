/* eslint-disable import/no-extraneous-dependencies */
import { $E, IScope, ThingSymbol, expr } from '@cdklabs/typewriter';
import { ComponentType, Runtime } from '../config';

export function buildComponentName(fqn: string, type: ComponentType, entrypoint: string) {
  const id = fqn.split('/').at(-1)?.replace('-provider', '') ?? '';
  const handler = entrypoint.split('.').at(-1)?.replace(/[_Hh]andler/g, '') ?? '';
  const name = (id.replace(
    /-([a-z])/g, (s) => { return s[1].toUpperCase(); },
  )) + (handler.charAt(0).toUpperCase() + handler.slice(1));
  return name.charAt(0).toUpperCase()
    + name.slice(1)
    + (type === ComponentType.CUSTOM_RESOURCE_PROVIDER ? 'Provider' : type);
}

export function toLambdaRuntime(runtime: Runtime) {
  switch (runtime) {
    case Runtime.NODEJS_18_X: {
      return 'lambda.Runtime.NODEJS_18_X';
    }
    case Runtime.PYTHON_3_9: {
      return 'lambda.Runtime.PYTHON_3_9';
    }
    case Runtime.PYTHON_3_10: {
      return 'lambda.Runtime.PYTHON_3_10';
    }
  }
}

export function makeCallableExpr(scope: IScope, name: string) {
  return {
    name,
    expr: $E(expr.sym(new ThingSymbol(name, scope))),
  };
}

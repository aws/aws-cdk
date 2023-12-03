import { Expression, ParameterSpec, Type, stmt, expr, SuperInitializer } from '@cdklabs/typewriter';
import { CONSTRUCTS_MODULE } from './cdk-imports';
import { CdkHandlerFrameworkClass } from './class-builder';

interface ConstructorOptions {
  readonly constructorPropsParam?: ParameterSpec,
  readonly superProps?: Expression,
}

export abstract class CdkHandlerFrameworkConstructor {
  public static forCdkFunction(_class: CdkHandlerFrameworkClass) {
    CdkHandlerFrameworkConstructor.forCdkHandlerFrameworkClass(_class);
  }

  public static forCdkSingletonFunction(_class: CdkHandlerFrameworkClass) {
    CdkHandlerFrameworkConstructor.forCdkHandlerFrameworkClass(_class);
  }

  private static forCdkHandlerFrameworkClass(_class: CdkHandlerFrameworkClass, constructorOptions: ConstructorOptions = {}) {
    // constructor
    const init = _class.addInitializer({});
    const scope = init.addParameter({
      name: 'scope',
      type: CONSTRUCTS_MODULE.Construct,
    });
    const id = init.addParameter({
      name: 'id',
      type: Type.STRING,
    });
    if (constructorOptions.constructorPropsParam) {
      init.addParameter(constructorOptions.constructorPropsParam);
    }

    // build CdkHandler instance
    init.addBody(
      stmt.constVar(
        expr.ident('cdkHandlerProps'),
        expr.object({
          codeDirectory: expr.lit(`${_class.codeDirectory}`),
          entrypoint: _class.entrypoint
            ? expr.lit(`${_class.entrypoint}`)
            : expr.lit('index.handler'),
        }),
      ),
    );
    init.addBody(
      stmt.constVar(
        expr.ident('cdkHandler'),
        expr.directCode("new CdkHandler(scope, 'Handler', cdkHandlerProps)"),
      ),
    );

    // build super call
    const superInitializerArgs: Expression[] = [scope, id];
    if (constructorOptions.superProps) {
      superInitializerArgs.push(constructorOptions.superProps);
    }
    init.addBody(new SuperInitializer(...superInitializerArgs));
  }
}
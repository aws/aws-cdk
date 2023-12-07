/* eslint-disable import/no-extraneous-dependencies */
import { Expression, Type, stmt, expr, SuperInitializer, ObjectLiteral, Splat } from '@cdklabs/typewriter';
import { CdkHandlerFrameworkClass } from './classes';
import { CONSTRUCTS_MODULE } from './modules';

export class CdkHandlerFrameworkConstructor {
  /**
   * Builds a constructor for a CdkFunction class.
   */
  public static forCdkFunction(_class: CdkHandlerFrameworkClass) {
    const superProps = new ObjectLiteral([
      new Splat(expr.ident('props')),
      ['code', expr.directCode('cdkHandler.code')],
      ['handler', expr.lit(_class.entrypoint)],
      ['runtime', expr.directCode('cdkHandler.runtime')],
    ]);
    CdkHandlerFrameworkConstructor.forClass(_class, superProps);
  }

  /**
   * Builds a constructor for a CdkSingletonFunction class.
   */
  public static forCdkSingletonFunction(_class: CdkHandlerFrameworkClass) {
    CdkHandlerFrameworkConstructor.forCdkFunction(_class);
  }

  /**
   * Builds a constructor for a CdkCustomResourceProvider class.
   */
  public static forCdkCustomResourceProvider(_class: CdkHandlerFrameworkClass) {
    const superProps = new ObjectLiteral([
      new Splat(expr.ident('props')),
      ['codeDirectory', expr.directCode(`path.join(__dirname, '${_class.codeDirectory}')`)],
      ['runtimeName', expr.directCode('cdkHandler.runtime.name')],
    ]);
    CdkHandlerFrameworkConstructor.forClass(_class, superProps);
  }

  private static forClass(_class: CdkHandlerFrameworkClass, superProps: Expression) {
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
    init.addParameter({
      name: 'props',
      type: _class.constructorPropsType,
    });

    // get or create cdk handler
    init.addBody(
      stmt.constVar(
        expr.ident('cdkHandler'),
        expr.directCode(`${_class.name}.getOrCreateCdkHandler(scope, id)`),
      ),
    );

    // build super call
    const superInitializerArgs: Expression[] = [scope, id, superProps];
    init.addBody(new SuperInitializer(...superInitializerArgs));
  }

  private constructor() {}
}

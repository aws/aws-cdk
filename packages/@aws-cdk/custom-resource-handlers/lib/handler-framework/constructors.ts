import { Expression, Type, stmt, expr, SuperInitializer, ObjectLiteral } from '@cdklabs/typewriter';
import { CdkHandlerFrameworkClass } from './classes';
import { CONSTRUCTS_MODULE } from './modules';

export class CdkHandlerFrameworkConstructor {
  /**
   * Builds a constructor for a CdkFunction class.
   */
  public static forCdkFunction(_class: CdkHandlerFrameworkClass) {
    const superProps = new ObjectLiteral([
      ['code', expr.directCode('cdkHandler.code')],
      ['handler', expr.directCode('cdkHandler.entrypoint')],
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
      ['codeDirectory', expr.directCode('cdkHandler.codeDirectory')],
      ['runtimeName', expr.directCode('cdkHandler.runtime.name')],
    ]);
    CdkHandlerFrameworkConstructor.forClass(_class, superProps);
  }

  private static forClass(_class: CdkHandlerFrameworkClass, superProps?: Expression) {
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

    // build CdkHandler instance
    init.addBody(
      stmt.constVar(
        expr.directCode('cdkHandlerProps: handler.CdkHandlerProps'),
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
        expr.directCode("new handler.CdkHandler(scope, 'Handler', cdkHandlerProps)"),
      ),
    );

    // build super call
    const superInitializerArgs: Expression[] = [scope, id];
    if (superProps) {
      superInitializerArgs.push(superProps);
    }
    init.addBody(new SuperInitializer(...superInitializerArgs));
  }

  private constructor() {}
}

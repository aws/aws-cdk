/* eslint-disable import/no-extraneous-dependencies */
import { Expression, Type, expr, SuperInitializer, ObjectLiteral, Splat, MemberVisibility } from '@cdklabs/typewriter';
import { CdkHandlerFrameworkClass } from './classes';
import { CONSTRUCTS_MODULE } from './modules';

export class CdkHandlerFrameworkConstructor {
  /**
   * Builds a constructor for a CdkFunction class.
   */
  public static forCdkFunction(_class: CdkHandlerFrameworkClass) {
    const superProps = new ObjectLiteral([
      new Splat(expr.ident('props')),
      ['code', expr.directCode(`lambda.Code.fromAsset(path.join(__dirname, '${_class.codeDirectory}'))`)],
      ['handler', expr.lit(_class.entrypoint)],
      ['runtime', expr.directCode(_class.runtime.toLambdaRuntime())],
    ]);
    CdkHandlerFrameworkConstructor.forClass(_class, superProps, MemberVisibility.Public);
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
      ['runtimeName', expr.lit(_class.runtime.name)],
    ]);
    CdkHandlerFrameworkConstructor.forClass(_class, superProps, MemberVisibility.Private);
  }

  private static forClass(_class: CdkHandlerFrameworkClass, superProps: Expression, visibility: MemberVisibility) {
    const init = _class.addInitializer({ visibility });
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

    const superInitializerArgs: Expression[] = [scope, id, superProps];
    init.addBody(new SuperInitializer(...superInitializerArgs));
  }

  private constructor() {}
}

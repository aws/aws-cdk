import { SuperInitializer, ClassType, Type, IScope, expr, stmt } from '@cdklabs/typewriter';
import { CDK_FUNCTION_MODULE, CDK_SINGLETON_FUNCTION_MODULE, CONSTRUCTS_MODULE } from './cdk-imports';

export abstract class CdkHandlerClass extends ClassType {
  public static buildCdkFunction(scope: IScope, className: string, codeDirectory: string): ClassType {
    return new (class CdkFunction extends CdkHandlerClass {
      public constructor() {
        super(scope, {
          name: className,
          extends: CDK_FUNCTION_MODULE.CdkFunction,
        });
        this.buildConstructor(codeDirectory);
      }
    })();
  }

  public static buildCdkSingletonFunction(scope: IScope, className: string, codeDirectory: string): ClassType {
    return new (class CdkSingleFunction extends CdkHandlerClass {
      public constructor() {
        super(scope, {
          name: className,
          extends: CDK_SINGLETON_FUNCTION_MODULE.CdkSingletonFunction,
        });
        this.buildConstructor(codeDirectory);
      }
    })();
  }

  public static buildCdkCustomResourceProvider() {}

  private buildConstructor(codeDirectory: string, entrypoint?: string) {
    // constructor
    const init = this.addInitializer({});

    // build CdkHandler instance
    init.addBody(
      stmt.constVar(
        expr.ident('cdkHandlerProps'),
        expr.object({
          codeDirectory: expr.directCode(codeDirectory),
          entrypoint: entrypoint ? expr.directCode(entrypoint) : expr.lit('index.handler'),
        }),
      ),
    );
    init.addBody(
      stmt.constVar(
        expr.ident('cdkHandler'),
        expr.directCode('new CdkHandler(scope, `Handler`, cdkHandlerProps)'),
      ),
    );

    // build super call
    const scope = init.addParameter({
      name: 'scope',
      type: CONSTRUCTS_MODULE.Construct,
    });
    const id = init.addParameter({
      name: 'id',
      type: Type.STRING,
    });
    init.addBody(new SuperInitializer(scope, id, expr.object({
      handler: expr.ident('cdkHandler'),
    })));
  }
}

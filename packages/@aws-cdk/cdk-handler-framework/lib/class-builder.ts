import { SuperInitializer, ClassType, Type, IScope, expr, stmt } from '@cdklabs/typewriter';
import {
  CDK_CUSTOM_RESOURCE_PROVIDER_MODULE,
  CDK_FUNCTION_MODULE,
  CDK_SINGLETON_FUNCTION_MODULE,
  CONSTRUCTS_MODULE,
} from './cdk-imports';

interface CdkHandlerClassOptions {
  readonly entrypoint?: string;
}

export interface CdkHandlerClassProps extends CdkHandlerClassOptions {
  readonly className: string;
  readonly codeDirectory: string;
}

export abstract class CdkHandlerClass extends ClassType {
  public static buildCdkFunction(scope: IScope, props: CdkHandlerClassProps): ClassType {
    return new (class CdkFunction extends CdkHandlerClass {
      public constructor() {
        super(scope, {
          name: props.className,
          extends: CDK_FUNCTION_MODULE.CdkFunction,
        });
        this.buildConstructor(props);
      }
    })();
  }

  public static buildCdkSingletonFunction(scope: IScope, props: CdkHandlerClassProps): ClassType {
    return new (class CdkSingletonFunction extends CdkHandlerClass {
      public constructor() {
        super(scope, {
          name: props.className,
          extends: CDK_SINGLETON_FUNCTION_MODULE.CdkSingletonFunction,
        });
        this.buildConstructor(props);
      }
    })();
  }

  public static buildCdkCustomResourceProvider(scope: IScope, props: CdkHandlerClassProps): ClassType {
    return new (class CdkCustomResourceProvider extends CdkHandlerClass {
      public constructor() {
        super(scope, {
          name: props.className,
          extends: CDK_CUSTOM_RESOURCE_PROVIDER_MODULE.CdkCustomResourceProvider,
        });
        this.buildConstructor(props);
      }
    })();
  }

  private buildConstructor(props: CdkHandlerClassProps) {
    // constructor
    const init = this.addInitializer({});

    // build CdkHandler instance
    init.addBody(
      stmt.constVar(
        expr.ident('cdkHandlerProps'),
        expr.object({
          codeDirectory: expr.lit(`${props.codeDirectory}`),
          entrypoint: props.entrypoint
            ? expr.lit(`${props.entrypoint}`)
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

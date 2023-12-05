import { Module, ClassType, stmt, expr, Type, ExternalModule } from '@cdklabs/typewriter';
import { CdkHandlerFrameworkConstructor } from './constructors';
import { CDK_HANDLER_MODULE, CONSTRUCTS_MODULE, LAMBDA_MODULE, CORE_MODULE } from './modules';

/**
 * Initialization properties used to build a `CdkHandlerFrameworkClass` instance.
 */
export interface CdkHandlerClassProps {
  /**
   * The name of the class.
   */
  readonly className: string;

  /**
   * A local file system directory with the provider's code. The code will be
   * bundled into a zip asset and wired to the provider's AWS Lambda function.
   */
  readonly codeDirectory: string;

  /**
   * The name of the method within your code that Lambda calls to execute your function.
   *
   * @default 'index.handler'
   */
  readonly entrypoint?: string;
}

export abstract class CdkHandlerFrameworkClass extends ClassType {
  /**
   * Builds a `CdkFunction` class.
   */
  public static buildCdkFunction(scope: Module, props: CdkHandlerClassProps): CdkHandlerFrameworkClass {
    return new (class CdkFunction extends CdkHandlerFrameworkClass {
      public readonly codeDirectory: string;
      public readonly entrypoint: string;
      public readonly constructs: { [construct: string]: ExternalModule } = {
        Construct: CONSTRUCTS_MODULE,
        CdkHandlerProps: CDK_HANDLER_MODULE,
        CdkHandler: CDK_HANDLER_MODULE,
        Function: LAMBDA_MODULE,
      };

      public constructor() {
        super(scope, {
          name: props.className,
          extends: LAMBDA_MODULE.Function,
          export: true,
        });
        this.codeDirectory = props.codeDirectory;
        this.entrypoint = props.entrypoint ?? 'index.handler';

        CONSTRUCTS_MODULE.import(scope, 'constructs');
        CDK_HANDLER_MODULE.import(scope, 'handler');
        LAMBDA_MODULE.import(scope, 'lambda');

        CdkHandlerFrameworkConstructor.forCdkFunction(this);
      }
    })();
  }

  /**
   * Builds a `CdkSingletonFunction` class.
   */
  public static buildCdkSingletonFunction(scope: Module, props: CdkHandlerClassProps): CdkHandlerFrameworkClass {
    return new (class CdkSingletonFunction extends CdkHandlerFrameworkClass {
      public readonly codeDirectory: string;
      public readonly entrypoint: string;
      public readonly constructs: { [construct: string]: ExternalModule } = {
        Construct: CONSTRUCTS_MODULE,
        CdkHandlerProps: CDK_HANDLER_MODULE,
        CdkHandler: CDK_HANDLER_MODULE,
        SingletonFunction: LAMBDA_MODULE,
      };

      public constructor() {
        super(scope, {
          name: props.className,
          extends: LAMBDA_MODULE.SingletonFunction,
          export: true,
        });
        this.codeDirectory = props.codeDirectory;
        this.entrypoint = props.entrypoint ?? 'index.handler';

        CONSTRUCTS_MODULE.import(scope, 'constructs');
        CDK_HANDLER_MODULE.import(scope, 'handler');
        LAMBDA_MODULE.import(scope, 'lambda');

        CdkHandlerFrameworkConstructor.forCdkFunction(this);
      }
    })();
  }

  /**
   * Builds a `CdkCustomResourceProvider` class.
   */
  public static buildCdkCustomResourceProvider(scope: Module, props: CdkHandlerClassProps): CdkHandlerFrameworkClass {
    return new (class CdkCustomResourceProvider extends CdkHandlerFrameworkClass {
      public readonly codeDirectory: string;
      public readonly entrypoint: string;
      public readonly constructs: { [construct: string]: ExternalModule } = {
        Construct: CONSTRUCTS_MODULE,
        CdkHandlerProps: CDK_HANDLER_MODULE,
        CdkHandler: CDK_HANDLER_MODULE,
        CustomResourceProviderBase: CORE_MODULE,
      };

      public constructor() {
        super(scope, {
          name: props.className,
          extends: CORE_MODULE.CustomResourceProviderBase,
          export: true,
        });
        this.codeDirectory = props.codeDirectory;
        this.entrypoint = props.entrypoint ?? 'index.handler';

        CONSTRUCTS_MODULE.import(scope, 'constructs');
        CDK_HANDLER_MODULE.import(scope, 'handler');
        CORE_MODULE.import(scope, 'core');

        const getOrCreateMethod = this.addMethod({
          name: 'getOrCreate',
          static: true,
          returnType: Type.STRING,
          docs: {
            summary: 'Returns a stack-level singleton ARN (service token) for the custom resource provider.',
          },
        });
        getOrCreateMethod.addParameter({
          name: 'scope',
          type: CONSTRUCTS_MODULE.Construct,
        });
        getOrCreateMethod.addParameter({
          name: 'uniqueid',
          type: Type.STRING,
        });
        getOrCreateMethod.addBody(
          stmt.ret(expr.directCode('this.getOrCreateProvider(scope, uniqueid).serviceToken')),
        );

        const getOrCreateProviderMethod = this.addMethod({
          name: 'getOrCreateProvider',
          static: true,
          returnType: this.type,
          docs: {
            summary: 'Returns a stack-level singleton for the custom resource provider.',
          },
        });
        getOrCreateProviderMethod.addParameter({
          name: 'scope',
          type: CONSTRUCTS_MODULE.Construct,
        });
        getOrCreateProviderMethod.addParameter({
          name: 'uniqueid',
          type: Type.STRING,
        });
        getOrCreateProviderMethod.addBody(
          stmt.constVar(expr.ident('id'), expr.directCode('`${uniqueid}CustomResourceProvider`')),
          stmt.constVar(expr.ident('stack'), expr.directCode('Stack.of(scope)')),
          stmt.constVar(expr.ident('existing'), expr.directCode(`stack.node.tryFindChild(id) as ${this.type}`)),
          stmt.ret(expr.directCode(`existing ?? new ${this.name}(scope, id)`)),
        );

        CdkHandlerFrameworkConstructor.forCdkCustomResourceProvider(this);
      }
    })();
  }

  /**
   * A local file system directory with the provider's code. The code will be
   * bundled into a zip asset and wired to the provider's AWS Lambda function.
   */
  public abstract readonly codeDirectory: string;

  /**
   * The name of the method within your code that Lambda calls to execute your function.
   */
  public abstract readonly entrypoint: string;

  /**
   * A map representing the constructs this class depends on and the external module that the
   * consruct can be imported from.
   */
  public abstract readonly constructs: { [construct: string]: ExternalModule };
}

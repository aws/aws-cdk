import { Module, ClassType, stmt, expr, Type } from '@cdklabs/typewriter';
import { CdkHandlerFrameworkConstructor } from './constructors';
import { CDK_HANDLER_MODULE, CONSTRUCTS_MODULE, LAMBDA_MODULE, CORE_MODULE } from './modules';

/**
 * Initialization properties used to build a `CdkHandlerFrameworkClass`.
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
   * Builds a CdkFunction class.
   */
  public static buildCdkFunction(scope: Module, props: CdkHandlerClassProps) {
    new (class CdkFunction extends CdkHandlerFrameworkClass {
      public readonly codeDirectory: string;
      public readonly entrypoint: string;

      public constructor() {
        super(scope, {
          name: props.className,
          extends: LAMBDA_MODULE.Function,
        });
        this.codeDirectory = props.codeDirectory;
        this.entrypoint = props.entrypoint ?? 'index.handler';

        CONSTRUCTS_MODULE.importSelective(scope, ['Construct']);
        CDK_HANDLER_MODULE.importSelective(scope, ['CdkHandlerProps', 'CdkHandler']);
        LAMBDA_MODULE.importSelective(scope, ['Function']);

        CdkHandlerFrameworkConstructor.forCdkFunction(this);
      }
    })();
  }

  /**
   * Builds a CdkSingletonFunction class.
   */
  public static buildCdkSingletonFunction(scope: Module, props: CdkHandlerClassProps) {
    new (class CdkSingletonFunction extends CdkHandlerFrameworkClass {
      public readonly codeDirectory: string;
      public readonly entrypoint: string;

      public constructor() {
        super(scope, {
          name: props.className,
          extends: LAMBDA_MODULE.SingletonFunction,
        });
        this.codeDirectory = props.codeDirectory;
        this.entrypoint = props.entrypoint ?? 'index.handler';

        CONSTRUCTS_MODULE.importSelective(scope, ['Construct']);
        CDK_HANDLER_MODULE.importSelective(scope, ['CdkHandlerProps', 'CdkHandler']);
        LAMBDA_MODULE.importSelective(scope, ['SingletonFunction']);

        CdkHandlerFrameworkConstructor.forCdkFunction(this);
      }
    })();
  }

  /**
   * Builds a CdkCustomResourceProvider class.
   */
  public static buildCdkCustomResourceProvider(scope: Module, props: CdkHandlerClassProps) {
    new (class CdkCustomResourceProvider extends CdkHandlerFrameworkClass {
      public readonly codeDirectory: string;
      public readonly entrypoint: string;

      public constructor() {
        super(scope, {
          name: props.className,
          extends: CORE_MODULE.CustomResourceProviderBase,
        });
        this.codeDirectory = props.codeDirectory;
        this.entrypoint = props.entrypoint ?? 'index.handler';

        CONSTRUCTS_MODULE.importSelective(scope, ['Construct']);
        CDK_HANDLER_MODULE.importSelective(scope, ['CdkHandlerProps', 'CdkHandler']);
        CORE_MODULE.importSelective(scope, ['CustomResourceProviderBase']);

        const getOrCreateMethod = this.addMethod({
          name: 'getOrCreate',
          static: true,
          returnType: Type.STRING,
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
   *
   */
  public abstract readonly codeDirectory: string;

  /**
   *
   */
  public abstract readonly entrypoint: string;
}

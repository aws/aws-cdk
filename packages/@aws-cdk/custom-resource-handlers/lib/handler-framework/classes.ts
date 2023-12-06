/* eslint-disable import/no-extraneous-dependencies */
import { ClassType, stmt, expr, Type, ExternalModule, Expression } from '@cdklabs/typewriter';
import { CdkHandlerFrameworkConstructor } from './constructors';
import { CDK_HANDLER_MODULE, CONSTRUCTS_MODULE, LAMBDA_MODULE, CORE_MODULE } from './modules';
import { CdkHandlerFrameworkModule } from './framework';

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

  /**
   * A unique identifier to identify this lambda
   *
   * The identifier should be unique across all custom resource providers.
   * We recommend generating a UUID per provider.
   *
   * Note: This is only required for `CdkSingletonFunction`
   */
  readonly uuid?: string;

  /**
   * A descriptive name for the purpose of this Lambda.
   *
   * If the Lambda does not have a physical name, this string will be
   * reflected its generated name. The combination of lambdaPurpose
   * and uuid must be unique.
   *
   * @default SingletonLambda
   */
  readonly lambdaPurpose?: string;
}

export abstract class CdkHandlerFrameworkClass extends ClassType {
  /**
   * Builds a `CdkFunction` class.
   */
  public static buildCdkFunction(scope: CdkHandlerFrameworkModule, props: CdkHandlerClassProps): CdkHandlerFrameworkClass {
    return new (class CdkFunction extends CdkHandlerFrameworkClass {
      public readonly codeDirectory: string;
      public readonly entrypoint: string;
      public readonly superProps: [string, Expression][] = [];

      protected readonly externalModules = [CONSTRUCTS_MODULE, LAMBDA_MODULE, CDK_HANDLER_MODULE];

      public constructor() {
        super(scope, {
          name: props.className,
          extends: LAMBDA_MODULE.Function,
          export: true,
        });
        this.codeDirectory = props.codeDirectory;
        this.entrypoint = props.entrypoint ?? 'index.handler';

        this.buildSuperProps(props);
        this.externalModules.forEach(module => scope.addExternalModule(module));

        CdkHandlerFrameworkConstructor.forCdkFunction(this);
      }
    })();
  }

  /**
   * Builds a `CdkSingletonFunction` class.
   */
  public static buildCdkSingletonFunction(scope: CdkHandlerFrameworkModule, props: CdkHandlerClassProps): CdkHandlerFrameworkClass {
    return new (class CdkSingletonFunction extends CdkHandlerFrameworkClass {
      public readonly codeDirectory: string;
      public readonly entrypoint: string;
      public readonly superProps: [string, Expression][] = [];

      protected readonly externalModules = [CONSTRUCTS_MODULE, LAMBDA_MODULE, CDK_HANDLER_MODULE];

      public constructor() {
        super(scope, {
          name: props.className,
          extends: LAMBDA_MODULE.SingletonFunction,
          export: true,
        });
        this.codeDirectory = props.codeDirectory;
        this.entrypoint = props.entrypoint ?? 'index.handler';

        this.buildSuperProps(props);
        this.externalModules.forEach(module => scope.addExternalModule(module));

        CdkHandlerFrameworkConstructor.forCdkFunction(this);
      }
    })();
  }

  /**
   * Builds a `CdkCustomResourceProvider` class.
   */
  public static buildCdkCustomResourceProvider(scope: CdkHandlerFrameworkModule, props: CdkHandlerClassProps): CdkHandlerFrameworkClass {
    return new (class CdkCustomResourceProvider extends CdkHandlerFrameworkClass {
      public readonly codeDirectory: string;
      public readonly entrypoint: string;
      public readonly superProps: [string, Expression][] = [];

      protected readonly externalModules = [CONSTRUCTS_MODULE, CORE_MODULE, CDK_HANDLER_MODULE];

      public constructor() {
        super(scope, {
          name: props.className,
          extends: CORE_MODULE.CustomResourceProviderBase,
          export: true,
        });
        this.codeDirectory = props.codeDirectory;
        this.entrypoint = props.entrypoint ?? 'index.handler';

        this.buildSuperProps(props);
        this.externalModules.forEach(module => scope.addExternalModule(module));

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
   *
   */
  public abstract readonly superProps: [string, Expression][];

  /**
   * External modules that this class depends on.
   */
  protected abstract readonly externalModules: ExternalModule[];

  private buildSuperProps(props: CdkHandlerClassProps) {
    if (props.uuid) {
      this.superProps.push(['uuid', expr.directCode(`${props.uuid}`)]);
    }

    if (props.lambdaPurpose) {
      this.superProps.push(['lambdaPurpose', expr.directCode(`${props.lambdaPurpose}`)]);
    }
  }
}

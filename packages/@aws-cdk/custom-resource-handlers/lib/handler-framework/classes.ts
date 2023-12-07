/* eslint-disable import/no-extraneous-dependencies */
import { ClassType, stmt, expr, Type, MemberVisibility, ExternalModule, PropertySpec, InterfaceSpec, InterfaceType } from '@cdklabs/typewriter';
import { CdkHandlerFrameworkConstructor } from './constructors';
import { CdkHandlerFrameworkModule } from './framework';
import { CDK_HANDLER_MODULE, CONSTRUCTS_MODULE, LAMBDA_MODULE, CORE_MODULE } from './modules';

/**
 * Runtimes that map to a Lambda runtime during codegen.
 */
export enum FrameworkRuntime {
  /**
   * The NodeJS 16.x runtime.
   */
  NODEJS_16_X = 'lambda.Runtime.NODEJS_16_X',

  /**
   * The NodeJS 18.x runtime.
   */
  NODEJS_18_X = 'lambda.Runtime.NODEJS_18_X',

  /**
   * The NodeJS 20.x runtime.
   */
  NODEJS_20_X = 'lambda.Runtime.NODEJS_20_X',

  /**
   * The Python 3.9 runtime.
   */
  PYTHON_3_9 = 'lambda.Runtime.PYTHON_3_9',

  /**
   * The Python 3.10 runtime.
   */
  PYTHON_3_10 = 'lambda.Runtime.PYTHON_3_10',
}

/**
 * Initialization properties used to build a `CdkHandlerFrameworkClass` instance.
 */
export interface CdkHandlerClassProps {
  /**
   * The name of the component class.
   */
  readonly name: string;

  /**
   * A local file system directory with the provider's code. The code will be
   * bundled into a zip asset and wired to the provider's AWS Lambda function.
   */
  readonly codeDirectory: string;

  /**
   * Runtimes that are compatible with the source code.
   */
  readonly compatibleRuntimes: FrameworkRuntime[];

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
  public static buildCdkFunction(scope: CdkHandlerFrameworkModule, props: CdkHandlerClassProps): CdkHandlerFrameworkClass {
    return new (class CdkFunction extends CdkHandlerFrameworkClass {
      public readonly codeDirectory: string;
      public readonly entrypoint: string;
      public readonly compatibleRuntimes: FrameworkRuntime[];
      public readonly constructorPropsType = LAMBDA_MODULE.FunctionOptions;

      protected readonly externalModules = [CONSTRUCTS_MODULE, CORE_MODULE, LAMBDA_MODULE, CDK_HANDLER_MODULE];

      public constructor() {
        super(scope, {
          name: props.name,
          extends: LAMBDA_MODULE.Function,
          export: true,
        });
        this.codeDirectory = props.codeDirectory;
        this.entrypoint = props.entrypoint ?? 'index.handler';
        this.compatibleRuntimes = props.compatibleRuntimes;

        this.externalModules.forEach(module => scope.addExternalModule(module));
        this.buildGetOrCreateCdkHandler();

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
      public readonly compatibleRuntimes: FrameworkRuntime[];
      public readonly constructorPropsType: Type;

      protected readonly externalModules = [CONSTRUCTS_MODULE, CORE_MODULE, LAMBDA_MODULE, CDK_HANDLER_MODULE];

      public constructor() {
        super(scope, {
          name: props.name,
          extends: LAMBDA_MODULE.SingletonFunction,
          export: true,
        });
        this.codeDirectory = props.codeDirectory;
        this.entrypoint = props.entrypoint ?? 'index.handler';
        this.compatibleRuntimes = props.compatibleRuntimes;

        this.externalModules.forEach(module => scope.addExternalModule(module));
        this.buildGetOrCreateCdkHandler();

        const uuid: PropertySpec = {
          name: 'uuid',
          type: Type.STRING,
          immutable: true,
          docs: {
            summary: 'A unique identifier to identify this Lambda.\n\nThe identifier should be unique across all custom resource providers.\nWe recommend generating a UUID per provider.',
          },
        };
        const lambdaPurpose: PropertySpec = {
          name: 'lambdaPurpose',
          type: Type.STRING,
          immutable: true,
          optional: true,
          docs: {
            summary: 'A descriptive name for the purpose of this Lambda.\n\nIf the Lambda does not have a physical name, this string will be\nreflected in its generated name. The combination of lambdaPurpose\nand uuid must be unique.',
            docTags: {
              default: 'SingletonLambda',
            },
          },
        };
        const _interface = this.getOrCreateInterface(scope, {
          name: 'CdkSingletonFunctionProps',
          export: true,
          extends: [LAMBDA_MODULE.FunctionOptions],
          properties: [uuid, lambdaPurpose],
        });
        this.constructorPropsType = _interface.type;

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
      public readonly compatibleRuntimes: FrameworkRuntime[];
      public readonly constructorPropsType = CORE_MODULE.CustomResourceProviderOptions;

      protected readonly externalModules = [CONSTRUCTS_MODULE, CORE_MODULE, LAMBDA_MODULE, CDK_HANDLER_MODULE];

      public constructor() {
        super(scope, {
          name: props.name,
          extends: CORE_MODULE.CustomResourceProviderBase,
          export: true,
        });
        this.codeDirectory = props.codeDirectory;
        this.entrypoint = props.entrypoint ?? 'index.handler';
        this.compatibleRuntimes = props.compatibleRuntimes;

        this.externalModules.forEach(module => scope.addExternalModule(module));
        this.buildGetOrCreateCdkHandler();

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
        getOrCreateMethod.addParameter({
          name: 'props',
          type: CORE_MODULE.CustomResourceProviderOptions,
        });
        getOrCreateMethod.addBody(
          stmt.ret(expr.directCode('this.getOrCreateProvider(scope, uniqueid, props).serviceToken')),
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
        getOrCreateProviderMethod.addParameter({
          name: 'props',
          type: CORE_MODULE.CustomResourceProviderOptions,
        });
        getOrCreateProviderMethod.addBody(
          stmt.constVar(expr.ident('id'), expr.directCode('`${uniqueid}CustomResourceProvider`')),
          stmt.constVar(expr.ident('stack'), expr.directCode('cdk.Stack.of(scope)')),
          stmt.constVar(expr.ident('existing'), expr.directCode(`stack.node.tryFindChild(id) as ${this.type}`)),
          stmt.ret(expr.directCode(`existing ?? new ${this.name}(stack, id, props)`)),
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
   * Runtimes that are compatible with the code that this class will execute.
   */
  public abstract readonly compatibleRuntimes: FrameworkRuntime[];

  /**
   * Properties used to initialize this class.
   */
  public abstract readonly constructorPropsType: Type;

  /**
   * External modules that this class depends on.
   */
  protected abstract readonly externalModules: ExternalModule[];

  private getOrCreateInterface(scope: CdkHandlerFrameworkModule, spec: InterfaceSpec) {
    const existing = scope.getInterface(spec.name);
    if (existing) {
      return existing;
    }

    const _interface = new InterfaceType(scope, { ...spec });
    scope.registerInterface(_interface);
    return _interface;
  }

  private buildGetOrCreateCdkHandler() {
    const getOrCreateCdkHandler = this.addMethod({
      name: 'getOrCreateCdkHandler',
      returnType: CDK_HANDLER_MODULE.CdkHandler,
      static: true,
      visibility: MemberVisibility.Private,
    });

    getOrCreateCdkHandler.addParameter({
      name: 'scope',
      type: CONSTRUCTS_MODULE.Construct,
    });
    getOrCreateCdkHandler.addParameter({
      name: 'uniqueid',
      type: Type.STRING,
    });

    getOrCreateCdkHandler.addBody(
      stmt.constVar(
        expr.ident('id'),
        expr.directCode('`${uniqueid}Handler`'),
      ),
      stmt.constVar(
        expr.ident('stack'),
        expr.directCode('cdk.Stack.of(scope)'),
      ),
      stmt.constVar(
        expr.ident('existing'),
        expr.directCode('stack.node.tryFindChild(id) as handler.CdkHandler'),
      ),
      stmt.if_(expr.ident('existing')).then(stmt.ret(expr.ident('existing'))),
      stmt.constVar(
        expr.directCode('cdkHandlerProps: handler.CdkHandlerProps'),
        expr.object({
          codeDirectory: expr.directCode(`path.join(__dirname, '${this.codeDirectory}')`),
          compatibleRuntimes: expr.directCode(`[${this.compatibleRuntimes }]`),
        }),
      ),
      stmt.ret(expr.directCode('new handler.CdkHandler(stack, id, cdkHandlerProps)')),
    );
  }
}

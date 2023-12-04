import { Module, ClassType, stmt, expr, Type, StructType } from '@cdklabs/typewriter';
import { CdkHandlerFrameworkConstructor } from './constructors';
import { CDK_HANDLER_MODULE, CONSTRUCTS_MODULE, LAMBDA_MODULE, CORE_MODULE } from './modules';

export interface CdkHandlerClassProps {
  readonly className: string;
  readonly codeDirectory: string;
  readonly entrypoint?: string;
}

export abstract class CdkHandlerFrameworkClass extends ClassType {
  /**
   * Builds a CdkFunction class.
   */
  public static buildCdkFunction(module: Module, props: CdkHandlerClassProps): CdkHandlerFrameworkClass {
    return new (class CdkFunction extends CdkHandlerFrameworkClass {
      public readonly codeDirectory: string;
      public readonly entrypoint: string;
      public readonly propsType: Type;

      public constructor() {
        super(module, {
          name: props.className,
          extends: LAMBDA_MODULE.Function,
        });
        this.codeDirectory = props.codeDirectory;
        this.entrypoint = props.entrypoint ?? 'index.handler';

        CONSTRUCTS_MODULE.importSelective(module, ['Constructs']);
        CDK_HANDLER_MODULE.importSelective(module, ['CdkHandler']);
        LAMBDA_MODULE.importSelective(module, ['Function']);

        const _props = new StructType(this, {
          name: 'CdkFunctionProps',
          extends: [LAMBDA_MODULE.FunctionOptions],
          export: true,
        });
        this.propsType = _props.type;

        CdkHandlerFrameworkConstructor.forCdkFunction(this);
      }
    })();
  }

  /**
   * Builds a CdkSingletonFunction class.
   */
  public static buildCdkSingletonFunction(module: Module, props: CdkHandlerClassProps): ClassType {
    return new (class CdkSingletonFunction extends CdkHandlerFrameworkClass {
      public readonly codeDirectory: string;
      public readonly entrypoint: string;
      public readonly propsType: Type;

      public constructor() {
        super(module, {
          name: props.className,
          extends: LAMBDA_MODULE.SingletonFunction,
        });
        this.codeDirectory = props.codeDirectory;
        this.entrypoint = props.entrypoint ?? 'index.handler';

        CONSTRUCTS_MODULE.importSelective(module, ['Constructs']);
        CDK_HANDLER_MODULE.importSelective(module, ['CdkHandler']);
        LAMBDA_MODULE.importSelective(module, ['SingletonFunction']);

        const _props = new StructType(this, {
          name: 'CdkSingletonFunctionProps',
          extends: [LAMBDA_MODULE.FunctionOptions],
          export: true,
        });
        this.propsType = _props.type;
        _props.addProperty({
          name: 'uuid',
          type: Type.STRING,
        });
        _props.addProperty({
          name: 'lambdaPurpose',
          type: Type.STRING,
          optional: true,
        });

        CdkHandlerFrameworkConstructor.forCdkFunction(this);
      }
    })();
  }

  /**
   * Builds a CdkCustomResourceProvider class.
   */
  public static buildCdkCustomResourceProvider(module: Module, props: CdkHandlerClassProps): ClassType {
    return new (class CdkCustomResourceProvider extends CdkHandlerFrameworkClass {
      public readonly codeDirectory: string;
      public readonly entrypoint: string;
      public readonly propsType: Type;

      public constructor() {
        super(module, {
          name: props.className,
          extends: CORE_MODULE.CustomResourceProviderBase,
        });
        this.codeDirectory = props.codeDirectory;
        this.entrypoint = props.entrypoint ?? 'index.handler';

        CONSTRUCTS_MODULE.importSelective(module, ['Constructs']);
        CDK_HANDLER_MODULE.importSelective(module, ['CdkHandler']);
        CORE_MODULE.importSelective(module, ['CustomResourceProviderBase']);

        const _props = new StructType(this, {
          name: 'CdkCustomResourceProviderProps',
          extends: [CORE_MODULE.CustomResourceProviderOptions],
          export: true,
        });
        this.propsType = _props.type;

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
        getOrCreateMethod.addParameter({
          name: 'props',
          type: this.propsType,
        });
        getOrCreateMethod.addBody(
          stmt.ret(expr.directCode('this.getOrCreateProvider(scope, uniqueid, props).serviceToken')),
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
        getOrCreateProviderMethod.addParameter({
          name: 'props',
          type: this.propsType,
        });
        getOrCreateProviderMethod.addBody(
          stmt.constVar(expr.ident('id'), expr.directCode('`${uniqueid}CustomResourceProvider`')),
          stmt.constVar(expr.ident('stack'), expr.directCode('Stack.of(scope)')),
          stmt.ret(expr.ident('provider')),
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

  /**
   *
   */
  public abstract readonly propsType: Type;
}

import { ClassType, IScope, stmt, expr, Type, StructType } from '@cdklabs/typewriter';
import { CdkHandlerFrameworkConstructor } from './constructor-builder';
import { CONSTRUCTS_MODULE, CORE_MODULE, LAMBDA_MODULE } from './imports';

interface CdkHandlerClassOptions {
  readonly entrypoint?: string;
}

export interface CdkHandlerClassProps extends CdkHandlerClassOptions {
  readonly className: string;
  readonly codeDirectory: string;
}

export abstract class CdkHandlerFrameworkClass extends ClassType {
  /**
   * Builds a CdkFunction class.
   */
  public static buildCdkFunction(scope: IScope, props: CdkHandlerClassProps): CdkHandlerFrameworkClass {
    return new (class CdkFunction extends CdkHandlerFrameworkClass {
      public readonly codeDirectory: string;
      public readonly entrypoint: string;
      public readonly propsType: Type;

      public constructor() {
        super(scope, {
          name: props.className,
          extends: LAMBDA_MODULE.Function,
        });
        this.codeDirectory = props.codeDirectory;
        this.entrypoint = props.entrypoint ?? 'index.handler';

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
  public static buildCdkSingletonFunction(scope: IScope, props: CdkHandlerClassProps): ClassType {
    return new (class CdkSingletonFunction extends CdkHandlerFrameworkClass {
      public readonly codeDirectory: string;
      public readonly entrypoint: string;
      public readonly propsType: Type;

      public constructor() {
        super(scope, {
          name: props.className,
          extends: LAMBDA_MODULE.SingletonFunction,
        });
        this.codeDirectory = props.codeDirectory;
        this.entrypoint = props.entrypoint ?? 'index.handler';

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

        CdkHandlerFrameworkConstructor.forCdkSingletonFunction(this);
      }
    })();
  }

  /**
   * Builds a CdkCustomResourceProvider class.
   */
  public static buildCdkCustomResourceProvider(scope: IScope, props: CdkHandlerClassProps): ClassType {
    return new (class CdkCustomResourceProvider extends CdkHandlerFrameworkClass {
      public readonly codeDirectory: string;
      public readonly entrypoint: string;
      public readonly propsType: Type;

      public constructor() {
        super(scope, {
          name: props.className,
          extends: CORE_MODULE.CustomResourceProviderBase,
        });
        this.codeDirectory = props.codeDirectory;
        this.entrypoint = props.entrypoint ?? 'index.handler';

        const _props = new StructType(this, {
          name: 'CdkCustomResourceProviderProps',
          extends: [CORE_MODULE.CustomResourceProviderOptions],
          export: true,
        });
        this.propsType = _props.type;

        const getOrCreateMethod = this.addMethod({
          name: 'getOrCreate',
          static: true,
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

import { ClassType, IScope } from '@cdklabs/typewriter';
import { LAMBDA_MODULE } from './cdk-imports';
import { CdkHandlerFrameworkConstructor } from './constructor-builder';

interface CdkHandlerClassOptions {
  readonly entrypoint?: string;
}

export interface CdkHandlerClassProps extends CdkHandlerClassOptions {
  readonly className: string;
  readonly codeDirectory: string;
}

export abstract class CdkHandlerFrameworkClass extends ClassType {
  /**
   *
   */
  public static buildCdkFunction(scope: IScope, props: CdkHandlerClassProps): CdkHandlerFrameworkClass {
    return new (class CdkFunction extends CdkHandlerFrameworkClass {
      public readonly codeDirectory: string;
      public readonly entrypoint: string;

      public constructor() {
        super(scope, {
          name: props.className,
          extends: LAMBDA_MODULE.Function,
        });
        this.codeDirectory = props.codeDirectory;
        this.entrypoint = props.entrypoint ?? 'index.handler';
        CdkHandlerFrameworkConstructor.forCdkFunction(this);
      }
    })();
  }

  /**
   *
   */
  public static buildCdkSingletonFunction(scope: IScope, props: CdkHandlerClassProps): ClassType {
    return new (class CdkSingletonFunction extends CdkHandlerFrameworkClass {
      public readonly codeDirectory: string;
      public readonly entrypoint: string;

      public constructor() {
        super(scope, {
          name: props.className,
          extends: LAMBDA_MODULE.SingletonFunction,
        });
        this.codeDirectory = props.codeDirectory;
        this.entrypoint = props.entrypoint ?? 'index.handler';
        CdkHandlerFrameworkConstructor.forCdkSingletonFunction(this);
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

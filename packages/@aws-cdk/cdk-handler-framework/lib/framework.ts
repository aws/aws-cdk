import { Module, TypeScriptRenderer } from '@cdklabs/typewriter';
import { CdkHandlerFrameworkClass, CdkHandlerClassProps } from './class-builder';
import { CDK_HANDLER_MODULE, CONSTRUCTS_MODULE, LAMBDA_MODULE } from './imports';

export interface CdkHandlerFrameworkProps extends CdkHandlerClassProps {}

export abstract class CdkHandlerFramework {
  /**
   * Generates a CdkHandler class that can be rendered to produce code.
   */
  public static cdkFunction(props: CdkHandlerFrameworkProps): CdkHandlerFramework {
    return new (class extends CdkHandlerFramework {
      public constructor() {
        const module = new Module('cdk-function');
        CONSTRUCTS_MODULE.importSelective(module, ['Construct']);
        CDK_HANDLER_MODULE.importSelective(module, ['CdkHandler']);
        LAMBDA_MODULE.importSelective(module, ['Function', 'FunctionOptions']);
        CdkHandlerFrameworkClass.buildCdkFunction(module, props);
        super(module);
      }
    })();
  }

  /**
   *
   */
  public static cdkSingletonFunction(props: CdkHandlerFrameworkProps): CdkHandlerFramework {
    return new (class extends CdkHandlerFramework {
      public constructor() {
        const module = new Module('cdk-singleton-function');
        CONSTRUCTS_MODULE.importSelective(module, ['Construct']);
        CDK_HANDLER_MODULE.importSelective(module, ['CdkHandler']);
        LAMBDA_MODULE.importSelective(module, ['SingletonFunction', 'FunctionOptions']);
        CdkHandlerFrameworkClass.buildCdkSingletonFunction(module, props);
        super(module);
      }
    })();
  }

  private readonly renderer = new TypeScriptRenderer();

  protected constructor(private readonly module: Module) {}

  /**
   * Render code for the framework.
   */
  public render() {
    return this.renderer.render(this.module);
  };
}

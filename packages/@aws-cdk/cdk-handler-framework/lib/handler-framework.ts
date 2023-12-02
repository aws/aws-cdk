import { Module, TypeScriptRenderer } from '@cdklabs/typewriter';
import { CDK_FUNCTION_MODULE, CDK_HANDLER_MODULE, CONSTRUCTS_MODULE, CDK_SINGLETON_FUNCTION_MODULE } from './cdk-imports';
import { CdkHandlerClass } from './class-builder';

export abstract class CdkHandlerFramework {
  /**
   * Generates a CdkHandler class that can be rendered to produce code.
   */
  public static cdkFunction(className: string, codeDirectory: string): CdkHandlerFramework {
    return new (class CdkFunction extends CdkHandlerFramework {
      public constructor() {
        const module = new Module('cdk-function');
        CONSTRUCTS_MODULE.importSelective(module, ['Construct']);
        CDK_HANDLER_MODULE.importSelective(module, ['CdkHandler']);
        CDK_FUNCTION_MODULE.importSelective(module, ['CdkFunction']);
        CdkHandlerClass.buildCdkFunction(module, className, codeDirectory);
        super(module);
      }
    })();
  }

  public static cdkSingletonFunction(className: string, codeDirectory: string): CdkHandlerFramework {
    return new (class CdkSingletonFunction extends CdkHandlerFramework {
      public constructor() {
        const module = new Module('cdk-singleton-function');
        CONSTRUCTS_MODULE.importSelective(module, ['Construct']);
        CDK_HANDLER_MODULE.importSelective(module, ['CdkHandler']);
        CDK_SINGLETON_FUNCTION_MODULE.importSelective(module, ['CdkSingletonFunction']);
        CdkHandlerClass.buildCdkSingletonFunction(module, className, codeDirectory);
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

import { Module, TypeScriptRenderer } from '@cdklabs/typewriter';
import {
  CDK_FUNCTION_MODULE,
  CDK_HANDLER_MODULE,
  CONSTRUCTS_MODULE,
  CDK_SINGLETON_FUNCTION_MODULE,
  CDK_CUSTOM_RESOURCE_PROVIDER_MODULE,
} from './cdk-imports';
import { CdkHandlerClass, CdkHandlerClassProps } from './class-builder';

export interface CdkHandlerFrameworkProps extends CdkHandlerClassProps {}

export abstract class CdkHandlerFramework {
  /**
   * Generates a CdkHandler class that can be rendered to produce code.
   */
  public static cdkFunction(props: CdkHandlerFrameworkProps): CdkHandlerFramework {
    return new (class CdkFunction extends CdkHandlerFramework {
      public constructor() {
        const module = new Module('cdk-function');
        CONSTRUCTS_MODULE.importSelective(module, ['Construct']);
        CDK_HANDLER_MODULE.importSelective(module, ['CdkHandler']);
        CDK_FUNCTION_MODULE.importSelective(module, ['CdkFunction']);
        CdkHandlerClass.buildCdkFunction(module, props);
        super(module);
      }
    })();
  }

  public static cdkSingletonFunction(props: CdkHandlerFrameworkProps): CdkHandlerFramework {
    return new (class CdkSingletonFunction extends CdkHandlerFramework {
      public constructor() {
        const module = new Module('cdk-singleton-function');
        CONSTRUCTS_MODULE.importSelective(module, ['Construct']);
        CDK_HANDLER_MODULE.importSelective(module, ['CdkHandler']);
        CDK_SINGLETON_FUNCTION_MODULE.importSelective(module, ['CdkSingletonFunction']);
        CdkHandlerClass.buildCdkSingletonFunction(module, props);
        super(module);
      }
    })();
  }

  public static cdkCustomResourceProvider(props: CdkHandlerFrameworkProps): CdkHandlerFramework {
    return new (class CdkCustomResourceProvider extends CdkHandlerFramework {
      public constructor() {
        const module = new Module('cdk-custom-resource-provider');
        CONSTRUCTS_MODULE.importSelective(module, ['Construct']);
        CDK_HANDLER_MODULE.importSelective(module, ['CdkHandler']);
        CDK_CUSTOM_RESOURCE_PROVIDER_MODULE.importSelective(module, ['CdkCustomResourceProvider']);
        CdkHandlerClass.buildCdkCustomResourceProvider(module, props);
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

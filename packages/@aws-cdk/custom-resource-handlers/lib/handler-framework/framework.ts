import { ExternalModule, Module, TypeScriptRenderer } from '@cdklabs/typewriter';
import * as fs from 'fs-extra';
import { CdkHandlerClassProps, CdkHandlerFrameworkClass } from './classes';

/**
 * Handler framework component types.
 */
export enum ComponentType {
  /**
   * `CdkFunction`
   */
  CDK_FUNCTION = 'CdkFunction',

  /**
   * `CdkSingletonFunction`
   */
  CDK_SINGLETON_FUNCTION = 'CdkSingletonFunction',

  /**
   * `CdkCustomResourceProvider`
   */
  CDK_CUSTOM_RESOURCE_PROVIDER = 'CdkCustomResourceProvider',
}

/**
 * Properties used to generate a specific handler framework component
 */
export interface ComponentDefinition {
  /**
   * The component type to generate.
   */
  readonly type: ComponentType;

  /**
   * The name to generate the component with.
   *
   * Note: This will be the name of the class, i.e., `MyCdkFunction`, etc.
   */
  readonly name: string;

  /**
   * The local file system directory with the source code.
   */
  readonly codeDirectory: string;

  /**
   * The name of the method within your code that Lambda calls to execute your function.
   *
   * @default 'index.handler'
   */
  readonly entrypoint?: string;

  /**
   * Configurable options for the underlying Lambda function.
   */
  readonly providerOptions?: any;
}

export class CdkHandlerFramework extends Module {
  /**
   * Build a framework module with specified components.
   */
  public static build(components: ComponentDefinition[]) {
    return new CdkHandlerFramework(components);
  }

  private readonly renderer = new TypeScriptRenderer();
  private readonly constructs = new Map<string, ExternalModule>();

  private constructor(components: ComponentDefinition[]) {
    super('cdk-handler-framework');

    for (let component of components) {
      const props: CdkHandlerClassProps = {
        codeDirectory: component.codeDirectory,
        className: component.name,
        entrypoint: component.entrypoint,
      };

      let _class: CdkHandlerFrameworkClass;
      switch (component.type) {
        case ComponentType.CDK_FUNCTION: {
          _class = CdkHandlerFrameworkClass.buildCdkFunction(this, props);
          break;
        }
        case ComponentType.CDK_SINGLETON_FUNCTION: {
          _class = CdkHandlerFrameworkClass.buildCdkSingletonFunction(this, props);
          break;
        }
        case ComponentType.CDK_CUSTOM_RESOURCE_PROVIDER: {
          _class = CdkHandlerFrameworkClass.buildCdkCustomResourceProvider(this, props);
          break;
        }
      }

      for (const [construct, module] of Object.entries(_class.constructs)) {
        if (!this.constructs.has(construct)) {
          this.constructs.set(construct, module);
        }
      }
    }
  }

  /**
   * Render built framework into an output file.
   */
  public render(outputFileLocation: string) {
    fs.outputFileSync(`${outputFileLocation}.generated.ts`, this.renderer.render(this));
  }
}

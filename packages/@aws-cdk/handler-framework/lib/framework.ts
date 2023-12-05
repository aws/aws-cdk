import * as path from 'path';
import { Module, TypeScriptRenderer } from '@cdklabs/typewriter';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
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
   * Runtimes that are compatible with the source code.
   */
  readonly compatibleRuntimes: Runtime[];

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

export class CdkHandlerFramework {
  /**
   * Generate framework using component definitions.
   */
  public static generate(outputFileLocation: string, components: ComponentDefinition[]) {
    const module = new Module('cdk-handler-framework');

    for (let component of components) {
      const props: CdkHandlerClassProps = {
        codeDirectory: component.codeDirectory,
        className: component.name,
        entrypoint: component.entrypoint,
      };

      switch (component.type) {
        case ComponentType.CDK_FUNCTION: {
          CdkHandlerFrameworkClass.buildCdkFunction(module, props);
          break;
        }
        case ComponentType.CDK_SINGLETON_FUNCTION: {
          CdkHandlerFrameworkClass.buildCdkSingletonFunction(module, props);
          break;
        }
        case ComponentType.CDK_CUSTOM_RESOURCE_PROVIDER: {
          CdkHandlerFrameworkClass.buildCdkCustomResourceProvider(module, props);
          break;
        }
      }
    }

    fs.outputFileSync(
      `${path.join(__dirname, outputFileLocation)}/index.generated.ts`,
      CdkHandlerFramework.renderer.render(module),
    );
  }

  private static readonly renderer = new TypeScriptRenderer();

  private constructor() {}
}

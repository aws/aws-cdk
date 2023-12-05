import { Module, TypeScriptRenderer } from '@cdklabs/typewriter';
import * as fs from 'fs-extra';
import { CdkHandlerFrameworkClass, CdkHandlerClassProps } from './classes';

/**
 * Initialization properties for generating `CdkHandlerFramework` components.
 */
export interface CdkHandlerFrameworkProps extends CdkHandlerClassProps {
  /**
   * The location to render the output file to.
   */
  readonly outputFileLocation: string;
}

export class CdkHandlerFramework {
  /**
   * Generates a CdkFunction class and renders it to a specified output file location.
   */
  public static generateCdkFunction(props: CdkHandlerFrameworkProps) {
    const module = new Module('cdk-function');
    CdkHandlerFrameworkClass.buildCdkFunction(module, props);
    fs.outputFileSync(`${props.outputFileLocation}/index.generated.ts`, CdkHandlerFramework.renderer.render(module));
  }

  /**
   * Generates a CdkSingletonFunction class and renders it to a specified output file location.
   */
  public static generateCdkSingletonFunction(props: CdkHandlerFrameworkProps) {
    const module = new Module('cdk-singleton-function');
    CdkHandlerFrameworkClass.buildCdkSingletonFunction(module, props);
    fs.outputFileSync(`${props.outputFileLocation}/index.generated.ts`, CdkHandlerFramework.renderer.render(module));
  }

  /**
   * Generates a CdkCustomResourceProvider class and renders it to a specified output file location.
   */
  public static generateCdkCustomResourceProvider(props: CdkHandlerFrameworkProps) {
    const module = new Module('cdk-custom-resource-provider');
    CdkHandlerFrameworkClass.buildCdkCustomResourceProvider(module, props);
    fs.outputFileSync(`${props.outputFileLocation}/index.generated.ts`, CdkHandlerFramework.renderer.render(module));
  }

  private static readonly renderer = new TypeScriptRenderer();

  private constructor() {}
}

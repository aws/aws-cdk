import { Module, TypeScriptRenderer } from '@cdklabs/typewriter';
import * as fs from 'fs-extra';
import { CdkHandlerFrameworkClass, CdkHandlerClassProps } from './classes';

export interface CdkHandlerFrameworkProps extends CdkHandlerClassProps {
  readonly outfileLocation: string;
}

export class CdkHandlerFramework {
  /**
   * Generates a CdkFunction class.
   */
  public static generateCdkFunction(props: CdkHandlerFrameworkProps) {
    const module = new Module('cdk-function');
    CdkHandlerFrameworkClass.buildCdkFunction(module, props);
    fs.outputFileSync(`${props.outfileLocation}/index.ts`, CdkHandlerFramework.renderer.render(module));
  }

  /**
   * Generates a CdkSingletonFunction class.
   */
  public static generateCdkSingletonFunction(props: CdkHandlerFrameworkProps) {
    const module = new Module('cdk-singleton-function');
    CdkHandlerFrameworkClass.buildCdkSingletonFunction(module, props);
    fs.outputFileSync(`${props.outfileLocation}/index.ts`, CdkHandlerFramework.renderer.render(module));
  }

  /**
   * Generates a CdkCustomResourceProvider class.
   */
  public static generateCdkCustomResourceProvider(props: CdkHandlerFrameworkProps) {
    const module = new Module('cdk-custom-resource-provider');
    CdkHandlerFrameworkClass.buildCdkCustomResourceProvider(module, props);
    fs.outputFileSync(`${props.outfileLocation}/index.ts`, CdkHandlerFramework.renderer.render(module));
  }

  private static readonly renderer = new TypeScriptRenderer();

  private constructor() {}
}

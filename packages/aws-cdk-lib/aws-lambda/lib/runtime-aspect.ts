import { IConstruct } from 'constructs';
import { IFunction } from './function-base';
import { Runtime } from './runtime';
import { CfnResource, IAspect } from '../../core';

/**
 * Options used to configure a RuntimeAspect.
 */
export interface RuntimeAspectOptions {
  /**
   * Lambda functions that should be excluded by the RuntimeAspect
   *
   * @default - the RuntimeAspect will include all Lambda functions with a node runtime.
   */
  readonly functionsToIgnore?: IFunction[];
}

/**
 * A class used to create a RuntimeAspect.
 */
export abstract class RuntimeAspect implements IAspect {
  /**
   * Updates all Lambda node runtimes with 'nodejs20.x'.
   */
  public static nodeJs20(options: RuntimeAspectOptions = {}): RuntimeAspect {
    return new (class extends RuntimeAspect {
      protected readonly runtimeFamily = 'nodejs';
      public constructor() {
        super(Runtime.NODEJS_20_X.toString(), options);
        if (!this.runtimeName.includes(this.runtimeFamily)) {
          throw new Error('NodeRuntimeAspect is only configurable with node runtimes');
        }
      }
    })();
  }

  protected abstract readonly runtimeFamily: string;
  private readonly runtimeName: string;
  private readonly functionPathsToIgnore: string[];

  protected constructor(runtimeName: string, options: RuntimeAspectOptions = {}) {
    this.runtimeName = runtimeName;
    this.functionPathsToIgnore = this.generateFunctionPathsToIgnore(options.functionsToIgnore ?? []);
  }

  public visit(node: IConstruct) {
    if (this.functionPathsToIgnore.includes(node.node.path)) {
      return;
    }

    // override runtimes for CfnResource of type AWS::Lambda::Function
    if (CfnResource.isCfnResource(node) && node.cfnResourceType === 'AWS::Lambda::Function') {
      const runtime = this.getRuntimeProperty(node);
      if (this.isRuntimeFamily(runtime)) {
        node.addPropertyOverride('Runtime', this.runtimeName);
      }
    }
  }

  private generateFunctionPathsToIgnore(functionsToIgnore: IFunction[]) {
    const functionPathsToIgnore = [];
    for (const functionToIgnore of functionsToIgnore) {
      functionPathsToIgnore.push(`${functionToIgnore.node.path}/Resource`);
    }
    return functionPathsToIgnore;
  }

  private isRuntimeFamily(runtime?: string) {
    // this shouldn't happen, but in case it does throw an error
    if (runtime === undefined) {
      throw new Error('No runtime was configured for the visited node');
    }
    return runtime.includes(this.runtimeFamily);
  }

  private getRuntimeProperty(node: CfnResource) {
    return (node.getResourceProperty('runtime') || node.getResourceProperty('Runtime')) as string;
  }
}

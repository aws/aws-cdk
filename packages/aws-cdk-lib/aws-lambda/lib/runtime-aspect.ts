import { IConstruct } from 'constructs';
import { Function } from './function';
import { CfnFunction } from './lambda.generated';
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
  readonly functionsToIgnore?: Function[];
}

/**
 * A class used to walk the construct tree and update all Lambda node runtimes.
 */
export class NodeRuntimeAspect implements IAspect {
  /**
   * Walks the construct tree and updates all node runtimes with 'nodejs20.x'.
   */
  public static nodeJs20(options: RuntimeAspectOptions = {}) {
    return NodeRuntimeAspect.of(Runtime.NODEJS_20_X.toString(), options);
  }

  /**
   * Use any node runtime version.
   */
  public static of(runtimeName: string, options: RuntimeAspectOptions = {}) {
    if (!runtimeName.includes('nodejs')) {
      throw new Error('You must only use node runtimes');
    }
    return new NodeRuntimeAspect(runtimeName, options);
  }

  private readonly runtimeName: string;
  private readonly functionPathsToIgnore: string[];

  private constructor(runtimeName: string, options: RuntimeAspectOptions = {}) {
    this.runtimeName = runtimeName;
    this.functionPathsToIgnore = this.generateFunctionPathsToIgnore(options.functionsToIgnore ?? []);
  }

  public visit(node: IConstruct) {
    if (this.functionPathsToIgnore.includes(node.node.path)) {
      return;
    }

    // override runtimes for Function and SingletonFunction
    if (node instanceof CfnFunction && this.isNodeRuntimeFamily(node.runtime)) {
      node.runtime = this.runtimeName;
      return;
    }

    // override runtimes for CfnResource of type AWS::Lambda::Function
    if (CfnResource.isCfnResource(node) && node.cfnResourceType === 'AWS::Lambda::Function') {
      const runtime = node.getResourceProperty('Runtime') as string;
      if (this.isNodeRuntimeFamily(runtime)) {
        node.addPropertyOverride('Runtime', this.runtimeName);
      }
      return;
    }
  }

  private generateFunctionPathsToIgnore(functionsToIgnore: Function[]) {
    const functionPathsToIgnore = [];
    for (const functionToIgnore of functionsToIgnore) {
      functionPathsToIgnore.push(`${functionToIgnore.node.path}/Resource`);
    }
    return functionPathsToIgnore;
  }

  private isNodeRuntimeFamily(runtime?: string) {
    // this shouldn't happen, but in case it does throw an error
    if (runtime === undefined) {
      throw new Error('No runtime was configured for the visited node');
    }
    return runtime.includes('nodejs');
  }
}

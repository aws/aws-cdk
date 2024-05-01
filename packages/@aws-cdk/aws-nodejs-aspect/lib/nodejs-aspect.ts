/* eslint-disable brace-style */
import { Construct, IConstruct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { IAspect } from 'aws-cdk-lib/core';
import { AwsCustomResource, Provider } from 'aws-cdk-lib/custom-resources';
import { ReceiptRuleSet } from 'aws-cdk-lib/aws-ses';

/**
 * Runtime aspect
 */
abstract class RuntimeAspectsBase implements IAspect {

  /**
   * The string key for the runtime
   */
  public readonly targetRuntime: string;

  constructor(runtime: string) {
    this.targetRuntime = runtime;
  }

  public visit(construct: IConstruct): void {

    //To handle custom providers
    if (construct instanceof cdk.CustomResourceProviderBase) {
      this.handleCustomResourceProvider(construct);
    }
    //To handle providers
    else if (construct instanceof Provider) {
      this.handleProvider(construct);
    }

    //To handle single Function case
    else if (construct instanceof ReceiptRuleSet) {
      this.handleReceiptRuleSet(construct);
    }

    //To handle AwsCustomResource
    else if (construct instanceof AwsCustomResource) {
      this.handleAwsCustomResource(construct);
    }

  }
  private handleAwsCustomResource(resource: cdk.custom_resources.AwsCustomResource) {
    const providerNode = resource.node.findChild('Provider') as lambda.SingletonFunction;
    const functionNode = providerNode.stack.node.children.find((child) => child instanceof lambda.Function);
    const targetNode = functionNode?.node.children.find((child) => child instanceof lambda.CfnFunction) as lambda.CfnFunction;
    targetNode.runtime = this.targetRuntime;
  }

  private handleCustomResourceProvider(provider: cdk.CustomResourceProviderBase): void {
    const node = provider as cdk.CustomResourceProviderBase;
    // only replace for nodejs case
    if (this.isValidRuntime(node.runtime)) {
      const targetnode = this.getChildFunctionNode(node);
      targetnode.addPropertyOverride('Runtime', this.targetRuntime);
    }
  }

  private handleProvider(provider: Provider): void {
    const functionNodes = provider.node.children.filter((child) => child instanceof lambda.Function);
    for ( var node of functionNodes) {
      const targetNode = this.getChildFunctionNode(node);
      if (this.isValidRuntime(this.getRuntimeProperty(targetNode))) {
        targetNode.addPropertyOverride('Runtime', this.targetRuntime);
      }

      // onEvent Handlers
      const onEventHandler = provider.onEventHandler as lambda.Function;
      const onEventHandlerRuntime = this.getChildFunctionNode(onEventHandler);
      if (this.isValidRuntime(this.getRuntimeProperty(targetNode))) {
        onEventHandlerRuntime.addPropertyOverride('Runtime', this.targetRuntime);
      }

      //isComplete Handlers
      // Handlers
      const isCompleteHandler = provider.isCompleteHandler as lambda.Function;
      const isCompleteHandlerRuntime = this.getChildFunctionNode(isCompleteHandler);
      if (this.isValidRuntime(this.getRuntimeProperty(targetNode))) {
        isCompleteHandlerRuntime.addPropertyOverride('Runtime', 'nodejs20.x');
      }
    }
  }

  private handleReceiptRuleSet(ruleSet: ReceiptRuleSet): void {
    const functionnode = ruleSet.node.findChild('DropSpam');
    const ses = functionnode.node.findChild('Function') as lambda.CfnFunction;
    if (ses.runtime && this.isValidRuntime(ses.runtime)) {
      ses.addPropertyOverride('Runtime', 'nodejs20.x');
    }
  }

  /**
 *Runtime Validation
 *
 */
  private isValidRuntime(runtime: string) {
    const family = this.getRuntimeFamily(runtime);
    return family === lambda.RuntimeFamily.NODEJS;
  }

  private getRuntimeProperty(node: cdk.CfnResource) {
    return (node.getResourceProperty('runtime') || node.getResourceProperty('Runtime')) as string;
  }

  private getChildFunctionNode(node: Construct) : cdk.CfnResource {
    const childNode = node.node.children.find((child) => cdk.CfnResource.isCfnResource(child) && child.cfnResourceType === 'AWS::Lambda::Function') as cdk.CfnResource;
    return childNode;
  }

  private getRuntimeFamily(runtime: string) {
    switch (runtime) {
      case 'nodejs18.x':
        return lambda.Runtime.NODEJS_18_X.family;
      default:
        return 'Unsupported';
    }
  }

}

/**
 * RuntimeAspect
 */
export class RuntimeAspect extends RuntimeAspectsBase {
  constructor(key: string) {
    super(key);
  }
}

export class NodeJsAspect {
  public static modifyRuntimeTo(key: lambda.Runtime) {
    return new RuntimeAspect(key.name);
  }
}


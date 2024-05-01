/* eslint-disable brace-style */
import { Construct, IConstruct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { IAspect } from 'aws-cdk-lib/core';
import { AwsCustomResource, Provider } from 'aws-cdk-lib/custom-resources';
import { ReceiptRuleSet } from 'aws-cdk-lib/aws-ses';

/**
 * Runtime aspect base class to walk through a given construct tree and modify runtime to the provided input value.
 */
abstract class RuntimeAspectBase implements IAspect {

  /**
   * The runtime that the aspect will target for updates while walking the construct tree.
   */
  private readonly targetRuntime: string;

  constructor(runtime: string) {
    this.targetRuntime = runtime;
  }

  /**
   * Below visit method changes runtime value of custom resource lambda functions.
   * For more details on how aspects work https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.Aspects.html
   */

  public visit(construct: IConstruct): void {

    //To handle custom providers
    if (construct instanceof cdk.CustomResourceProviderBase) {
      this.handleCustomResourceProvider(construct);
    }
    //To handle providers
    else if (construct instanceof Provider) {
      this.handleProvider(construct);
    }

    //To handle SES custom resource lambda
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
    // Validates before modifying whether the runtime belongs to nodejs family
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

      // onEvent Handler
      const onEventHandler = provider.onEventHandler as lambda.Function;
      const onEventHandlerRuntime = this.getChildFunctionNode(onEventHandler);
      if (this.isValidRuntime(this.getRuntimeProperty(targetNode))) {
        onEventHandlerRuntime.addPropertyOverride('Runtime', this.targetRuntime);
      }

      //isComplete Handler
      const isCompleteHandler = provider.isCompleteHandler as lambda.Function;
      const isCompleteHandlerRuntime = this.getChildFunctionNode(isCompleteHandler);
      if (this.isValidRuntime(this.getRuntimeProperty(targetNode))) {
        isCompleteHandlerRuntime.addPropertyOverride('Runtime', this.targetRuntime);
      }
    }
  }

  private handleReceiptRuleSet(ruleSet: ReceiptRuleSet): void {
    const functionnode = ruleSet.node.findChild('DropSpam');
    const ses = functionnode.node.findChild('Function') as lambda.CfnFunction;
    if (ses.runtime && this.isValidRuntime(ses.runtime)) {
      ses.addPropertyOverride('Runtime', this.targetRuntime);
    }
  }

  /**
  * Validates whether runtime belongs to correct familty i.e. NodeJS
  */
  private isValidRuntime(runtime: string) {
    const family = this.getRuntimeFamily(runtime);
    return family === lambda.RuntimeFamily.NODEJS;
  }

  /**
   * @param node
   * @returns Runtime name of a given node.
   */
  private getRuntimeProperty(node: cdk.CfnResource) {
    return (node.getResourceProperty('runtime') || node.getResourceProperty('Runtime')) as string;
  }

  /**
   *
   * @param node
   * @returns Child lambda function node
   */

  private getChildFunctionNode(node: Construct) : cdk.CfnResource {
    const childNode = node.node.children.find((child) => cdk.CfnResource.isCfnResource(child) && child.cfnResourceType === 'AWS::Lambda::Function') as cdk.CfnResource;
    return childNode;
  }

  /**
   *
   * @param runtime
   * @returns Runtime family for a given input runtime name eg. nodejs18.x
   */
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
 * RuntimeAspect class to Update lambda Runtime for a given construct tree, currently supports only nodejs20.x
 */
export class RuntimeAspect extends RuntimeAspectBase {

  /**
   * Updates lambda Runtime value to nodejs20.x
   */
  public static nodejs20() {
    return new RuntimeAspect(lambda.Runtime.NODEJS_20_X.name);
  }

  constructor(runtime: string) {
    super(runtime);
  }
}


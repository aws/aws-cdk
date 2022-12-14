import { Stack } from '@aws-cdk/core';
import { Construct, IConstruct, Node } from 'constructs';
import { IApiCall } from '../api-call-base';
import { EqualsAssertion } from '../assertions';
import { ActualResult, ExpectedResult } from '../common';
import { md5hash } from '../private/hash';
import { AwsApiCall, LambdaInvokeFunction, LambdaInvokeFunctionProps } from '../sdk';
import { IDeployAssert } from '../types';


const DEPLOY_ASSERT_SYMBOL = Symbol.for('@aws-cdk/integ-tests.DeployAssert');

/**
 * Options for DeployAssert
 */
export interface DeployAssertProps {

  /**
   * A stack to use for assertions
   *
   * @default - a stack is created for you
   */
  readonly stack?: Stack
}

/**
 * Construct that allows for registering a list of assertions
 * that should be performed on a construct
 */
export class DeployAssert extends Construct implements IDeployAssert {

  /**
   * Returns whether the construct is a DeployAssert construct
   */
  public static isDeployAssert(x: any): x is DeployAssert {
    return x !== null && typeof (x) === 'object' && DEPLOY_ASSERT_SYMBOL in x;
  }

  /**
   * Finds a DeployAssert construct in the given scope
   */
  public static of(construct: IConstruct): DeployAssert {
    const scopes = Node.of(Node.of(construct).root).findAll();
    const deployAssert = scopes.find(s => DeployAssert.isDeployAssert(s));
    if (!deployAssert) {
      throw new Error('No DeployAssert construct found in scopes');
    }
    return deployAssert as DeployAssert;
  }

  public scope: Stack;

  constructor(scope: Construct, props?: DeployAssertProps) {
    super(scope, 'Default');

    this.scope = props?.stack ?? new Stack(scope, 'DeployAssert');

    Object.defineProperty(this, DEPLOY_ASSERT_SYMBOL, { value: true });
  }

  public awsApiCall(service: string, api: string, parameters?: any, outputPaths?: string[]): IApiCall {
    return new AwsApiCall(this.scope, `AwsApiCall${service}${api}`, {
      api,
      service,
      parameters,
      outputPaths,
    });
  }

  public invokeFunction(props: LambdaInvokeFunctionProps): IApiCall {
    const hash = md5hash(this.scope.resolve(props));
    return new LambdaInvokeFunction(this.scope, `LambdaInvoke${hash}`, props);
  }

  public expect(id: string, expected: ExpectedResult, actual: ActualResult): void {
    new EqualsAssertion(this.scope, `EqualsAssertion${id}`, {
      expected,
      actual,
    });
  }
}

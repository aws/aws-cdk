import { Stack, Token } from 'aws-cdk-lib/core';
import { Construct, IConstruct, Node } from 'constructs';
import { IApiCall } from '../api-call-base';
import { EqualsAssertion } from '../assertions';
import { ActualResult, ExpectedResult } from '../common';
import { HttpApiCall as HttpApiCall } from '../http-call';
import { md5hash } from '../private/hash';
import { FetchOptions } from '../providers';
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
  private assertionIdCounts = new Map<string, number>();

  constructor(scope: Construct, props?: DeployAssertProps) {
    super(scope, 'Default');

    this.scope = props?.stack ?? new Stack(scope, 'DeployAssert');

    Object.defineProperty(this, DEPLOY_ASSERT_SYMBOL, { value: true });
  }

  public awsApiCall(service: string, api: string, parameters?: any, outputPaths?: string[]): IApiCall {
    let hash = '';
    try {
      hash = md5hash(this.scope.resolve(parameters));
    } catch {}

    return new AwsApiCall(this.scope, this.uniqueAssertionId(`AwsApiCall${service}${api}${hash}`), {
      api,
      service,
      parameters,
      outputPaths,
    });
  }

  public httpApiCall(url: string, options?: FetchOptions): IApiCall {
    let hash = '';
    try {
      hash = md5hash(this.scope.resolve({
        url,
        options,
      }));
    } catch {}

    let append = '';
    if (!Token.isUnresolved(url)) {
      const parsedUrl = new URL(url);
      append = `${parsedUrl.hostname}${parsedUrl.pathname}`;
    }
    return new HttpApiCall(this.scope, this.uniqueAssertionId(`HttpApiCall${append}${hash}`), {
      url,
      fetchOptions: options,
    });
  }

  public invokeFunction(props: LambdaInvokeFunctionProps): IApiCall {
    const hash = md5hash(this.scope.resolve(props));
    return new LambdaInvokeFunction(this.scope, this.uniqueAssertionId(`LambdaInvoke${hash}`), props);
  }

  public expect(id: string, expected: ExpectedResult, actual: ActualResult): void {
    new EqualsAssertion(this.scope, `EqualsAssertion${id}`, {
      expected,
      actual,
    });
  }

  /**
   * Gets a unique logical id based on a proposed assertion id.
   */
  private uniqueAssertionId(id: string): string {
    const count = this.assertionIdCounts.get(id);

    if (count === undefined) {
      // If we've never seen this id before, we'll return the id unchanged
      // to maintain backward compatibility.
      this.assertionIdCounts.set(id, 1);
      return id;
    }

    // Otherwise, we'll increment the counter and return a unique id.
    this.assertionIdCounts.set(id, count + 1);
    return `${id}${count}`;
  }
}

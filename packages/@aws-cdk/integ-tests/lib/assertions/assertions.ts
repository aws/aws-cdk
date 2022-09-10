import { CustomResource, CfnOutput } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { ExpectedResult, ActualResult } from './common';
import { md5hash } from './private/hash';
import { AssertionRequest, AssertionsProvider, ASSERT_RESOURCE_TYPE } from './providers';

/**
 * Options for an EqualsAssertion
 */
export interface EqualsAssertionProps {
  /**
   * The actual results to compare
   */
  readonly actual: ActualResult;

  /**
   * The expected result to assert
   */
  readonly expected: ExpectedResult;

  /**
   * Set this to true if a failed assertion should
   * result in a CloudFormation deployment failure
   *
   * This is only necessary if assertions are being
   * executed outside of `integ-runner`.
   *
   * @default false
   */
  readonly failDeployment?: boolean;
}

/**
 * Construct that creates a CustomResource to assert that two
 * values are equal
 */
export class EqualsAssertion extends Construct {
  /**
   * The result of the assertion
   */
  public readonly result: string;

  constructor(scope: Construct, id: string, props: EqualsAssertionProps) {
    super(scope, id);

    const assertionProvider = new AssertionsProvider(this, 'AssertionProvider');
    const properties: AssertionRequest = {
      actual: props.actual.result,
      expected: props.expected.result,
      failDeployment: props.failDeployment,
    };
    const resource = new CustomResource(this, 'Default', {
      serviceToken: assertionProvider.serviceToken,
      properties: {
        ...properties,
        salt: Date.now().toString(), // always update,
      },
      resourceType: ASSERT_RESOURCE_TYPE,
    });
    this.result = resource.getAttString('data');

    new CfnOutput(this, 'AssertionResults', {
      value: this.result,
    }).overrideLogicalId(`AssertionResults${id}${md5hash({ actual: props.actual.result, expected: props.expected.result })}`);
  }
}

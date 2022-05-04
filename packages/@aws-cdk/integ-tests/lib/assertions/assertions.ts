import { CustomResource, CfnOutput } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { ExpectedResult, ActualResult } from './common';
import { AssertionRequest, AssertionsProvider, ASSERT_RESOURCE_TYPE } from './providers';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct as CoreConstruct } from '@aws-cdk/core';


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
}

/**
 * Construct that creates a CustomResource to assert that two
 * values are equal
 */
export class EqualsAssertion extends CoreConstruct {
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
    }).overrideLogicalId(`AssertionResults${id}`);
  }
}

import { CustomResource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IAssertion } from './deploy-assert';
import { AssertionRequest, AssertionsProvider, ASSERT_RESOURCE_TYPE, AssertionType } from './providers';
//
// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct as CoreConstruct } from '@aws-cdk/core';

/**
 * Options for an EqualsAssertion
 */
export interface EqualsAssertionProps {
  /**
   * The CustomResource that continains the "actual" results
   */
  readonly inputResource: CustomResource;

  /**
   * The CustomResource attribute that continains the "actual" results
   */
  readonly inputResourceAtt: string;

  /**
   * The expected result to assert
   */
  readonly expected: any;
}

/**
 * Construct that creates a CustomResource to assert that two
 * values are equal
 */
export class EqualsAssertion extends CoreConstruct implements IAssertion {
  public readonly result: string;

  constructor(scope: Construct, id: string, props: EqualsAssertionProps) {
    super(scope, id);

    const assertionProvider = new AssertionsProvider(this, 'AssertionProvider');
    const properties: AssertionRequest = {
      actual: props.inputResource.getAttString(props.inputResourceAtt),
      expected: props.expected,
      assertionType: AssertionType.EQUALS,
    };
    const resource = new CustomResource(this, 'Default', {
      serviceToken: assertionProvider.serviceToken,
      properties,
      resourceType: ASSERT_RESOURCE_TYPE,
    });
    this.result = resource.getAttString('data');
  }
}

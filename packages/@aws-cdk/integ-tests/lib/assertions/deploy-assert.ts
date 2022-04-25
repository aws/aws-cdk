import { CfnOutput, CustomResource, Lazy } from '@aws-cdk/core';
import { Construct, IConstruct, Node } from 'constructs';
import { md5hash } from './private/hash';
import { RESULTS_RESOURCE_TYPE, AssertionsProvider } from './providers';
import { SdkQuery, SdkQueryOptions } from './sdk';

const DEPLOY_ASSERT_SYMBOL = Symbol.for('@aws-cdk/integ-tests.DeployAssert');

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct as CoreConstruct } from '@aws-cdk/core';

/**
 * Represents a deploy time assertion
 */
export interface IAssertion {
  /**
   * The result of the assertion
   */
  readonly result: string;
}

/**
 * Options for DeployAssert
 */
export interface DeployAssertProps { }

/**
 * Construct that allows for registering a list of assertions
 * that should be performed on a construct
 */
export class DeployAssert extends CoreConstruct {

  /**
   * Returns whether the construct is a DeployAssert construct
   */
  public static isDeployAssert(x: any): x is DeployAssert {
    return x !== null && typeof(x) === 'object' && DEPLOY_ASSERT_SYMBOL in x;
  }

  /**
   * Finds a DeployAssert construct in the given scope
   */
  public static of(construct: IConstruct): DeployAssert {
    const scopes = Node.of(construct).scopes.reverse();
    const deployAssert = scopes.find(s => DeployAssert.isDeployAssert(s));
    if (!deployAssert) {
      throw new Error('No DeployAssert construct found in scopes');
    }
    return deployAssert as DeployAssert;
  }

  /** @internal */
  public readonly _assertions: IAssertion[];

  constructor(scope: Construct) {
    super(scope, 'DeployAssert');

    Object.defineProperty(this, DEPLOY_ASSERT_SYMBOL, { value: true });
    this._assertions = [];

    const provider = new AssertionsProvider(this, 'ResultsProvider');

    const resource = new CustomResource(this, 'ResultsCollection', {
      serviceToken: provider.serviceToken,
      properties: {
        assertionResults: Lazy.list({
          produce: () => this._assertions.map(a => a.result),
        }),
      },
      resourceType: RESULTS_RESOURCE_TYPE,
    });

    // TODO: need to show/store this information
    new CfnOutput(this, 'Results', {
      value: `\n${resource.getAttString('message')}`,
    }).overrideLogicalId('Results');
  }

  /**
   * Query AWS using JavaScript SDK V2 API calls
   */
  public queryAws(options: SdkQueryOptions): SdkQuery {
    const id = md5hash(options);
    return new SdkQuery(this, `SdkQuery${id}`, options);
  }

  /**
   * Register an assertion that should be run as part of the
   * deployment
   */
  public registerAssertion(assertion: IAssertion) {
    this._assertions.push(assertion);
  }
}

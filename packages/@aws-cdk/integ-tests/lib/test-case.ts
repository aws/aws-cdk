import { IntegManifest, Manifest, TestCase, TestOptions } from '@aws-cdk/cloud-assembly-schema';
import { attachCustomSynthesis, Stack, ISynthesisSession, StackProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IDeployAssert } from './assertions';
import { DeployAssert } from './assertions/private/deploy-assert';
import { IntegManifestSynthesizer } from './manifest-synthesizer';

const TEST_CASE_STACK_SYMBOL = Symbol.for('@aws-cdk/integ-tests.IntegTestCaseStack');

/**
 * Properties of an integration test case
 */
export interface IntegTestCaseProps extends TestOptions {
  /**
   * Stacks to be deployed during the test
   */
  readonly stacks: Stack[];
}

/**
 * An integration test case. Allows the definition of test properties that
 * apply to all stacks under this case.
 *
 * It is recommended that you use the IntegTest construct since that will create
 * a default IntegTestCase
 */
export class IntegTestCase extends Construct {
  /**
   * Make assertions on resources in this test case
   */
  public readonly assertions: IDeployAssert;

  private readonly _assert: DeployAssert;

  constructor(scope: Construct, id: string, private readonly props: IntegTestCaseProps) {
    super(scope, id);

    this._assert = new DeployAssert(this);
    this.assertions = this._assert;
  }

  /**
   * The integration test manifest for this test case. Manifests are used
   * by the integration test runner.
   */
  get manifest(): IntegManifest {
    return {
      version: Manifest.version(),
      testCases: { [this.node.path]: this.toTestCase(this.props) },
    };
  }

  private toTestCase(props: IntegTestCaseProps): TestCase {
    return {
      ...props,
      assertionStack: this._assert.scope.artifactId,
      stacks: props.stacks.map(s => s.artifactId),
    };
  }
}

/**
 * Properties of an integration test case stack
 */
export interface IntegTestCaseStackProps extends TestOptions, StackProps {}

/**
 * An integration test case stack. Allows the definition of test properties
 * that should apply to this stack.
 *
 * This should be used if there are multiple stacks in the integration test
 * and it is necessary to specify different test case option for each. Otherwise
 * normal stacks should be added to IntegTest
 */
export class IntegTestCaseStack extends Stack {
  /**
   * Returns whether the construct is a IntegTestCaseStack
   */
  public static isIntegTestCaseStack(x: any): x is IntegTestCaseStack {
    return x !== null && typeof(x) === 'object' && TEST_CASE_STACK_SYMBOL in x;
  }

  /**
   * Make assertions on resources in this test case
   */
  public readonly assertions: IDeployAssert;

  /**
   * The underlying IntegTestCase that is created
   * @internal
   */
  public readonly _testCase: IntegTestCase;

  constructor(scope: Construct, id: string, props?: IntegTestCaseStackProps) {
    super(scope, id, props);

    Object.defineProperty(this, TEST_CASE_STACK_SYMBOL, { value: true });

    // TODO: should we only have a single DeployAssert per test?
    this.assertions = new DeployAssert(this);
    this._testCase = new IntegTestCase(this, `${id}TestCase`, {
      ...props,
      stacks: [this],
    });
  }

}

/**
 * Integration test properties
 */
export interface IntegTestProps extends TestOptions {
  /**
   * List of test cases that make up this test
   */
  readonly testCases: Stack[];
}

/**
 * A collection of test cases. Each test case file should contain exactly one
 * instance of this class.
 */
export class IntegTest extends Construct {
  /**
   * Make assertions on resources in this test case
   */
  public readonly assertions: IDeployAssert;
  private readonly testCases: IntegTestCase[];
  constructor(scope: Construct, id: string, props: IntegTestProps) {
    super(scope, id);

    const defaultTestCase = new IntegTestCase(this, 'DefaultTest', {
      stacks: props.testCases.filter(stack => !IntegTestCaseStack.isIntegTestCaseStack(stack)),
      hooks: props.hooks,
      regions: props.regions,
      diffAssets: props.diffAssets,
      allowDestroy: props.allowDestroy,
      cdkCommandOptions: props.cdkCommandOptions,
      stackUpdateWorkflow: props.stackUpdateWorkflow,
    });
    this.assertions = defaultTestCase.assertions;

    this.testCases = [
      defaultTestCase,
      ...props.testCases
        .filter(stack => IntegTestCaseStack.isIntegTestCaseStack(stack))
        .map(stack => (stack as IntegTestCaseStack)._testCase),
    ];

    this.node.addValidation({
      validate: () => {
        attachCustomSynthesis(this, {
          onSynthesize: (session: ISynthesisSession) => {
            const synthesizer = new IntegManifestSynthesizer(this.testCases);
            synthesizer.synthesize(session);
          },
        });
        return [];
      },
    });
  }
}

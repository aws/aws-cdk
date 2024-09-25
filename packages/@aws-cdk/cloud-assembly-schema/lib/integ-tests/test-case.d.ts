import { DeployOptions, DestroyOptions } from './commands';
/**
 * The set of options to control the workflow of the test runner
 */
export interface TestOptions {
    /**
     * Run update workflow on this test case
     * This should only be set to false to test scenarios
     * that are not possible to test as part of the update workflow
     *
     * @default true
     */
    readonly stackUpdateWorkflow?: boolean;
    /**
      * Additional options to use for each CDK command
      *
      * @default - runner default options
      */
    readonly cdkCommandOptions?: CdkCommands;
    /**
      * Additional commands to run at predefined points in the test workflow
      *
      * e.g. { postDeploy: ['yarn', 'test'] }
      *
      * @default - no hooks
      */
    readonly hooks?: Hooks;
    /**
      * Whether or not to include asset hashes in the diff
      * Asset hashes can introduces a lot of unneccessary noise into tests,
      * but there are some cases where asset hashes _should_ be included. For example
      * any tests involving custom resources or bundling
      *
      * @default false
      */
    readonly diffAssets?: boolean;
    /**
      * List of CloudFormation resource types in this stack that can
      * be destroyed as part of an update without failing the test.
      *
      * This list should only include resources that for this specific
      * integration test we are sure will not cause errors or an outage if
      * destroyed. For example, maybe we know that a new resource will be created
      * first before the old resource is destroyed which prevents any outage.
      *
      * e.g. ['AWS::IAM::Role']
      *
      * @default - do not allow destruction of any resources on update
      */
    readonly allowDestroy?: string[];
    /**
      * Limit deployment to these regions
      *
      * @default - can run in any region
      */
    readonly regions?: string[];
}
/**
 * Represents an integration test case
 */
export interface TestCase extends TestOptions {
    /**
     * Stacks that should be tested as part of this test case
     * The stackNames will be passed as args to the cdk commands
     * so dependent stacks will be automatically deployed unless
     * `exclusively` is passed
     */
    readonly stacks: string[];
    /**
     * The node id of the stack that contains assertions.
     * This is the value that can be used to deploy the stack with the CDK CLI
     *
     * @default - no assertion stack
     */
    readonly assertionStack?: string;
    /**
     * The name of the stack that contains assertions
     *
     * @default - no assertion stack
     */
    readonly assertionStackName?: string;
}
/**
 * Commands to run at predefined points during the
 * integration test workflow
 */
export interface Hooks {
    /**
     * Commands to run prior to deploying the cdk stacks
     * in the integration test
     *
     * @default - no commands
     */
    readonly preDeploy?: string[];
    /**
     * Commands to run prior after deploying the cdk stacks
     * in the integration test
     *
     * @default - no commands
     */
    readonly postDeploy?: string[];
    /**
     * Commands to run prior to destroying the cdk stacks
     * in the integration test
     *
     * @default - no commands
     */
    readonly preDestroy?: string[];
    /**
     * Commands to run after destroying the cdk stacks
     * in the integration test
     *
     * @default - no commands
     */
    readonly postDestroy?: string[];
}
/**
 * Represents a cdk command
 * i.e. `synth`, `deploy`, & `destroy`
 */
export interface CdkCommand {
    /**
     * Whether or not to run this command as part of the workflow
     * This can be used if you only want to test some of the workflow
     * for example enable `synth` and disable `deploy` & `destroy` in order
     * to limit the test to synthesis
     *
     * @default true
     */
    readonly enabled?: boolean;
    /**
     * If the runner should expect this command to fail
     *
     * @default false
     */
    readonly expectError?: boolean;
    /**
     * This can be used in combination with `expectedError`
     * to validate that a specific message is returned.
     *
     * @default - do not validate message
     */
    readonly expectedMessage?: string;
}
/**
 * Represents a cdk deploy command
 */
export interface DeployCommand extends CdkCommand {
    /**
     * Additional arguments to pass to the command
     * This can be used to test specific CLI functionality
     *
     * @default - only default args are used
     */
    readonly args?: DeployOptions;
}
/**
 * Represents a cdk destroy command
 */
export interface DestroyCommand extends CdkCommand {
    /**
     * Additional arguments to pass to the command
     * This can be used to test specific CLI functionality
     *
     * @default - only default args are used
     */
    readonly args?: DestroyOptions;
}
/**
 * Options for specific cdk commands that are run
 * as part of the integration test workflow
 */
export interface CdkCommands {
    /**
     * Options to for the cdk deploy command
     *
     * @default - default deploy options
     */
    readonly deploy?: DeployCommand;
    /**
     * Options to for the cdk destroy command
     *
     * @default - default destroy options
     */
    readonly destroy?: DestroyCommand;
}

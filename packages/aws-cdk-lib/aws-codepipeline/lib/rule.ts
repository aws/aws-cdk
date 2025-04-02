import { CfnPipeline } from './codepipeline.generated';
import * as iam from '../../aws-iam';
import { validateRuleName } from './private/validation';

/**
 * Properties for defining a CodePipeline Rule
 */
export interface RuleProps {
  /**
   * The shell commands to run with your commands rule in CodePipeline.
   *
   * All commands are supported except multi-line formats. While CodeBuild logs and permissions are used,
   * you do not need to create any resources in CodeBuild.
   *
   * @remarks Using compute time for this action will incur separate charges in AWS CodeBuild.
   * @default - No commands
   */
  readonly commands?: string[];

  /**
   * The action configuration fields for the rule.
   * This can include custom parameters specific to the rule type.
   *
   * @default - No configuration
   */
  readonly configuration?: object;

  /**
   * The input artifacts fields for the rule, such as specifying an input file for the rule.
   * Each string in the array represents an artifact name that this rule will use as input.
   *
   * @default - No input artifacts
   */
  readonly inputArtifacts?: string[];

  /**
   * The name of the rule that is created for the condition.
   * Must be unique within the pipeline.
   *
   * @example 'VariableCheck'
   * @default - A unique name will be generated
   */
  readonly name?: string;

  /**
   * The AWS Region for the condition associated with the rule.
   * If not specified, uses the pipeline's region.
   *
   * @default - Pipeline's region
   */
  readonly region?: string;

  /**
   * The IAM role that the rule will use to execute its actions.
   * The role must have sufficient permissions to perform the rule's tasks.
   *
   * @default - A new role will be created
   */
  readonly role?: iam.Role;

  /**
   * The rule provider that implements the rule's functionality.
   *
   * @example 'DeploymentWindow'
   * @see AWS CodePipeline rule reference for available providers
   * @default - No provider, must be specified if rule is used
   */
  readonly provider?: string;

  /**
   * The version of the rule to use.
   * Different versions may have different features or behaviors.
   *
   * @default '1'
   */
  readonly version?: string;
}

/**
 * Represents a rule in AWS CodePipeline that can be used to add conditions
 * and controls to pipeline execution.
 */
export class Rule {
  /**
   * The name of the rule, if specified in the properties
   */
  public readonly ruleName?: string;

  private readonly _props: RuleProps;

  /**
   * Creates a new Rule instance.
   * @param props - Configuration properties for the rule
   * @throws {Error} If the rule name is invalid
   */
  constructor(props: RuleProps) {
    this.ruleName = props.name;
    this._props = props;

    this.validate();
  }

  /**
   * Validates the rule configuration
   * @private
   * @throws {Error} If validation fails
   */
  private validate() {
    validateRuleName(this.ruleName);
  }

  /**
   * Returns a reference to the rule that can be used in pipeline stage conditions
   * @returns A string in the format "#{rule.ruleName}" that can be used to reference this rule
   */
  public reference(): string {
    return `#{rule.${this.ruleName}}`;
  }

  /**
   * Renders the rule configuration into a CloudFormation property
   * @internal
   * @returns The rule declaration property for CloudFormation
   */
  public _render(): CfnPipeline.RuleDeclarationProperty {
    return {
      name: this.ruleName,
      region: this._props.region,
      roleArn: this._props.role?.roleArn,
      configuration: this._props.configuration,
      inputArtifacts: this._props.inputArtifacts?.map((artifact) => ({
        name: artifact,
      })),
      commands: this._props.commands,
      ruleTypeId: {
        provider: this._props.provider,
        version: this._props.version,
        category: 'Rule',
        owner: 'AWS',
      },
    };
  }
}

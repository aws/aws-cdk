import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { Artifact } from './artifact';
import validation = require('./validation');

export enum ActionCategory {
  Source = 'Source',
  Build = 'Build',
  Test = 'Test',
  Approval = 'Approval',
  Deploy = 'Deploy',
  Invoke = 'Invoke'
}

/**
 * Specifies the constraints on the number of input and output
 * artifacts an action can have.
 *
 * The constraints for each action type are documented on the
 * {@link https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html Pipeline Structure Reference} page.
 */
export interface ActionArtifactBounds {
  readonly minInputs: number;
  readonly maxInputs: number;
  readonly minOutputs: number;
  readonly maxOutputs: number;
}

export function defaultBounds(): ActionArtifactBounds {
  return {
    minInputs: 0,
    maxInputs: 5,
    minOutputs: 0,
    maxOutputs: 5
  };
}

/**
 * The API of Stage used internally by the CodePipeline Construct.
 * You should never need to call any of the methods inside of it yourself.
 */
export interface IInternalStage {
  /**
   * Adds an Action to this Stage.
   *
   * @param action the Action to add to this Stage
   */
  _attachAction(action: Action): void;

  /**
   * Generates a unique output artifact name for the given Action.
   *
   * @param action the Action to generate the output artifact name for
   */
  _generateOutputArtifactName(action: Action): string;

  /**
   * Finds an input artifact for the given Action.
   * The chosen artifact will be the output artifact of the
   * last Action in the Pipeline
   * (up to the Stage this Action belongs to)
   * with the highest runOrder that has an output artifact.
   *
   * @param action the Action to find the input artifact for
   */
  _findInputArtifact(action: Action): Artifact;
}

/**
 * The abstract view of an AWS CodePipeline as required and used by Actions.
 * It extends {@link events.IEventRuleTarget},
 * so this interface can be used as a Target for CloudWatch Events.
 */
export interface IPipeline extends events.IEventRuleTarget {
  /**
   * The ARN of the Pipeline.
   */
  readonly pipelineArn: string;

  /**
   * The unique ID of the Pipeline Construct.
   */
  readonly uniqueId: string;

  /**
   * The service Role of the Pipeline.
   */
  readonly role: iam.Role;

  /* Grants read permissions to the Pipeline's S3 Bucket to the given Identity.
   *
   * @param identity the IAM Identity to grant the permissions to
   */
  grantBucketRead(identity?: iam.IPrincipal): void;

  /**
   * Grants read & write permissions to the Pipeline's S3 Bucket to the given Identity.
   *
   * @param identity the IAM Identity to grant the permissions to
   */
  grantBucketReadWrite(identity?: iam.IPrincipal): void;
}

/**
 * The abstract interface of a Pipeline Stage that is used by Actions.
 */
export interface IStage {
  /**
   * The physical, human-readable name of this Pipeline Stage.
   */
  readonly name: string;

  /**
   * The Pipeline this Stage belongs to.
   */
  readonly pipeline: IPipeline;

  /**
   * The API of Stage used internally by the CodePipeline Construct.
   * You should never need to call any of the methods inside of it yourself.
   */
  readonly _internal: IInternalStage;
}

/**
 * Common properties shared by all Actions.
 */
export interface CommonActionProps {
  /**
   * The runOrder property for this Action.
   * RunOrder determines the relative order in which multiple Actions in the same Stage execute.
   *
   * @default 1
   * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html
   */
  runOrder?: number;
}

/**
 * Common properties shared by all Action Constructs.
 */
export interface CommonActionConstructProps {
  /**
   * The Pipeline Stage to add this Action to.
   */
  stage: IStage;
}

/**
 * Construction properties of the low-level {@link Action Action class}.
 */
export interface ActionProps extends CommonActionProps, CommonActionConstructProps {
  category: ActionCategory;
  provider: string;
  artifactBounds: ActionArtifactBounds;
  configuration?: any;
  version?: string;
  owner?: string;
}

/**
 * Low-level class for generic CodePipeline Actions.
 * It is recommended that concrete types are used instead, such as {@link codecommit.PipelineSourceAction} or
 * {@link codebuild.PipelineBuildAction}.
 */
export abstract class Action extends cdk.Construct {
  /**
   * The category of the action.
   * The category defines which action type the owner
   * (the entity that performs the action) performs.
   */
  public readonly category: ActionCategory;

  /**
   * The service provider that the action calls.
   */
  public readonly provider: string;

  /**
   * The action's configuration. These are key-value pairs that specify input values for an action.
   * For more information, see the AWS CodePipeline User Guide.
   *
   * http://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#action-requirements
   */
  public readonly configuration?: any;

  /**
   * The order in which AWS CodePipeline runs this action.
   * For more information, see the AWS CodePipeline User Guide.
   *
   * https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#action-requirements
   */
  public readonly runOrder: number;

  public readonly owner: string;
  public readonly version: string;

  private readonly inputArtifacts = new Array<Artifact>();
  private readonly outputArtifacts = new Array<Artifact>();
  private readonly artifactBounds: ActionArtifactBounds;
  private readonly stage: IStage;

  constructor(parent: cdk.Construct, id: string, props: ActionProps) {
    super(parent, id);

    validation.validateName('Action', id);

    this.owner = props.owner || 'AWS';
    this.version = props.version || '1';
    this.category = props.category;
    this.provider = props.provider;
    this.configuration = props.configuration;
    this.artifactBounds = props.artifactBounds;
    this.runOrder = props.runOrder === undefined ? 1 : props.runOrder;
    this.stage = props.stage;

    this.stage._internal._attachAction(this);
  }

  public validate(): string[] {
    return validation.validateArtifactBounds('input', this.inputArtifacts, this.artifactBounds.minInputs,
        this.artifactBounds.maxInputs, this.category, this.provider)
      .concat(validation.validateArtifactBounds('output', this.outputArtifacts, this.artifactBounds.minOutputs,
        this.artifactBounds.maxOutputs, this.category, this.provider)
    );
  }

  public onStateChange(name: string, target?: events.IEventRuleTarget, options?: events.EventRuleProps) {
    const rule = new events.EventRule(this.parent!!, name, options);
    rule.addTarget(target);
    rule.addEventPattern({
      detailType: [ 'CodePipeline Stage Execution State Change' ],
      source: [ 'aws.codepipeline' ],
      resources: [ this.stage.pipeline.pipelineArn ],
      detail: {
        stage: [ this.stage.name ],
        action: [ this.id ],
      },
    });
    return rule;
  }

  public get _inputArtifacts(): Artifact[] {
    return this.inputArtifacts.slice();
  }

  public get _outputArtifacts(): Artifact[] {
    return this.outputArtifacts.slice();
  }

  protected addOutputArtifact(name: string = this.stage._internal._generateOutputArtifactName(this)): Artifact {
    const artifact = new Artifact(this, name);
    this.outputArtifacts.push(artifact);
    return artifact;
  }

  protected addInputArtifact(artifact: Artifact = this.stage._internal._findInputArtifact(this)): Action {
    this.inputArtifacts.push(artifact);
    return this;
  }
}

// export class ElasticBeanstalkDeploy extends DeployAction {
//   constructor(parent: Stage, name: string, applicationName: string, environmentName: string) {
//     super(parent, name, 'ElasticBeanstalk', { minInputs: 1, maxInputs: 1, minOutputs: 0, maxOutputs: 0 }, {
//       ApplicationName: applicationName,
//       EnvironmentName: environmentName
//     });
//   }
// }

// export class OpsWorksDeploy extends DeployAction {
//   constructor(parent: Stage, name: string, app: string, stack: string, layer?: string) {
//     super(parent, name, 'OpsWorks', { minInputs: 1, maxInputs: 1, minOutputs: 0, maxOutputs: 0 }, {
//       Stack: stack,
//       App: app,
//       Layer: layer,
//     });
//   }
// }

// export class ECSDeploy extends DeployAction {
//   constructor(parent: Stage, name: string, clusterName: string, serviceName: string, fileName?: string) {
//     super(parent, name, 'ECS', { minInputs: 1, maxInputs: 1, minOutputs: 0, maxOutputs: 0 }, {
//       ClusterName: clusterName,
//       ServiceName: serviceName,
//       FileName: fileName,
//     });
//   }
// }

/*
  TODO: A Jenkins build needs a corresponding custom action for each "Jenkins provider".
    This should be created automatically.

  Example custom action created to execute Jenkins:
  {
  "id": {
    "category": "Test",
    "provider": "<provider name>",
    "owner": "Custom",
    "version": "1"
  },
  "outputArtifactDetails": {
    "minimumCount": 0,
    "maximumCount": 5
  },
  "settings": {
    "executionUrlTemplate": "https://www.google.com/job/{Config:ProjectName}/{ExternalExecutionId}",
    "entityUrlTemplate": "https://www.google.com/job/{Config:ProjectName}"
  },
  "actionConfigurationProperties": [
    {
      "queryable": true,
      "key": true,
      "name": "ProjectName",
      "required": true,
      "secret": false
    }
  ],
  "inputArtifactDetails": {
    "minimumCount": 0,
    "maximumCount": 5
  }
  }
*/

// export class JenkinsBuild extends BuildAction {
//   constructor(parent: Stage, name: string, jenkinsProvider: string, project: string) {
//     super(parent, name, jenkinsProvider, DefaultBounds(), {
//       ProjectName: project
//     });
//   }
// }

// export class JenkinsTest extends TestAction {
//   constructor(parent: Stage, name: string, jenkinsProvider: string, project: string) {
//     super(parent, name, jenkinsProvider, DefaultBounds(), {
//       ProjectName: project
//     });
//   }
// }

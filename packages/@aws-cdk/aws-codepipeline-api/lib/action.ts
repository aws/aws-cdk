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
 * The abstract interface of a Pipeline Stage that is used by Actions.
 */
export interface IStage {
  /**
   * The physical, human-readable name of this Pipeline Stage.
   */
  readonly name: string;

  /**
   * The ARN of the Pipeline.
   */
  readonly pipelineArn: string;

  /**
   * The service Role of the Pipeline.
   */
  readonly pipelineRole: iam.Role;

  /**
   * Grants read & write permissions to the Pipeline's S3 Bucket to the given Identity.
   *
   * @param identity the IAM Identity to grant the permissions to
   */
  grantPipelineBucketReadWrite(identity: iam.IPrincipal): void;

  /**
   * Adds an Action to this Stage.
   * This is an internal operation -
   * an Action is added to a Stage when it's constructed,
   * so there's no need to call this method explicitly.
   *
   * @param action the Action to add to this Stage
   */
  _attachAction(action: Action): void;
}

/**
 * Common properties shared by all Actions.
 */
export interface CommonActionProps {
  /**
   * The Pipeline Stage to add this Action to.
   */
  stage: IStage;
}

/**
 * Construction properties of the low-level {@link Action Action class}.
 */
export interface ActionProps extends CommonActionProps {
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
  public runOrder: number;

  public readonly owner: string;
  public readonly version: string;

  private readonly _inputArtifacts = new Array<Artifact>();
  private readonly _outputArtifacts = new Array<Artifact>();
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
    this.runOrder = 1;
    this.stage = props.stage;

    this.stage._attachAction(this);
  }

  public validate(): string[] {
    return validation.validateArtifactBounds('input', this._inputArtifacts, this.artifactBounds.minInputs,
        this.artifactBounds.maxInputs, this.category, this.provider)
      .concat(validation.validateArtifactBounds('output', this._outputArtifacts, this.artifactBounds.minOutputs,
        this.artifactBounds.maxOutputs, this.category, this.provider)
    );
  }

  public onStateChange(name: string, target?: events.IEventRuleTarget, options?: events.EventRuleProps) {
    const rule = new events.EventRule(this.parent!!, name, options);
    rule.addTarget(target);
    rule.addEventPattern({
      detailType: [ 'CodePipeline Stage Execution State Change' ],
      source: [ 'aws.codepipeline' ],
      resources: [ this.stage.pipelineArn ],
      detail: {
        stage: [ this.stage.name ],
        action: [ this.id ],
      },
    });
    return rule;
  }

  public get inputArtifacts(): Artifact[] {
    return this._inputArtifacts.slice();
  }

  public get outputArtifacts(): Artifact[] {
    return this._outputArtifacts.slice();
  }

  protected addChild(child: cdk.Construct, name: string) {
    super.addChild(child, name);
    if (child instanceof Artifact) {
      this._outputArtifacts.push(child);
    }
  }

  protected addOutputArtifact(name: string): Artifact {
    const artifact = new Artifact(this, name);
    return artifact;
  }

  protected addInputArtifact(artifact: Artifact): Action {
    this._inputArtifacts.push(artifact);
    return this;
  }
}

// export class TestAction extends Action {
//   constructor(parent: Stage, name: string, provider: string, artifactBounds: ActionArtifactBounds, configuration?: any) {
//     super(parent, name, {
//       category: ActionCategory.Test,
//       provider,
//       artifactBounds,
//       configuration
//     });
//   }
// }

// export class CodeBuildTest extends TestAction {
//   constructor(parent: Stage, name: string, project: codebuild.ProjectArnAttribute) {
//     super(parent, name, 'CodeBuild', { minInputs: 1, maxInputs: 1, minOutputs: 0, maxOutputs: 1 }, {
//       ProjectName: project
//     });
//   }
// }

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

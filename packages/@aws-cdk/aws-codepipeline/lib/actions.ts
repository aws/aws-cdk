import events = require('@aws-cdk/aws-events');
import lambda = require('@aws-cdk/aws-lambda');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import { Artifact } from './artifact';
import { cloudformation } from './codepipeline.generated';
import { Stage } from './stage';
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
    minInputs: number;
    maxInputs: number;
    minOutputs: number;
    maxOutputs: number;
}

function defaultBounds(): ActionArtifactBounds {
    return {
        minInputs: 0,
        maxInputs: 5,
        minOutputs: 0,
        maxOutputs: 5
    };
}

/**
 * Construction properties of the low level {@link Action action type}.
 */
export interface ActionProps {
    /**
     * A category that defines which action type the owner (the entity that performs the action) performs.
     * The category that you select determine the providers that you can specify for the {@link #provider} property.
     */
    category: ActionCategory;

    /**
     * The service provider that the action calls. The providers that you can specify are determined by
     * the category that you select. For example, a valid provider for the Deploy category is AWS CodeDeploy,
     * which you would specify as CodeDeploy.
     */
    provider: string;

    /**
     * The constraints to apply to the number of input and output artifacts used by this action.
     */
    artifactBounds: ActionArtifactBounds;

    /**
     * The action's configuration. These are key-value pairs that specify input values for an action.
     * For more information, see the AWS CodePipeline User Guide.
     *
     * http://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#action-requirements
     */
    configuration?: any;

    /**
     * For all currently supported action types, the only valid version string is "1".
     *
     * @default 1
     */
    version?: string;

    /**
     * For all currently supported action types, the only valid owner string is
     * "AWS", "ThirdParty", or "Custom". For more information, see the AWS
     * CodePipeline API Reference.
     *
     * @default 'AWS'
     */
    owner?: string;
}

/**
 * Low level class for generically creating pipeline actions.
 * It is recommended that concrete types are used instead, such as {@link codecommit.PipelineSource} or
 * {@link codebuild.PipelineBuildAction}.
 */
export abstract class Action extends cdk.Construct {
    /**
     * The category of the action. The category defines which action type the owner (the entity that performs the action) performs.
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

    private readonly artifactBounds: ActionArtifactBounds;
    private readonly inputArtifacts = new Array<Artifact>();
    private readonly outputArtifacts = new Array<Artifact>();
    private readonly owner: string;
    private readonly version: string;
    private readonly stage: Stage;

    constructor(parent: Stage, name: string, props: ActionProps) {
        super(parent, name);

        validation.validateName('Action', name);

        this.owner = props.owner || 'AWS';
        this.version = props.version || '1';
        this.category = props.category;
        this.provider = props.provider;
        this.configuration = props.configuration;
        this.artifactBounds = props.artifactBounds;
        this.runOrder = 1;
        this.stage = parent;
    }

    public validate(): string[] {
        return validation.validateArtifactBounds('input', this.inputArtifacts, this.artifactBounds.minInputs,
                this.artifactBounds.maxInputs, this.category, this.provider)
            .concat(validation.validateArtifactBounds('output', this.outputArtifacts, this.artifactBounds.minOutputs,
                this.artifactBounds.maxOutputs, this.category, this.provider)
        );
    }

    /**
     * Render the Action to a CloudFormation struct
     */
    public render(): cloudformation.PipelineResource.ActionDeclarationProperty {
        return {
            name: this.name,
            inputArtifacts: this.inputArtifacts.map(a => ({ name: a.name })),
            actionTypeId: {
                category: this.category.toString(),
                version: this.version,
                owner: this.owner,
                provider: this.provider,
            },
            configuration: this.configuration,
            outputArtifacts: this.outputArtifacts.map(a => ({ name: a.name })),
            runOrder: this.runOrder
        };
    }

    public onStateChange(name: string, target?: events.IEventRuleTarget, options?: events.EventRuleProps) {
        const rule = new events.EventRule(this.stage.pipeline, name, options);
        rule.addTarget(target);
        rule.addEventPattern({
            detailType: [ 'CodePipeline Stage Execution State Change' ],
            source: [ 'aws.codepipeline' ],
            resources: [ this.stage.pipeline.pipelineArn ],
            detail: {
                stage: [ this.stage.name ],
                action: [ this.name ],
            },
        });
        return rule;
    }

    /**
     * If an Artifact is added as a child, add it to the list of output artifacts.
     */
    protected addChild(child: cdk.Construct, name: string) {
        super.addChild(child, name);
        if (child instanceof Artifact) {
            this.outputArtifacts.push(child);
        }
    }

    protected addOutputArtifact(name: string): Artifact {
        const artifact = new Artifact(this, name);
        return artifact;
    }

    protected addInputArtifact(artifact: Artifact): Action {
        this.inputArtifacts.push(artifact);
        return this;
    }
}

/**
 * Construction properties of the low level {@link Source source action}
 */
export interface SourceProps {
    /**
     * The source action owner (could e "AWS", "ThirdParty" or "Custom")
     *
     * @default AWS
     */
    owner?: string;

    /**
     * The source action verison.
     *
     * @default "1"
     */
    version?: string;

    /**
     * The name of the source's output artifact. Output artifacts are used by CodePipeline as
     * inputs into other actions.
     */
    artifactName: string;

    /**
     * The service provider that the action calls. For example, a valid provider for Source actions is S3.
     */
    provider: string;

    /**
     * The action's configuration. These are key-value pairs that specify input values for an action.
     * For more information, see the AWS CodePipeline User Guide.
     *
     * http://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#action-requirements
     */
    configuration?: any;
}

/**
 * Low level class for source actions.
 * It is recommended that concrete types are used instead, such as {@link AmazonS3Source} or
 * {@link codecommit.PipelineSource}.
 */
export abstract class Source extends Action {
    public readonly artifact: Artifact;

    constructor(parent: Stage, name: string, props: SourceProps) {
        super(parent, name, {
            category: ActionCategory.Source,
            owner: props.owner,
            provider: props.provider,
            version: props.version,
            artifactBounds: { minInputs: 0, maxInputs: 0, minOutputs: 1, maxOutputs: 1 },
            configuration: props.configuration
        });

        this.artifact = this.addOutputArtifact(props.artifactName);
    }
}

/**
 * Construction properties of the {@link AmazonS3Source S3 source action}
 */
export interface AmazonS3SourceProps {
    /**
     * The name of the source's output artifact. Output artifacts are used by CodePipeline as
     * inputs into other actions.
     */
    artifactName: string;

    /**
     * The Amazon S3 bucket that stores the source code
     */
    bucket: s3.BucketRef;

    /**
     * The key within the S3 bucket that stores the source code
     */
    bucketKey: string;

    // TODO: use CloudWatch events instead
    /**
     * Whether or not AWS CodePipeline should poll for source changes
     *
     * @default true
     */
    pollForSourceChanges?: boolean;
}

/**
 * Source that is provided by a specific Amazon S3 object
 */
export class AmazonS3Source extends Source {
    constructor(parent: Stage, name: string, props: AmazonS3SourceProps) {
        super(parent, name, {
            provider: 'S3',
            configuration: {
                S3Bucket: props.bucket.bucketName,
                S3ObjectKey: props.bucketKey,
                PollForSourceChanges: props.pollForSourceChanges || true
            },
            artifactName: props.artifactName
        });

        // pipeline needs permissions to read from the S3 bucket
        props.bucket.grantRead(parent.pipeline.role);
    }
}

/**
 * Construction properties of the {@link GitHubSource GitHub source action}
 */
export interface GithubSourceProps {
    /**
     * The name of the source's output artifact. Output artifacts are used by CodePipeline as
     * inputs into other actions.
     */
    artifactName: string;

    /**
     * The GitHub account/user that owns the repo.
     */
    owner: string;

    /**
     * The name of the repo, without the username.
     */
    repo: string;

    /**
     * The branch to use.
     *
     * @default "master"
     */
    branch?: string;

    /**
     * A GitHub OAuth token to use for authentication.
     *
     * It is recommended to use a `SecretParameter` to obtain the token from the SSM
     * Parameter Store:
     *
     *     const oauth = new SecretParameter(this, 'GitHubOAuthToken', { ssmParameter: 'my-github-token });
     *     new GitHubSource(stage, 'GH' { oauthToken: oauth });
     *
     */
    oauthToken: cdk.Secret;

    /**
     * Whether or not AWS CodePipeline should poll for source changes
     *
     * @default true
     */
    pollForSourceChanges?: boolean;
}

/**
 * Source that is provided by a GitHub repository
 */
export class GitHubSource extends Source {
    constructor(parent: Stage, name: string, props: GithubSourceProps) {
        super(parent, name, {
            owner: 'ThirdParty',
            provider: 'GitHub',
            configuration: {
                Owner: props.owner,
                Repo: props.repo,
                Branch: props.branch || "master",
                OAuthToken: props.oauthToken,
                PollForSourceChanges: props.pollForSourceChanges || true
            },
            artifactName: props.artifactName
        });
    }
}

/**
 * Construction properties of the low level {@link BuildAction build action}
 */
export interface BuildActionProps {
    /**
     * The source to use as input for this build
     */
    inputArtifact: Artifact;

    /**
     * The service provider that the action calls. For example, a valid provider for Source actions is CodeBuild.
     */
    provider: string;

    /**
     * The name of the build's output artifact
     */
    artifactName?: string;

    /**
     * The action's configuration. These are key-value pairs that specify input values for an action.
     * For more information, see the AWS CodePipeline User Guide.
     *
     * http://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#action-requirements
     */
    configuration?: any;
}

/**
 * Low level class for build actions.
 * It is recommended that concrete types are used instead, such as {@link codebuild.PipelineBuildAction}.
 */
export abstract class BuildAction extends Action {
    public readonly artifact?: Artifact;

    constructor(parent: Stage, name: string, props: BuildActionProps) {
        super(parent, name, {
            artifactBounds: { minInputs: 1, maxInputs: 1, minOutputs: 0, maxOutputs: 1 },
            category: ActionCategory.Build,
            provider: props.provider,
            configuration: props.configuration
        });

        this.addInputArtifact(props.inputArtifact);
        if (props.artifactName) {
            this.artifact = this.addOutputArtifact(props.artifactName);
        }
    }
}

/**
 * Manual approval action
 */
export class ApprovalAction extends Action {
    constructor(parent: Stage, name: string) {
        super(parent, name, {
            category: ActionCategory.Approval,
            provider: 'Manual',
            artifactBounds: { minInputs: 0, maxInputs: 0, minOutputs: 0, maxOutputs: 0 }
        });
    }
}

export interface InvokeLambdaProps {
    /**
     * The lambda function to invoke.
     */
    lambda: lambda.LambdaRef;

    /**
     * String to be used in the event data parameter passed to the Lambda
     * function
     *
     * See an example JSON event in the CodePipeline documentation.
     *
     * https://docs.aws.amazon.com/codepipeline/latest/userguide/actions-invoke-lambda-function.html#actions-invoke-lambda-function-json-event-example
     */
    userParameters?: any;

    /**
     * Adds the "codepipeline:PutJobSuccessResult" and
     * "codepipeline:PutJobFailureResult" for '*' resource to the Lambda
     * execution role policy.
     *
     * NOTE: the reason we can't add the specific pipeline ARN as a resource is
     * to avoid a cyclic dependency between the pipeline and the Lambda function
     * (the pipeline references) the Lambda and the Lambda needs permissions on
     * the pipeline.
     *
     * @see
     * https://docs.aws.amazon.com/codepipeline/latest/userguide/actions-invoke-lambda-function.html#actions-invoke-lambda-function-create-function
     *
     * @default true
     */
    addPutJobResultPolicy?: boolean;
}
/**
 * @link https://docs.aws.amazon.com/codepipeline/latest/userguide/actions-invoke-lambda-function.html
 */
export class InvokeLambdaAction extends Action {
    constructor(parent: Stage, name: string, props: InvokeLambdaProps) {
        super(parent, name, {
            category: ActionCategory.Invoke,
            provider: 'Lambda',
            artifactBounds: defaultBounds(),
            configuration: {
                FunctionName: props.lambda.functionName,
                UserParameters: props.userParameters
            }
        });

        // allow pipeline to list functions
        parent.pipeline.addToRolePolicy(new cdk.PolicyStatement()
            .addAction('lambda:ListFunctions')
            .addResource('*'));

        // allow pipeline to invoke this lambda functionn
        parent.pipeline.addToRolePolicy(new cdk.PolicyStatement()
            .addAction('lambda:InvokeFunction')
            .addResource(props.lambda.functionArn));

        // allow lambda to put job results for this pipeline.
        const addToPolicy = props.addPutJobResultPolicy !== undefined ? props.addPutJobResultPolicy : true;
        if (addToPolicy) {
            props.lambda.addToRolePolicy(new cdk.PolicyStatement()
                .addResource('*') // to avoid cycles (see docs)
                .addAction('codepipeline:PutJobSuccessResult')
                .addAction('codepipeline:PutJobFailureResult'));
        }
    }

    /**
     * Add an input artifact
     * @param artifact
     */
    public addInputArtifact(artifact: Artifact): InvokeLambdaAction {
        super.addInputArtifact(artifact);
        return this;
    }
}

// export class TestAction extends Action {
//     constructor(parent: Stage, name: string, provider: string, artifactBounds: ActionArtifactBounds, configuration?: any) {
//         super(parent, name, {
//           category: ActionCategory.Test,
//           provider,
//           artifactBounds,
//           configuration
//         });
//     }
// }

// export class CodeBuildTest extends TestAction {
//     constructor(parent: Stage, name: string, project: codebuild.ProjectArnAttribute) {
//         super(parent, name, 'CodeBuild', { minInputs: 1, maxInputs: 1, minOutputs: 0, maxOutputs: 1 }, {
//             ProjectName: project
//         });
//     }
// }

// export class DeployAction extends Action {
//     constructor(parent: Stage, name: string, provider: string, artifactBounds: ActionArtifactBounds, configuration?: any) {
//         super(parent, name, {
//           category: ActionCategory.Deploy,
//           provider,
//           artifactBounds,
//           configuration
//         });
//     }
// }

// export class CodeDeploy extends DeployAction {
//     constructor(parent: Stage, name: string, applicationName: string, deploymentGroupName: string) {
//         super(parent, name, 'CodeDeploy', { minInputs: 1, maxInputs: 1, minOutputs: 0, maxOutputs: 0 }, {
//             ApplicationName: applicationName,
//             DeploymentGroupName: deploymentGroupName
//         });
//     }
// }

// export class ElasticBeanstalkDeploy extends DeployAction {
//     constructor(parent: Stage, name: string, applicationName: string, environmentName: string) {
//         super(parent, name, 'ElasticBeanstalk', { minInputs: 1, maxInputs: 1, minOutputs: 0, maxOutputs: 0 }, {
//             ApplicationName: applicationName,
//             EnvironmentName: environmentName
//         });
//     }
// }

// export class OpsWorksDeploy extends DeployAction {
//     constructor(parent: Stage, name: string, app: string, stack: string, layer?: string) {
//         super(parent, name, 'OpsWorks', { minInputs: 1, maxInputs: 1, minOutputs: 0, maxOutputs: 0 }, {
//             Stack: stack,
//             App: app,
//             Layer: layer,
//         });
//     }
// }

// export class ECSDeploy extends DeployAction {
//     constructor(parent: Stage, name: string, clusterName: string, serviceName: string, fileName?: string) {
//         super(parent, name, 'ECS', { minInputs: 1, maxInputs: 1, minOutputs: 0, maxOutputs: 0 }, {
//             ClusterName: clusterName,
//             ServiceName: serviceName,
//             FileName: fileName,
//         });
//     }
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
//     constructor(parent: Stage, name: string, jenkinsProvider: string, project: string) {
//         super(parent, name, jenkinsProvider, DefaultBounds(), {
//             ProjectName: project
//         });
//     }
// }

// export class JenkinsTest extends TestAction {
//     constructor(parent: Stage, name: string, jenkinsProvider: string, project: string) {
//         super(parent, name, jenkinsProvider, DefaultBounds(), {
//             ProjectName: project
//         });
//     }
// }

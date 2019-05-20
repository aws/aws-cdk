import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import kms = require('@aws-cdk/aws-kms');
import s3 = require('@aws-cdk/aws-s3');
import { Construct, RemovalPolicy, Resource, Stack, Token } from '@aws-cdk/cdk';
import { Action, IPipeline, IStage } from "./action";
import { CfnPipeline } from './codepipeline.generated';
import { Stage } from './stage';
import { validateName, validateSourceAction } from "./validation";

/**
 * Allows you to control where to place a new Stage when it's added to the Pipeline.
 * Note that you can provide only one of the below properties -
 * specifying more than one will result in a validation error.
 *
 * @see #rightBefore
 * @see #justAfter
 * @see #atIndex
 */
export interface StagePlacement {
  /**
   * Inserts the new Stage as a parent of the given Stage
   * (changing its current parent Stage, if it had one).
   */
  readonly rightBefore?: IStage;

  /**
   * Inserts the new Stage as a child of the given Stage
   * (changing its current child Stage, if it had one).
   */
  readonly justAfter?: IStage;

  /**
   * Inserts the new Stage at the given index in the Pipeline,
   * moving the Stage currently at that index,
   * and any subsequent ones, one index down.
   * Indexing starts at 0.
   * The maximum allowed value is {@link Pipeline#stageCount},
   * which will insert the new Stage at the end of the Pipeline.
   */
  readonly atIndex?: number;
}

/**
 * Construction properties of a Pipeline Stage.
 */
export interface StageProps {
  /**
   * The physical, human-readable name to assign to this Pipeline Stage.
   */
  readonly name: string;

  /**
   * The list of Actions to create this Stage with.
   * You can always add more Actions later by calling {@link IStage#addAction}.
   */
  readonly actions?: Action[];
}

export interface StageAddToPipelineProps extends StageProps {
  readonly placement?: StagePlacement;
}

export interface PipelineProps {
  /**
   * The S3 bucket used by this Pipeline to store artifacts.
   * If not specified, a new S3 bucket will be created.
   */
  readonly artifactBucket?: s3.IBucket;

  /**
   * The IAM role to be assumed by this Pipeline.
   * If not specified, a new IAM role will be created.
   */
  readonly role?: iam.Role;

  /**
   * Indicates whether to rerun the AWS CodePipeline pipeline after you update it.
   */
  readonly restartExecutionOnUpdate?: boolean;

  /**
   * Name of the pipeline. If you don't specify a name,  AWS CloudFormation generates an ID
   * and uses that for the pipeline name.
   */
  readonly pipelineName?: string;

  /**
   * A map of region to S3 bucket name used for cross-region CodePipeline.
   * For every Action that you specify targeting a different region than the Pipeline itself,
   * if you don't provide an explicit Bucket for that region using this property,
   * the construct will automatically create a scaffold Stack containing an S3 Bucket in that region.
   * Note that you will have to `cdk deploy` that Stack before you can deploy your Pipeline-containing Stack.
   * You can query the generated Stacks using the {@link Pipeline#crossRegionScaffoldStacks} property.
   */
  readonly crossRegionReplicationBuckets?: { [region: string]: string };

  /**
   * The list of Stages, in order,
   * to create this Pipeline with.
   * You can always add more Stages later by calling {@link Pipeline#addStage}.
   */
  readonly stages?: StageProps[];
}

abstract class PipelineBase extends Resource implements IPipeline {
  public abstract pipelineName: string;
  public abstract pipelineArn: string;
  private eventsRole?: iam.Role;
  public abstract grantBucketRead(identity: iam.IGrantable): iam.Grant;
  public abstract grantBucketReadWrite(identity: iam.IGrantable): iam.Grant;

  /**
   * Allows the pipeline to be used as a CloudWatch event rule target.
   *
   * Usage:
   *
   *    const pipeline = new Pipeline(this, 'MyPipeline');
   *    const rule = new EventRule(this, 'MyRule', { schedule: 'rate(1 minute)' });
   *    rule.addTarget(pipeline);
   *
   */
  public asEventRuleTarget(_ruleArn: string, _ruleId: string): events.EventRuleTargetProps {
    // the first time the event rule target is retrieved, we define an IAM
    // role assumable by the CloudWatch events service which is allowed to
    // start the execution of this pipeline. no need to define more than one
    // role per pipeline.
    if (!this.eventsRole) {
      this.eventsRole = new iam.Role(this, 'EventsRole', {
        assumedBy: new iam.ServicePrincipal('events.amazonaws.com')
      });

      this.eventsRole.addToPolicy(new iam.PolicyStatement()
        .addResource(this.pipelineArn)
        .addAction('codepipeline:StartPipelineExecution'));
    }

    return {
      id: this.node.id,
      arn: this.pipelineArn,
      roleArn: this.eventsRole.roleArn,
    };
  }
}

/**
 * An AWS CodePipeline pipeline with its associated IAM role and S3 bucket.
 *
 * @example
 * // create a pipeline
 * const pipeline = new Pipeline(this, 'Pipeline');
 *
 * // add a stage
 * const sourceStage = pipeline.addStage({ name: 'Source' });
 *
 * // add a source action to the stage
 * sourceStage.addAction(new codepipeline_actions.CodeCommitSourceAction({
 *   actionName: 'Source',
 *   outputArtifactName: 'SourceArtifact',
 *   repository: repo,
 * }));
 *
 * // ... add more stages
 */
export class Pipeline extends PipelineBase {

  /**
   * Import a pipeline into this app.
   * @param scope the scope into which to import this pipeline
   * @param pipelineArn The ARN of the pipeline (e.g. `arn:aws:codepipeline:us-east-1:123456789012:MyDemoPipeline`)
   */
  public static fromPipelineArn(scope: Construct, id: string, pipelineArn: string): IPipeline {

    class Import extends PipelineBase {
      public pipelineName = scope.node.stack.parseArn(pipelineArn).resource;
      public pipelineArn = pipelineArn;

      public grantBucketRead(identity: iam.IGrantable): iam.Grant {
        return iam.Grant.drop(identity, `grant read permissions to the artifacts bucket of ${pipelineArn}`);
      }

      public grantBucketReadWrite(identity: iam.IGrantable): iam.Grant {
        return iam.Grant.drop(identity, `grant read/write permissions to the artifacts bucket of ${pipelineArn}`);
      }
    }

    return new Import(scope, id);
  }

  /**
   * The IAM role AWS CodePipeline will use to perform actions or assume roles for actions with
   * a more specific IAM role.
   */
  public readonly role: iam.Role;

  /**
   * ARN of this pipeline
   */
  public readonly pipelineArn: string;

  /**
   * The name of the pipeline
   */
  public readonly pipelineName: string;

  /**
   * The version of the pipeline
   *
   * @attribute
   */
  public readonly pipelineVersion: string;

  /**
   * Bucket used to store output artifacts
   */
  public readonly artifactBucket: s3.IBucket;

  private readonly stages = new Array<Stage>();
  private readonly pipelineResource: CfnPipeline;
  private readonly crossRegionReplicationBuckets: { [region: string]: string };
  private readonly artifactStores: { [region: string]: any };
  private readonly _crossRegionScaffoldStacks: { [region: string]: CrossRegionScaffoldStack } = {};

  constructor(scope: Construct, id: string, props?: PipelineProps) {
    super(scope, id);
    props = props || {};

    validateName('Pipeline', props.pipelineName);

    // If a bucket has been provided, use it - otherwise, create a bucket.
    let propsBucket = props.artifactBucket;
    if (!propsBucket) {
      const encryptionKey = new kms.Key(this, 'ArtifactsBucketEncryptionKey');
      propsBucket = new s3.Bucket(this, 'ArtifactsBucket', {
        encryptionKey,
        encryption: s3.BucketEncryption.Kms,
        removalPolicy: RemovalPolicy.Orphan
      });
    }
    this.artifactBucket = propsBucket;

    // If a role has been provided, use it - otherwise, create a role.
    this.role = props.role || new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('codepipeline.amazonaws.com')
    });

    const codePipeline = new CfnPipeline(this, 'Resource', {
      artifactStore: new Token(() => this.renderArtifactStore()) as any,
      stages: new Token(() => this.renderStages()) as any,
      roleArn: this.role.roleArn,
      restartExecutionOnUpdate: props && props.restartExecutionOnUpdate,
      name: props && props.pipelineName,
    });

    // this will produce a DependsOn for both the role and the policy resources.
    codePipeline.node.addDependency(this.role);

    this.artifactBucket.grantReadWrite(this.role);

    this.pipelineName = codePipeline.ref;
    this.pipelineVersion = codePipeline.pipelineVersion;
    this.pipelineResource = codePipeline;
    this.crossRegionReplicationBuckets = props.crossRegionReplicationBuckets || {};
    this.artifactStores = {};

    // Does not expose a Fn::GetAtt for the ARN so we'll have to make it ourselves
    this.pipelineArn = this.node.stack.formatArn({
      service: 'codepipeline',
      resource: this.pipelineName
    });

    for (const stage of props.stages || []) {
      this.addStage(stage);
    }
  }

  /**
   * Creates a new Stage, and adds it to this Pipeline.
   *
   * @param props the creation properties of the new Stage
   * @returns the newly created Stage
   */
  public addStage(props: StageAddToPipelineProps): IStage {
    // check for duplicate Stages and names
    if (this.stages.find(s => s.stageName === props.name)) {
      throw new Error(`Stage with duplicate name '${props.name}' added to the Pipeline`);
    }

    const stage = new Stage(props, this);

    const index = props.placement
        ? this.calculateInsertIndexFromPlacement(props.placement)
        : this.stageCount;

    this.stages.splice(index, 0, stage);

    return stage;
  }

  /**
   * Adds a statement to the pipeline role.
   */
  public addToRolePolicy(statement: iam.PolicyStatement) {
    this.role.addToPolicy(statement);
  }

  /**
   * Defines an event rule triggered by the "CodePipeline Pipeline Execution
   * State Change" event emitted from this pipeline.
   *
   * @param target Initial target to add to the event rule. You can also add
   * targets and customize target inputs by calling `rule.addTarget(target[,
   * options])` after the rule was created.
   *
   * @param options Additional options to pass to the event rule
   *
   * @param name The name of the event rule construct. If you wish to define
   * more than a single onStateChange event, you will need to explicitly
   * specify a name.
   */
  public onStateChange(name: string, target?: events.IEventRuleTarget, options?: events.EventRuleProps): events.EventRule {
    const rule = new events.EventRule(this, name, options);
    rule.addTarget(target);
    rule.addEventPattern({
      detailType: [ 'CodePipeline Pipeline Execution State Change' ],
      source: [ 'aws.codepipeline' ],
      resources: [ this.pipelineArn ],
    });
    return rule;
  }

  /**
   * Get the number of Stages in this Pipeline.
   */
  public get stageCount(): number {
    return this.stages.length;
  }

  public grantBucketRead(identity: iam.IGrantable): iam.Grant {
    return this.artifactBucket.grantRead(identity);
  }

  public grantBucketReadWrite(identity: iam.IGrantable): iam.Grant {
    return this.artifactBucket.grantReadWrite(identity);
  }

  /**
   * Returns all of the {@link CrossRegionScaffoldStack}s that were generated automatically
   * when dealing with Actions that reside in a different region than the Pipeline itself.
   */
  public get crossRegionScaffolding(): { [region: string]: CrossRegionScaffolding } {
    const ret: { [region: string]: CrossRegionScaffoldStack }  = {};
    Object.keys(this._crossRegionScaffoldStacks).forEach((key) => {
      ret[key] = this._crossRegionScaffoldStacks[key];
    });
    return ret;
  }

  /**
   * Validate the pipeline structure
   *
   * Validation happens according to the rules documented at
   *
   * https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#pipeline-requirements
   * @override
   */
  protected validate(): string[] {
    return [
      ...this.validateSourceActionLocations(),
      ...this.validateHasStages(),
      ...this.validateStages(),
      ...this.validateArtifacts(),
    ];
  }

  // ignore unused private method (it's actually used in Stage)
  // @ts-ignore
  private _attachActionToPipeline(stage: Stage, action: Action, actionScope: cdk.Construct): void {
    if (action.region) {
      // handle cross-region Actions here
      this.ensureReplicationBucketExistsFor(action.region);
    }
    (action as any)._actionAttachedToPipeline({
      pipeline: this,
      stage,
      scope: actionScope,
      role: this.role,
    });
  }

  private ensureReplicationBucketExistsFor(region: string) {
    // get the region the Pipeline itself is in
    const pipelineRegion = this.node.stack.requireRegion(
        "You need to specify an explicit region when using CodePipeline's cross-region support");

    // if we already have an ArtifactStore generated for this region, or it's the Pipeline's region, nothing to do
    if (this.artifactStores[region] || region === pipelineRegion) {
      return;
    }

    let replicationBucketName = this.crossRegionReplicationBuckets[region];
    if (!replicationBucketName) {
      const pipelineAccount = this.node.stack.requireAccountId(
          "You need to specify an explicit account when using CodePipeline's cross-region support");
      const app = this.node.stack.parentApp();
      if (!app) {
        throw new Error(`Pipeline stack which uses cross region actions must be part of an application`);
      }
      const crossRegionScaffoldStack = new CrossRegionScaffoldStack(this, `cross-region-stack-${pipelineAccount}:${region}`, {
        region,
        account: pipelineAccount,
      });
      this._crossRegionScaffoldStacks[region] = crossRegionScaffoldStack;
      replicationBucketName = crossRegionScaffoldStack.replicationBucketName;
    }

    const replicationBucket = s3.Bucket.fromBucketAttributes(this, 'CrossRegionCodePipelineReplicationBucket-' + region, {
      bucketName: replicationBucketName,
    });
    replicationBucket.grantReadWrite(this.role);

    this.artifactStores[region] = {
      Location: replicationBucket.bucketName,
      Type: 'S3',
    };
  }

  private calculateInsertIndexFromPlacement(placement: StagePlacement): number {
    // check if at most one placement property was provided
    const providedPlacementProps = ['rightBefore', 'justAfter', 'atIndex']
      .filter((prop) => (placement as any)[prop] !== undefined);
    if (providedPlacementProps.length > 1) {
      throw new Error("Error adding Stage to the Pipeline: " +
        'you can only provide at most one placement property, but ' +
        `'${providedPlacementProps.join(', ')}' were given`);
    }

    if (placement.rightBefore !== undefined) {
      const targetIndex = this.findStageIndex(placement.rightBefore);
      if (targetIndex === -1) {
        throw new Error("Error adding Stage to the Pipeline: " +
          `the requested Stage to add it before, '${placement.rightBefore.stageName}', was not found`);
      }
      return targetIndex;
    }

    if (placement.justAfter !== undefined) {
      const targetIndex = this.findStageIndex(placement.justAfter);
      if (targetIndex === -1) {
        throw new Error("Error adding Stage to the Pipeline: " +
          `the requested Stage to add it after, '${placement.justAfter.stageName}', was not found`);
      }
      return targetIndex + 1;
    }

    if (placement.atIndex !== undefined) {
      const index = placement.atIndex;
      if (index < 0 || index > this.stageCount) {
        throw new Error("Error adding Stage to the Pipeline: " +
          `{ placed: atIndex } should be between 0 and the number of stages in the Pipeline (${this.stageCount}), ` +
          ` got: ${index}`);
      }
      return index;
    }

    return this.stageCount;
  }

  private findStageIndex(targetStage: IStage) {
    return this.stages.findIndex(stage => stage === targetStage);
  }

  private validateSourceActionLocations(): string[] {
    const errors = new Array<string>();
    let firstStage = true;
    for (const stage of this.stages) {
      const onlySourceActionsPermitted = firstStage;
      for (const action of stage.actions) {
        errors.push(...validateSourceAction(onlySourceActionsPermitted, action.category, action.actionName, stage.stageName));
      }
      firstStage = false;
    }
    return errors;
  }

  private validateHasStages(): string[] {
    if (this.stageCount < 2) {
      return ['Pipeline must have at least two stages'];
    }
    return [];
  }

  private validateStages(): string[] {
    const ret = new Array<string>();
    for (const stage of this.stages) {
      ret.push(...stage.validate());
    }
    return ret;
  }

  private validateArtifacts(): string[] {
    const ret = new Array<string>();

    const outputArtifactNames = new Set<string>();
    for (const stage of this.stages) {
      const sortedActions = stage.actions.sort((a1, a2) => a1.runOrder - a2.runOrder);

      for (const action of sortedActions) {
        // start with inputs
        const inputArtifacts = action.inputs;
        for (const inputArtifact of inputArtifacts) {
          if (!inputArtifact.artifactName) {
            ret.push(`Action '${action.actionName}' has an unnamed input Artifact that's not used as an output`);
          } else if (!outputArtifactNames.has(inputArtifact.artifactName)) {
            ret.push(`Artifact '${inputArtifact.artifactName}' was used as input before being used as output`);
          }
        }

        // then process outputs by adding them to the Set
        const outputArtifacts = action.outputs;
        for (const outputArtifact of outputArtifacts) {
          // output Artifacts always have a name set
          if (outputArtifactNames.has(outputArtifact.artifactName!)) {
            ret.push(`Artifact '${outputArtifact.artifactName}' has been used as an output more than once`);
          } else {
            outputArtifactNames.add(outputArtifact.artifactName!);
          }
        }
      }
    }

    return ret;
  }

  private renderArtifactStore(): CfnPipeline.ArtifactStoreProperty {
    let encryptionKey: CfnPipeline.EncryptionKeyProperty | undefined;
    const bucketKey = this.artifactBucket.encryptionKey;
    if (bucketKey) {
      encryptionKey = {
        type: 'KMS',
        id: bucketKey.keyArn,
      };
    }

    const bucketName = this.artifactBucket.bucketName;
    if (!bucketName) {
      throw new Error('Artifacts bucket must have a bucket name');
    }

    return {
      type: 'S3',
      location: bucketName,
      encryptionKey
    };
  }

  private renderStages(): CfnPipeline.StageDeclarationProperty[] {
    // handle cross-region CodePipeline overrides here
    let crossRegion = false;
    this.stages.forEach((stage, i) => {
      stage.actions.forEach((action, j) => {
        if (action.region) {
          crossRegion = true;
          this.pipelineResource.addPropertyOverride(`Stages.${i}.Actions.${j}.Region`, action.region);
        }
      });
    });

    if (crossRegion) {
      // we don't need ArtifactStore in this case
      this.pipelineResource.addPropertyDeletionOverride('ArtifactStore');

      // add the Pipeline's artifact store
      const artifactStore = this.renderArtifactStore();
      this.artifactStores[this.node.stack.requireRegion()] = {
        Location: artifactStore.location,
        Type: artifactStore.type,
        EncryptionKey: artifactStore.encryptionKey,
      };

      const artifactStoresProp: any[] = [];
      // tslint:disable-next-line:forin
      for (const region in this.artifactStores) {
        artifactStoresProp.push({
          Region: region,
          ArtifactStore: this.artifactStores[region],
        });
      }
      this.pipelineResource.addPropertyOverride('ArtifactStores', artifactStoresProp);
    }

    return this.stages.map(stage => stage.render());
  }
}

/**
 * A Stack containing resources required for the cross-region CodePipeline functionality to work.
 */
export abstract class CrossRegionScaffolding extends Stack {
  /**
   * The name of the S3 Bucket used for replicating the Pipeline's artifacts into the region.
   */
  public abstract readonly replicationBucketName: string;
}

// cyclic dependency
import { CrossRegionScaffoldStack } from './cross-region-scaffold-stack';

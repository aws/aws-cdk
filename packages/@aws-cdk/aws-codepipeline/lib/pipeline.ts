import cpapi = require('@aws-cdk/aws-codepipeline-api');
import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import { CfnPipeline } from './codepipeline.generated';
import { CrossRegionScaffoldStack } from './cross-region-scaffold-stack';
import { Stage } from './stage';

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
  readonly rightBefore?: cpapi.IStage;

  /**
   * Inserts the new Stage as a child of the given Stage
   * (changing its current child Stage, if it had one).
   */
  readonly justAfter?: cpapi.IStage;

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
  name: string;

  /**
   * The list of Actions to create this Stage with.
   * You can always add more Actions later by calling {@link IStage#addAction}.
   */
  actions?: cpapi.Action[];
}

export interface StageAddToPipelineProps extends StageProps {
  placement?: StagePlacement;
}

export interface PipelineProps {
  /**
   * The S3 bucket used by this Pipeline to store artifacts.
   * If not specified, a new S3 bucket will be created.
   */
  artifactBucket?: s3.IBucket;

  /**
   * Indicates whether to rerun the AWS CodePipeline pipeline after you update it.
   */
  restartExecutionOnUpdate?: boolean;

  /**
   * Name of the pipeline. If you don't specify a name,  AWS CloudFormation generates an ID
   * and uses that for the pipeline name.
   */
  pipelineName?: string;

  /**
   * A map of region to S3 bucket name used for cross-region CodePipeline.
   * For every Action that you specify targeting a different region than the Pipeline itself,
   * if you don't provide an explicit Bucket for that region using this property,
   * the construct will automatically create a scaffold Stack containing an S3 Bucket in that region.
   * Note that you will have to `cdk deploy` that Stack before you can deploy your Pipeline-containing Stack.
   * You can query the generated Stacks using the {@link Pipeline#crossRegionScaffoldStacks} property.
   */
  crossRegionReplicationBuckets?: { [region: string]: string };

  /**
   * The list of Stages, in order,
   * to create this Pipeline with.
   * You can always add more Stages later by calling {@link Pipeline#addStage}.
   */
  stages?: StageProps[];
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
 * sourceStage.addAction(new codecommit.PipelineSourceAction({
 *   actionName: 'Source',
 *   outputArtifactName: 'SourceArtifact',
 *   repository: repo,
 * }));
 *
 * // ... add more stages
 */
export class Pipeline extends cdk.Construct implements cpapi.IPipeline {
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
   */
  public readonly pipelineVersion: string;

  /**
   * Bucket used to store output artifacts
   */
  public readonly artifactBucket: s3.IBucket;

  private readonly stages = new Array<Stage>();
  private eventsRole?: iam.Role;
  private readonly pipelineResource: CfnPipeline;
  private readonly crossRegionReplicationBuckets: { [region: string]: string };
  private readonly artifactStores: { [region: string]: any };
  private readonly _crossRegionScaffoldStacks: { [region: string]: CrossRegionScaffoldStack } = {};

  constructor(scope: cdk.Construct, id: string, props?: PipelineProps) {
    super(scope, id);
    props = props || {};

    cpapi.validateName('Pipeline', props.pipelineName);

    // If a bucket has been provided, use it - otherwise, create a bucket.
    let propsBucket = props.artifactBucket;
    if (!propsBucket) {
      propsBucket = new s3.Bucket(this, 'ArtifactsBucket', {
        removalPolicy: cdk.RemovalPolicy.Orphan
      });
    }
    this.artifactBucket = propsBucket;

    this.role = new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('codepipeline.amazonaws.com')
    });

    const codePipeline = new CfnPipeline(this, 'Resource', {
      artifactStore: new cdk.Token(() => this.renderArtifactStore()) as any,
      stages: new cdk.Token(() => this.renderStages()) as any,
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
    this.pipelineArn = cdk.Stack.find(this).formatArn({
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
  public addStage(props: StageAddToPipelineProps): cpapi.IStage {
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

  public grantBucketRead(identity?: iam.IPrincipal): void {
    this.artifactBucket.grantRead(identity);
  }

  public grantBucketReadWrite(identity?: iam.IPrincipal): void {
    this.artifactBucket.grantReadWrite(identity);
  }

  /**
   * Returns all of the {@link CrossRegionScaffoldStack}s that were generated automatically
   * when dealing with Actions that reside in a different region than the Pipeline itself.
   */
  public get crossRegionScaffoldStacks(): { [region: string]: CrossRegionScaffoldStack } {
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
      ...this.validateHasStages(),
      ...this.validateSourceActionLocations()
    ];
  }

  // ignore unused private method (it's actually used in Stage)
  // @ts-ignore
  private _attachActionToRegion(stage: Stage, action: cpapi.Action): void {
    // handle cross-region Actions here
    if (!action.region) {
      return;
    }

    // get the region the Pipeline itself is in
    const pipelineStack = cdk.Stack.find(this);
    const pipelineRegion = pipelineStack.requireRegion(
      "You need to specify an explicit region when using CodePipeline's cross-region support");

    // if we already have an ArtifactStore generated for this region, or it's the Pipeline's region, nothing to do
    if (this.artifactStores[action.region] || action.region === pipelineRegion) {
      return;
    }

    let replicationBucketName = this.crossRegionReplicationBuckets[action.region];
    if (!replicationBucketName) {
      const pipelineAccount = pipelineStack.requireAccountId(
        "You need to specify an explicit account when using CodePipeline's cross-region support");
      const app = pipelineStack.parentApp();
      if (!app) {
        throw new Error(`Pipeline stack which uses cross region actions must be part of an application`);
      }
      const crossRegionScaffoldStack = new CrossRegionScaffoldStack(app, {
        region: action.region,
        account: pipelineAccount,
      });
      this._crossRegionScaffoldStacks[action.region] = crossRegionScaffoldStack;
      replicationBucketName = crossRegionScaffoldStack.replicationBucketName;
    }

    const replicationBucket = s3.Bucket.import(this, 'CrossRegionCodePipelineReplicationBucket-' + action.region, {
      bucketName: replicationBucketName,
    });
    replicationBucket.grantReadWrite(this.role);

    this.artifactStores[action.region] = {
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

  private findStageIndex(targetStage: cpapi.IStage) {
    return this.stages.findIndex(stage => stage === targetStage);
  }

  private validateSourceActionLocations(): string[] {
    const errors = new Array<string>();
    let firstStage = true;
    for (const stage of this.stages) {
      const onlySourceActionsPermitted = firstStage;
      for (const action of stage.actions) {
        errors.push(...cpapi.validateSourceAction(onlySourceActionsPermitted, action.category, action.actionName, stage.stageName));
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
      this.artifactStores[cdk.Stack.find(this).requireRegion()] = {
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

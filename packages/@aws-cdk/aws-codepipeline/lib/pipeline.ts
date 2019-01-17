import cpapi = require('@aws-cdk/aws-codepipeline-api');
import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import { ArtifactsStore, IArtifactsStore, ImportedArtifactsStore } from './artifacts-store';
import { CfnPipeline } from './codepipeline.generated';
import { CrossRegionScaffoldStack } from './cross-region-scaffold-stack';
import { CommonStageProps, Stage, StagePlacement } from './stage';

export interface PipelineProps {
  /**
   * The artifact store used by this Pipeline to store artifacts.
   * If not specified, a new one one will be created.
   */
  artifactsStore?: IArtifactsStore;

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
   * A map of region to artifacts stores used for cross-region CodePipeline.
   * For every Action that you specify targeting a different region than the Pipeline itself,
   * if you don't provide an explicit store for that region using this property,
   * the construct will automatically create a scaffold Stack containing a store in that region.
   * Note that you will have to `cdk deploy` that Stack before you can deploy your Pipeline-containing Stack.
   * You can query the generated Stacks using the {@link Pipeline#crossRegionScaffoldStacks} property.
   */
  crossRegionArtifactsStores?: { [region: string]: ImportedArtifactsStore };
}

/**
 * An AWS CodePipeline pipeline with its associated IAM role and S3 bucket.
 *
 * @example
 * // create a pipeline
 * const pipeline = new Pipeline(this, 'Pipeline');
 *
 * // add a stage
 * const sourceStage = new Stage(pipeline, 'Source');
 *
 * // add a source action to the stage
 * new codecommit.PipelineSourceAction(sourceStage, 'Source', {
 *   artifactName: 'SourceArtifact',
 *   repository: repo,
 * });
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
  public readonly artifactsStore: IArtifactsStore;

  /**
   * Imported artifact stores used for cross-region replication.
   */
  public readonly artifactsStores: { [region: string]: ImportedArtifactsStore } = {};

  private readonly stages = new Array<Stage>();
  private eventsRole?: iam.Role;
  private readonly pipelineResource: CfnPipeline;
  private readonly _crossRegionScaffoldStacks: { [region: string]: CrossRegionScaffoldStack } = {};
  constructor(scope: cdk.Construct, id: string, props?: PipelineProps) {
    super(scope, id);
    props = props || {};

    cpapi.validateName('Pipeline', props.pipelineName);

    // If a bucket has been provided, use it - otherwise, create a bucket.
    this.artifactsStore = props.artifactsStore || new ArtifactsStore(this, 'ArtifactStore', {
      bucket: new s3.Bucket(this, 'ArtifactsBucket', {
        removalPolicy: cdk.RemovalPolicy.Orphan
      })
    });

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
    codePipeline.addDependency(this.role);

    this.artifactsStore.grantReadWrite(this.role);

    this.pipelineName = codePipeline.ref;
    this.pipelineVersion = codePipeline.pipelineVersion;
    this.pipelineResource = codePipeline;

    if (props.crossRegionArtifactsStores) {
      Object.keys(props.crossRegionArtifactsStores).forEach(region => {
        this.artifactsStores[region] = props!.crossRegionArtifactsStores![region]!;
      });
    }

    // Does not expose a Fn::GetAtt for the ARN so we'll have to make it ourselves
    this.pipelineArn = cdk.Stack.find(this).formatArn({
      service: 'codepipeline',
      resource: this.pipelineName
    });
  }

  /**
   * Convenience method for creating a new {@link Stage},
   * and adding it to this Pipeline.
   *
   * @param name the name of the newly created Stage
   * @param props the optional construction properties of the new Stage
   * @returns the newly created Stage
   */
  public addStage(name: string, props?: CommonStageProps): Stage {
    return new Stage(this, name, {
      pipeline: this,
      ...props,
    });
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
    this.artifactsStore.grantRead(identity);
  }

  public grantBucketReadWrite(identity?: iam.IPrincipal): void {
    this.artifactsStore.grantReadWrite(identity);
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

  /**
   * Adds a Stage to this Pipeline.
   * This is an internal operation -
   * a Stage is added to a Pipeline when it's constructed
   * (the Pipeline is passed through the {@link StageProps#pipeline} property),
   * so there is never a need to call this method explicitly.
   *
   * @param stage the newly created Stage to add to this Pipeline
   * @param placement an optional specification of where to place the newly added Stage in the Pipeline
   */
  // ignore unused private method (it's actually used in Stage)
  // @ts-ignore
  private _attachStage(stage: Stage, placement?: StagePlacement): void {
    // _attachStage should be idempotent, in case a customer ever calls it directly
    if (this.stages.includes(stage)) {
      return;
    }

    if (this.stages.find(x => x.name === stage.name)) {
      throw new Error(`A stage with name '${stage.name}' already exists`);
    }

    const index = placement
      ? this.calculateInsertIndexFromPlacement(placement)
      : this.stageCount;

    this.stages.splice(index, 0, stage);
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
    if (this.artifactsStores[action.region] || action.region === pipelineRegion) {
      return;
    }

    let replicationStore = this.artifactsStores[action.region];
    if (!replicationStore) {
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
      this.artifactsStores[action.region] = replicationStore =
        crossRegionScaffoldStack.buildImportedStore(this, `ArtifactsStore-${action.region}`);
    }

    replicationStore.grantReadWrite(this.role);
  }

  // ignore unused private method (it's actually used in Stage)
  // @ts-ignore
  private _generateOutputArtifactName(stage: cpapi.IStage, action: cpapi.Action): string {
    // generate the artifact name based on the Action's full logical ID,
    // thus guaranteeing uniqueness
    return 'Artifact_' + action.node.uniqueId;
  }

  /**
   * Finds an input artifact for the given Action.
   * The chosen artifact will be the output artifact of the
   * last Action in the Pipeline
   * (up to the Stage this Action belongs to),
   * with the highest runOrder, that has an output artifact.
   *
   * @param stage the Stage `action` belongs to
   * @param action the Action to find the input artifact for
   */
  // ignore unused private method (it's actually used in Stage)
  // @ts-ignore
  private _findInputArtifact(stage: cpapi.IStage, action: cpapi.Action): cpapi.Artifact {
    // search for the first Action that has an outputArtifact,
    // and return that
    const startIndex = this.stages.findIndex(s => s === stage);
    for (let i = startIndex; i >= 0; i--) {
      const currentStage = this.stages[i];

      // get all of the Actions in the Stage, sorted by runOrder, descending
      const currentActions = currentStage.actions.sort((a1, a2) => -(a1.runOrder - a2.runOrder));
      for (const currentAction of currentActions) {
        // for the first Stage (the one that `action` belongs to)
        // we need to only take into account Actions with a smaller runOrder than `action`
        if ((i !== startIndex || currentAction.runOrder < action.runOrder) && currentAction._outputArtifacts.length > 0) {
          return currentAction._outputArtifacts[0];
        }
      }
    }
    throw new Error(`Could not determine the input artifact for Action with name '${action.node.id}'. ` +
      'Please provide it explicitly with the inputArtifact property.');
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
          `the requested Stage to add it before, '${placement.rightBefore.name}', was not found`);
      }
      return targetIndex;
    }

    if (placement.justAfter !== undefined) {
      const targetIndex = this.findStageIndex(placement.justAfter);
      if (targetIndex === -1) {
        throw new Error("Error adding Stage to the Pipeline: " +
          `the requested Stage to add it after, '${placement.justAfter.name}', was not found`);
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

  private findStageIndex(targetStage: Stage) {
    return this.stages.findIndex((stage: Stage) => stage === targetStage);
  }

  private validateSourceActionLocations(): string[] {
    const errors = new Array<string>();
    let firstStage = true;
    for (const stage of this.stages) {
      const onlySourceActionsPermitted = firstStage;
      for (const action of stage.actions) {
        errors.push(...cpapi.validateSourceAction(onlySourceActionsPermitted, action.category, action.node.id, stage.node.id));
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
    const artifactStore = this.artifactsStore;

    if (artifactStore.encryptionMaterialArn) {
      encryptionKey = {
        type: 'KMS',
        id: artifactStore.encryptionMaterialArn
      };
    }

    const bucketName = artifactStore.bucket.bucketName;
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

      const artifactStoresProp: any[] = [];

      // add the Pipeline's artifact store
      artifactStoresProp.push({
        Region: cdk.Stack.find(this).requireRegion(),
        ArtifactStore: this.artifactStoreToCfn(this.artifactsStore)
      });

      // tslint:disable-next-line:forin
      for (const region in this.artifactsStores) {
        artifactStoresProp.push({
          Region: region,
          ArtifactStore: this.artifactStoreToCfn(this.artifactsStores[region])
        });
      }
      this.pipelineResource.addPropertyOverride('ArtifactStores', artifactStoresProp);
    }

    return this.stages.map(stage => stage.render());
  }

  private artifactStoreToCfn(artifactStore: IArtifactsStore) {
    return {
      Location: artifactStore.bucket.bucketName,
      Type: 'S3',
      EncryptionKey: artifactStore.encryptionMaterialArn ? {
        Type: 'KMS',
        Id: artifactStore.encryptionMaterialArn
      } : undefined
    };
  }
}

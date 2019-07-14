import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import kms = require('@aws-cdk/aws-kms');
import s3 = require('@aws-cdk/aws-s3');
import { App, Construct, Lazy, PhysicalName, RemovalPolicy, Resource, Stack, Token } from '@aws-cdk/core';
import { IAction, IPipeline, IStage } from "./action";
import { CfnPipeline } from './codepipeline.generated';
import { CrossRegionSupportStack } from './cross-region-support-stack';
import { FullActionDescriptor } from './full-action-descriptor';
import { Stage } from './stage';
import { validateName, validateSourceAction } from "./validation";

/**
 * Allows you to control where to place a new Stage when it's added to the Pipeline.
 * Note that you can provide only one of the below properties -
 * specifying more than one will result in a validation error.
 *
 * @see #rightBefore
 * @see #justAfter
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
}

/**
 * Construction properties of a Pipeline Stage.
 */
export interface StageProps {
  /**
   * The physical, human-readable name to assign to this Pipeline Stage.
   */
  readonly stageName: string;

  /**
   * The list of Actions to create this Stage with.
   * You can always add more Actions later by calling {@link IStage#addAction}.
   */
  readonly actions?: IAction[];
}

export interface StageOptions extends StageProps {
  readonly placement?: StagePlacement;
}

export interface PipelineProps {
  /**
   * The S3 bucket used by this Pipeline to store artifacts.
   *
   * @default - A new S3 bucket will be created.
   */
  readonly artifactBucket?: s3.IBucket;

  /**
   * The IAM role to be assumed by this Pipeline.
   *
   * @default a new IAM role will be created.
   */
  readonly role?: iam.IRole;

  /**
   * Indicates whether to rerun the AWS CodePipeline pipeline after you update it.
   *
   * @default false
   */
  readonly restartExecutionOnUpdate?: boolean;

  /**
   * Name of the pipeline.
   *
   * @default - AWS CloudFormation generates an ID and uses that for the pipeline name.
   */
  readonly pipelineName?: string;

  /**
   * A map of region to S3 bucket name used for cross-region CodePipeline.
   * For every Action that you specify targeting a different region than the Pipeline itself,
   * if you don't provide an explicit Bucket for that region using this property,
   * the construct will automatically create a Stack containing an S3 Bucket in that region.
   *
   * @default - None.
   * @experimental
   */
  readonly crossRegionReplicationBuckets?: { [region: string]: s3.IBucket };

  /**
   * The list of Stages, in order,
   * to create this Pipeline with.
   * You can always add more Stages later by calling {@link Pipeline#addStage}.
   *
   * @default - None.
   */
  readonly stages?: StageProps[];
}

abstract class PipelineBase extends Resource implements IPipeline {
  public abstract pipelineName: string;
  public abstract pipelineArn: string;

  /**
   * Defines an event rule triggered by this CodePipeline.
   *
   * @param id Identifier for this event handler.
   * @param options Additional options to pass to the event rule.
   */
  public onEvent(id: string, options: events.OnEventOptions = {}): events.Rule {
    const rule = new events.Rule(this, id, options);
    rule.addTarget(options.target);
    rule.addEventPattern({
      source: [ 'aws.codepipeline' ],
      resources: [ this.pipelineArn ],
    });
    return rule;
  }

  /**
   * Defines an event rule triggered by the "CodePipeline Pipeline Execution
   * State Change" event emitted from this pipeline.
   *
   * @param id Identifier for this event handler.
   * @param options Additional options to pass to the event rule.
   */
  public onStateChange(id: string, options: events.OnEventOptions = {}): events.Rule {
    const rule = this.onEvent(id, options);
    rule.addEventPattern({
      detailType: [ 'CodePipeline Pipeline Execution State Change' ],
    });
    return rule;
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
   * The IAM role AWS CodePipeline will use to perform actions or assume roles for actions with
   * a more specific IAM role.
   */
  public readonly role: iam.IRole;

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
  private readonly crossRegionReplicationBuckets: { [region: string]: s3.IBucket };
  private readonly crossRegionBucketsPassed: boolean;
  private readonly artifactStores: { [region: string]: CfnPipeline.ArtifactStoreProperty };
  private readonly _crossRegionSupport: { [region: string]: CrossRegionSupport } = {};

  constructor(scope: Construct, id: string, props: PipelineProps = {}) {
    super(scope, id, {
      physicalName: props.pipelineName,
    });

    validateName('Pipeline', this.physicalName);

    // only one of artifactBucket and crossRegionReplicationBuckets can be supplied
    if (props.artifactBucket && props.crossRegionReplicationBuckets) {
      throw new Error('Only one of artifactBucket and crossRegionReplicationBuckets can be specified!');
    }

    // If a bucket has been provided, use it - otherwise, create a bucket.
    let propsBucket = this.getArtifactBucketFromProps(props);
    if (!propsBucket) {
      const encryptionKey = new kms.Key(this, 'ArtifactsBucketEncryptionKey');
      propsBucket = new s3.Bucket(this, 'ArtifactsBucket', {
        bucketName: PhysicalName.GENERATE_IF_NEEDED,
        encryptionKey,
        encryption: s3.BucketEncryption.KMS,
        removalPolicy: RemovalPolicy.RETAIN
      });
    }
    this.artifactBucket = propsBucket;

    // If a role has been provided, use it - otherwise, create a role.
    this.role = props.role || new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('codepipeline.amazonaws.com')
    });

    const codePipeline = new CfnPipeline(this, 'Resource', {
      artifactStore: Lazy.anyValue({ produce: () => this.renderArtifactStore() }),
      artifactStores: Lazy.anyValue({ produce: () => this.renderArtifactStores() }),
      stages: Lazy.anyValue({ produce: () => this.renderStages() }),
      roleArn: this.role.roleArn,
      restartExecutionOnUpdate: props && props.restartExecutionOnUpdate,
      name: this.physicalName,
    });

    // this will produce a DependsOn for both the role and the policy resources.
    codePipeline.node.addDependency(this.role);

    this.artifactBucket.grantReadWrite(this.role);
    this.pipelineName = this.getResourceNameAttribute(codePipeline.ref);
    this.pipelineVersion = codePipeline.attrVersion;
    this.crossRegionReplicationBuckets = props.crossRegionReplicationBuckets || {};
    this.crossRegionBucketsPassed = !!props.crossRegionReplicationBuckets;
    this.artifactStores = {};

    // Does not expose a Fn::GetAtt for the ARN so we'll have to make it ourselves
    this.pipelineArn = Stack.of(this).formatArn({
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
  public addStage(props: StageOptions): IStage {
    // check for duplicate Stages and names
    if (this.stages.find(s => s.stageName === props.stageName)) {
      throw new Error(`Stage with duplicate name '${props.stageName}' added to the Pipeline`);
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
   * Get the number of Stages in this Pipeline.
   */
  public get stageCount(): number {
    return this.stages.length;
  }

  /**
   * Returns all of the {@link CrossRegionSupportStack}s that were generated automatically
   * when dealing with Actions that reside in a different region than the Pipeline itself.
   *
   * @experimental
   */
  public get crossRegionSupport(): { [region: string]: CrossRegionSupport } {
    const ret: { [region: string]: CrossRegionSupport }  = {};
    Object.keys(this._crossRegionSupport).forEach((key) => {
      ret[key] = this._crossRegionSupport[key];
    });
    return ret;
  }

  /** @internal */
  public _attachActionToPipeline(stage: Stage, action: IAction, actionScope: Construct): FullActionDescriptor {
    // handle cross-region actions here
    const bucket = this.ensureReplicationBucketExistsFor(action.actionProperties.region);

    // get the role for the given action
    const actionRole = this.getRoleForAction(stage, action, actionScope);

    // bind the Action
    const actionDescriptor = action.bind(actionScope, stage, {
      role: actionRole ? actionRole : this.role,
      bucket,
    });

    return new FullActionDescriptor(action, actionDescriptor, actionRole);
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

  private ensureReplicationBucketExistsFor(region?: string): s3.IBucket {
    if (!region) {
      return this.artifactBucket;
    }

    // get the region the Pipeline itself is in
    const pipelineRegion = this.requireRegion();

    // if we already have an ArtifactStore generated for this region, or it's the Pipeline's region, nothing to do
    if (region === pipelineRegion) {
      return this.artifactBucket;
    }

    let replicationBucket = this.crossRegionReplicationBuckets[region];
    if (!replicationBucket) {
      const pipelineStack = Stack.of(this);
      const pipelineAccount = pipelineStack.account;
      if (Token.isUnresolved(pipelineAccount)) {
        throw new Error("You need to specify an explicit account when using CodePipeline's cross-region support");
      }

      const app = this.node.root;
      if (!app || !App.isApp(app)) {
        throw new Error(`Pipeline stack which uses cross region actions must be part of a CDK app`);
      }
      const crossRegionScaffoldStack = new CrossRegionSupportStack(app, `cross-region-stack-${pipelineAccount}:${region}`, {
        pipelineStackName: pipelineStack.stackName,
        region,
        account: pipelineAccount,
      });
      replicationBucket = crossRegionScaffoldStack.replicationBucket;
      pipelineStack.addDependency(crossRegionScaffoldStack);
      this._crossRegionSupport[region] = {
        stack: crossRegionScaffoldStack,
        replicationBucket,
      };
      this.crossRegionReplicationBuckets[region] = replicationBucket;
    }
    replicationBucket.grantReadWrite(this.role);

    this.artifactStores[region] = {
      location: replicationBucket.bucketName,
      type: 'S3',
    };

    return replicationBucket;
  }

  /**
   * Gets the role used for this action,
   * including handling the case when the action is supposed to be cross-region.
   *
   * @param stage the stage the action belongs to
   * @param action the action to return/create a role for
   */
  private getRoleForAction(stage: Stage, action: IAction, actionScope: Construct): iam.IRole | undefined {
    const pipelineStack = Stack.of(this);

    let actionRole: iam.IRole | undefined;
    if (action.actionProperties.role) {
      if (!this.isAwsOwned(action)) {
        throw new Error("Specifying a Role is not supported for actions with an owner different than 'AWS' - " +
          `got '${action.actionProperties.owner}' (Action: '${action.actionProperties.actionName}' in Stage: '${stage.stageName}')`);
      }
      actionRole = action.actionProperties.role;
    } else if (action.actionProperties.resource) {
      const resourceStack = Stack.of(action.actionProperties.resource);
      // check if resource is from a different account
      if (pipelineStack.environment !== resourceStack.environment) {
        // if it is, the pipeline's bucket must have a KMS key
        if (!this.artifactBucket.encryptionKey) {
          throw new Error('The Pipeline is being used in a cross-account manner, ' +
            'but its artifact bucket does not have a KMS key defined. ' +
            'A KMS key is required for a cross-account Pipeline. ' +
            'Make sure to pass a Bucket with a Key when creating the Pipeline');
        }

        // generate a role in the other stack, that the Pipeline will assume for executing this action
        actionRole = new iam.Role(resourceStack,
            `${this.node.uniqueId}-${stage.stageName}-${action.actionProperties.actionName}-ActionRole`, {
          assumedBy: new iam.AccountPrincipal(pipelineStack.account),
          roleName: PhysicalName.GENERATE_IF_NEEDED,
        });

        // the other stack has to be deployed before the pipeline stack
        pipelineStack.addDependency(resourceStack);
      }
    }

    if (!actionRole && this.isAwsOwned(action)) {
      // generate a Role for this specific Action
      actionRole = new iam.Role(actionScope, 'CodePipelineActionRole', {
        assumedBy: new iam.AccountPrincipal(pipelineStack.account),
      });
    }

    // the pipeline role needs assumeRole permissions to the action role
    if (actionRole) {
      this.role.addToPolicy(new iam.PolicyStatement({
        actions: ['sts:AssumeRole'],
        resources: [actionRole.roleArn]
      }));
    }

    return actionRole;
  }

  private isAwsOwned(action: IAction) {
    const owner = action.actionProperties.owner;
    return !owner || owner === 'AWS';
  }

  private getArtifactBucketFromProps(props: PipelineProps): s3.IBucket | undefined {
    if (props.artifactBucket) {
      return props.artifactBucket;
    }
    if (props.crossRegionReplicationBuckets) {
      const pipelineRegion = this.requireRegion();
      return props.crossRegionReplicationBuckets[pipelineRegion];
    }
    return undefined;
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

  private renderArtifactStores(): CfnPipeline.ArtifactStoreMapProperty[] | undefined {
    if (!this.crossRegion) { return undefined; }

    // add the Pipeline's artifact store
    const primaryStore = this.renderPrimaryArtifactStore();
    const primaryRegion = this.requireRegion();
    this.artifactStores[primaryRegion] = primaryStore;

    return Object.entries(this.artifactStores).map(([region, artifactStore]) => ({
      region, artifactStore
    }));
  }

  private renderArtifactStore(): CfnPipeline.ArtifactStoreProperty | undefined {
    if (this.crossRegion) { return undefined; }
    return this.renderPrimaryArtifactStore();
  }

  private renderPrimaryArtifactStore(): CfnPipeline.ArtifactStoreProperty {
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

  private get crossRegion(): boolean {
    if (this.crossRegionBucketsPassed) { return true; }
    return this.stages.some(stage => stage.actions.some(action => action.region !== undefined));
  }

  private renderStages(): CfnPipeline.StageDeclarationProperty[] {
    return this.stages.map(stage => stage.render());
  }

  private requireRegion(): string {
    const region = Stack.of(this).region;
    if (Token.isUnresolved(region)) {
      throw new Error(`You need to specify an explicit region when using CodePipeline's cross-region support`);
    }
    return region;
  }
}

/**
 * An interface representing resources generated in order to support
 * the cross-region capabilities of CodePipeline.
 * You get instances of this interface from the {@link Pipeline#crossRegionSupport} property.
 *
 * @experimental
 */
export interface CrossRegionSupport {
  /**
   * The Stack that has been created to house the replication Bucket
   * required for this  region.
   */
  readonly stack: Stack;

  /**
   * The replication Bucket used by CodePipeline to operate in this region.
   * Belongs to {@link stack}.
   */
  readonly replicationBucket: s3.IBucket;
}

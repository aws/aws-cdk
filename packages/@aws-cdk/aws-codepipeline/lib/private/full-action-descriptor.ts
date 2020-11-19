import * as iam from '@aws-cdk/aws-iam';
import { IAction, IBoundAction } from '../action';
import { CfnPipeline } from '../codepipeline.generated';
import { renderArtifacts } from './artifacts';
import * as validation from './validation';

export interface FullActionDescriptorProps {
  readonly boundAction: IBoundAction;
  readonly actionRole: iam.IRole | undefined;
  readonly actionRegion: string | undefined;
}

/**
 * Rendering and validation logic for a Bound action.
 *
 * This class is private to the aws-codepipeline package.
 */
export class FullActionDescriptor {
  public readonly action: IAction;

  constructor(private readonly props: FullActionDescriptorProps) {
    this.action = props.boundAction.action;
  }

  public get actionName(): string {
    return this.action.actionProperties.actionName;
  }

  public get runOrder(): number {
    return this.action.actionProperties.runOrder;
  }

  public get inputs() {
    return this.action.actionProperties.inputs;
  }

  public get outputs() {
    return this.action.actionProperties.outputs;
  }

  public get region(): string | undefined {
    // Take the props region, which is going to be the target region EXCEPT if it's the
    // pipeline region (in which case it will be undefined).
    //
    // But if the user specified a region on the action's props, then render
    // it anyway because they apparently dearly want it in the template.
    return this.props.actionRegion ?? this.action.actionProperties.region;
  }

  public get role(): iam.IRole | undefined {
    return this.action.actionProperties.role;
  }

  public render(): CfnPipeline.ActionDeclarationProperty {
    const actionProperties = this.action.actionProperties;
    return {
      name: actionProperties.actionName,
      inputArtifacts: renderArtifacts(actionProperties.inputs ?? []),
      outputArtifacts: renderArtifacts(actionProperties.outputs ?? []),
      actionTypeId: {
        category: actionProperties.category.toString(),
        version: actionProperties.version ?? '1',
        owner: actionProperties.owner ?? 'AWS',
        provider: actionProperties.provider,
      },
      configuration: this.props.boundAction.configuration(),
      runOrder: this.runOrder,
      namespace: actionProperties.variablesNamespace,
      roleArn: this.role?.roleArn,
      region: this.region,
    };
  }

  public validateAction(): string[] {
    const actionProperties = this.action.actionProperties;
    return [
      ...validation.validateArtifactBounds(
        'input',
        actionProperties.inputs ?? [],
        actionProperties.artifactBounds.minInputs,
        actionProperties.artifactBounds.maxInputs,
        actionProperties.category,
        actionProperties.provider),
      ...validation.validateArtifactBounds(
        'output',
        actionProperties.outputs ?? [],
        actionProperties.artifactBounds.minOutputs,
        actionProperties.artifactBounds.maxOutputs,
        actionProperties.category,
        actionProperties.provider),
    ];
  }

  public validateSourceActionPosition(mustBeSource: boolean, stageName: string): string[] {
    return validation.validateSourceAction(
      mustBeSource,
      this.action.actionProperties.category,
      this.action.actionProperties.actionName,
      stageName);
  }
}

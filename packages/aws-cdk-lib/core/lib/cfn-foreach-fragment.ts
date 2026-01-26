import { Construct } from 'constructs';
import { CfnElement } from './cfn-element';
import { IResolvable } from './resolvable';
import { Stack } from './stack';

/**
 * The section of the CloudFormation template where ForEach can be used.
 */
export type ForEachSection = 'Resources' | 'Outputs' | 'Conditions';

/**
 * Properties for CfnForEachFragment.
 *
 * @internal
 */
export interface CfnForEachFragmentProps {
  /**
   * The CloudFormation template section.
   */
  readonly section: ForEachSection;

  /**
   * The Fn::ForEach fragment to inject.
   */
  readonly fragment: IResolvable;
}

/**
 * A fragment that injects Fn::ForEach into a CloudFormation template section.
 *
 * This is an internal construct used by ForEachResource, ForEachOutput, and ForEachCondition.
 *
 * @internal
 */
export class CfnForEachFragment extends CfnElement {
  private readonly section: ForEachSection;
  private readonly fragment: IResolvable;

  /** @internal */
  constructor(scope: Construct, id: string, props: CfnForEachFragmentProps) {
    super(scope, id);
    this.section = props.section;
    this.fragment = props.fragment;
    Stack.of(this).addTransform('AWS::LanguageExtensions');
  }

  /** @internal */
  public _toCloudFormation(): object {
    const resolved = Stack.of(this).resolve(this.fragment);
    return { [this.section]: resolved };
  }
}

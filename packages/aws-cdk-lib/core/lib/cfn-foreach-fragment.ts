import { Construct } from 'constructs';
import { CfnElement } from './cfn-element';
import { IResolvable } from './resolvable';
import { Stack } from './stack';

/**
 * The section of the CloudFormation template where ForEach can be used.
 */
export type ForEachSection = 'Resources' | 'Outputs' | 'Conditions';

/**
 * A fragment that injects Fn::ForEach into a CloudFormation template section.
 */
export class CfnForEachFragment extends CfnElement {
  private readonly section: ForEachSection;
  private readonly fragment: IResolvable;

  constructor(scope: Construct, id: string, section: ForEachSection, fragment: IResolvable) {
    super(scope, id);
    this.section = section;
    this.fragment = fragment;
    Stack.of(this).addTransform('AWS::LanguageExtensions');
  }

  /** @internal */
  public _toCloudFormation(): object {
    const resolved = Stack.of(this).resolve(this.fragment);
    return { [this.section]: resolved };
  }
}

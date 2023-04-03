import { Construct } from 'constructs';
import { CfnElement } from './cfn-element';
import { ignoreEmpty } from './util';

/**
 * Construction properties of `CfnHook`.
 */
export interface CfnHookProps {
  /**
   * The type of the hook
   * (for example, "AWS::CodeDeploy::BlueGreen").
   */
  readonly type: string;

  /**
   * The properties of the hook.
   *
   * @default - no properties
   */
  readonly properties?: { [name: string]: any };
}

/**
 * Represents a CloudFormation resource.
 */
export class CfnHook extends CfnElement {
  /**
   * The type of the hook
   * (for example, "AWS::CodeDeploy::BlueGreen").
   */
  public readonly type: string;

  private readonly _cfnHookProperties?: { [name: string]: any };

  /**
   * Creates a new Hook object.
   */
  constructor(scope: Construct, id: string, props: CfnHookProps) {
    super(scope, id);

    this.type = props.type;
    this._cfnHookProperties = props.properties;
  }

  /** @internal */
  public _toCloudFormation(): object {
    return {
      Hooks: {
        [this.logicalId]: {
          Type: this.type,
          Properties: ignoreEmpty(this.renderProperties(this._cfnHookProperties)),
        },
      },
    };
  }

  protected renderProperties(props?: {[key: string]: any}): { [key: string]: any } | undefined {
    return props;
  }
}

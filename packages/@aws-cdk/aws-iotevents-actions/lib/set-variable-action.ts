import * as iotevents from '@aws-cdk/aws-iotevents';
import { Construct } from 'constructs';

/**
 * The action to create a variable with a specified value.
 */
export class SetVariableAction implements iotevents.IAction {
  /**
   * @param variableName the name of the variable
   * @param value the new value of the variable
   */
  constructor(private readonly variableName: string, private readonly value: iotevents.Expression) {
  }

  /**
   * @internal
   */
  public _bind(_scope: Construct, _options: iotevents.ActionBindOptions): iotevents.ActionConfig {
    return {
      configuration: {
        setVariable: {
          variableName: this.variableName,
          value: this.value.evaluate(),
        },
      },
    };
  }
}

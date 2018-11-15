import { Mode, SDK } from '../api';
import { debug } from '../logging';
import { ContextProviderPlugin } from './provider';

/**
 * Plugin to read arbitrary SSM parameter names
 */
export class SSMContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SDK) {
  }

  public async getValue(args: {[key: string]: any}) {
    const region = args.region;
    const account = args.account;
    if (!('parameterName' in args)) {
        throw new Error('parameterName must be provided in props for SSMContextProviderPlugin');
    }
    const parameterName = args.parameterName;
    debug(`Reading SSM parameter ${account}:${region}:${parameterName}`);

    const ssm = await this.aws.ssm(account, region, Mode.ForReading);
    const response = await ssm.getParameter({ Name: parameterName }).promise();
    if (!response.Parameter || response.Parameter.Value === undefined) {
      throw new Error(`SSM parameter not available in account ${account}, region ${region}: ${parameterName}`);
    }
    return response.Parameter.Value;
  }
}

import * as cxapi from '@aws-cdk/cx-api';
import * as AWS from 'aws-sdk';
import { ISDK, Mode } from '../api';
import { debug } from '../logging';
import { ContextProviderPlugin } from './provider';

export class SecurityGroupContextProviderPlugin implements ContextProviderPlugin {

  constructor(private readonly aws: ISDK) {
  }

  public async getValue(args: {[key: string]: any}): Promise<object> {
    const account = args.account;
    const region = args.region;
    if (!this.isSecurityGroupQuery(args)) {
      throw new Error(`SecurityGroupQuery requires filter and vpcId property to be set in ${args}`);
    }
    const filters: AWS.EC2.Filter[] = Object.entries(args.filter).map(([tag, value]) => ({ Name: tag, Values: [value] }));
    debug(`Reading security groups ${account}:${region}:${JSON.stringify(args)}`);
    const ec2 = await this.aws.ec2(account, region, Mode.ForReading);
    const response = await ec2.describeSecurityGroups({ Filters: filters }).promise();
    if (response.SecurityGroups == null || response.SecurityGroups[0] == null) {
      throw new Error(`Security Group not found in account ${account}, region ${region}: ${JSON.stringify(args.filter)}`);
    }
    if (response.SecurityGroups.length > 1) {
      throw new Error(`Multiple security groups matching ${JSON.stringify(args.filter)} in ${account}, region ${region}`);
    }

    return {
      securityGroupId: response.SecurityGroups[0].GroupId,
    };
  }

  private isSecurityGroupQuery(props: cxapi.SecurityGroupContextQuery | any): props is cxapi.SecurityGroupContextQuery {
    return (props as cxapi.SecurityGroupContextQuery).filter !== undefined &&
           (props as cxapi.SecurityGroupContextQuery).vpcId !== undefined;
  }
}

import { App, Stack } from 'aws-cdk-lib';
import type { StackProps } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import { LogGroup, LogGroupClass } from 'aws-cdk-lib/aws-logs';

class DeliveryLogGroupStack extends Stack {
  public readonly logGroupName: string;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // A Delivery-class log group. It does not store log events itself; retention,
    // data protection policies and field index policies are not supported for this
    // class, so none are set here.
    const logGroup = new LogGroup(this, 'DeliveryLogGroup', {
      logGroupClass: LogGroupClass.DELIVERY,
    });

    this.logGroupName = logGroup.logGroupName;
  }
}

const app = new App();
const stack = new DeliveryLogGroupStack(app, 'aws-cdk-log-group-delivery-class-integ');

const integ = new IntegTest(app, 'LogGroupDeliveryClassInteg', { testCases: [stack] });

// Confirm the log group was actually created with the DELIVERY class.
integ.assertions
  .awsApiCall('CloudWatchLogs', 'describeLogGroups', {
    logGroupNamePrefix: stack.logGroupName,
  })
  .expect(ExpectedResult.objectLike({
    logGroups: Match.arrayWith([
      Match.objectLike({
        logGroupName: stack.logGroupName,
        logGroupClass: 'DELIVERY',
      }),
    ]),
  }));

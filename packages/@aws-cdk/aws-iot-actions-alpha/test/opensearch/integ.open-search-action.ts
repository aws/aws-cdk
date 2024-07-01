import * as iot from '@aws-cdk/aws-iot-alpha';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as actions from '../../lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'aws-iot-opensearch-integ-stack');

// Adding a domain with cognito dashboards auth configured
const domain = new opensearch.Domain(stack, 'Domain', {
  removalPolicy: RemovalPolicy.DESTROY,
  version: opensearch.EngineVersion.OPENSEARCH_1_0,
  useUnsignedBasicAuth: true,
  capacity: {
    multiAzWithStandbyEnabled: false,
  },
});

const topicRule = new iot.TopicRule(stack, 'TopicRule', {
  sql: iot.IotSql.fromStringAsVer20160323(
    "SELECT topic(2) as device_id, year, month, day FROM 'device/+/data'",
  ),
});

topicRule.addAction(new actions.OpenSearchAction(domain, {
  id: 'my-id',
  index: 'my-index',
  type: 'my-type',
}));

new IntegTest(app, 'iot-opensearch-action-integ-test', {
  testCases: [stack],
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: true,
      },
    },
  },
});

import * as iot from '@aws-cdk/aws-iot';
import * as oss from '@aws-cdk/aws-opensearchservice';
import * as cdk from '@aws-cdk/core';
import * as actions from '../../lib';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const topicRule = new iot.TopicRule(this, 'TopicRule', {
      sql: iot.IotSql.fromStringAsVer20160323("SELECT * FROM 'device/+/data'"),
    });

    const domain = new oss.Domain(this, 'OpenSearchDomain', {
      version: oss.EngineVersion.OPENSEARCH_1_3,
    });

    topicRule.addAction(
      new actions.OpenSearchAction(
        domain,
        'DocumentId',
        'DocumentIndex',
        'DocumentType',
      ),
    );
  }
}

new TestStack(app, 'test-stack');
app.synth();

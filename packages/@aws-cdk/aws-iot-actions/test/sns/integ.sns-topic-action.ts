/**
 * Stack verification steps:
 * * aws sns subscribe --topic-arn "arn:aws:sns:<region>:<account>:test-stack-MyTopic86869434-10F6E3DMK3E5P" --protocol email --notification-endpoint <email-addr>
 * * confirm subscription from email
 * * echo '{"message": "hello world"}' > testfile.txt
 * * aws iot-data publish --topic device/mydevice/data --qos 1 --payload fileb://testfile.txt
 * * verify that an email was sent from the SNS
 * * rm testfile.txt
 */
/// !cdk-integ pragma:ignore-assets
import * as iot from '@aws-cdk/aws-iot';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import * as actions from '../../lib';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const topicRule = new iot.TopicRule(this, 'TopicRule', {
      sql: iot.IotSql.fromStringAsVer20160323(
        "SELECT topic(2) as device_id, year, month, day FROM 'device/+/data'",
      ),
    });

    const snsTopic = new sns.Topic(this, 'MyTopic');
    topicRule.addAction(new actions.SnsTopicAction(snsTopic));
  }
}

const app = new cdk.App();
new TestStack(app, 'sns-topic-action-test-stack');
app.synth();
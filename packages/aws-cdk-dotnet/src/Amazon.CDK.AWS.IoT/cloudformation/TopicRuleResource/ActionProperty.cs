using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.IoT.cloudformation.TopicRuleResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html </remarks>
    public class ActionProperty : DeputyBase, IActionProperty
    {
        /// <summary>``TopicRuleResource.ActionProperty.CloudwatchAlarm``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-cloudwatchalarm </remarks>
        [JsiiProperty("cloudwatchAlarm", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-iot.cloudformation.TopicRuleResource.CloudwatchAlarmActionProperty\"}]},\"optional\":true}", true)]
        public object CloudwatchAlarm
        {
            get;
            set;
        }

        /// <summary>``TopicRuleResource.ActionProperty.CloudwatchMetric``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-cloudwatchmetric </remarks>
        [JsiiProperty("cloudwatchMetric", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-iot.cloudformation.TopicRuleResource.CloudwatchMetricActionProperty\"}]},\"optional\":true}", true)]
        public object CloudwatchMetric
        {
            get;
            set;
        }

        /// <summary>``TopicRuleResource.ActionProperty.DynamoDB``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-dynamodb </remarks>
        [JsiiProperty("dynamoDb", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-iot.cloudformation.TopicRuleResource.DynamoDBActionProperty\"}]},\"optional\":true}", true)]
        public object DynamoDb
        {
            get;
            set;
        }

        /// <summary>``TopicRuleResource.ActionProperty.DynamoDBv2``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-dynamodbv2 </remarks>
        [JsiiProperty("dynamoDBv2", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-iot.cloudformation.TopicRuleResource.DynamoDBv2ActionProperty\"}]},\"optional\":true}", true)]
        public object DynamoDBv2
        {
            get;
            set;
        }

        /// <summary>``TopicRuleResource.ActionProperty.Elasticsearch``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-elasticsearch </remarks>
        [JsiiProperty("elasticsearch", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-iot.cloudformation.TopicRuleResource.ElasticsearchActionProperty\"}]},\"optional\":true}", true)]
        public object Elasticsearch
        {
            get;
            set;
        }

        /// <summary>``TopicRuleResource.ActionProperty.Firehose``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-firehose </remarks>
        [JsiiProperty("firehose", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-iot.cloudformation.TopicRuleResource.FirehoseActionProperty\"}]},\"optional\":true}", true)]
        public object Firehose
        {
            get;
            set;
        }

        /// <summary>``TopicRuleResource.ActionProperty.Kinesis``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-kinesis </remarks>
        [JsiiProperty("kinesis", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-iot.cloudformation.TopicRuleResource.KinesisActionProperty\"}]},\"optional\":true}", true)]
        public object Kinesis
        {
            get;
            set;
        }

        /// <summary>``TopicRuleResource.ActionProperty.Lambda``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-lambda </remarks>
        [JsiiProperty("lambda", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-iot.cloudformation.TopicRuleResource.LambdaActionProperty\"}]},\"optional\":true}", true)]
        public object Lambda
        {
            get;
            set;
        }

        /// <summary>``TopicRuleResource.ActionProperty.Republish``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-republish </remarks>
        [JsiiProperty("republish", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-iot.cloudformation.TopicRuleResource.RepublishActionProperty\"}]},\"optional\":true}", true)]
        public object Republish
        {
            get;
            set;
        }

        /// <summary>``TopicRuleResource.ActionProperty.S3``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-s3 </remarks>
        [JsiiProperty("s3", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-iot.cloudformation.TopicRuleResource.S3ActionProperty\"}]},\"optional\":true}", true)]
        public object S3
        {
            get;
            set;
        }

        /// <summary>``TopicRuleResource.ActionProperty.Sns``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-sns </remarks>
        [JsiiProperty("sns", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-iot.cloudformation.TopicRuleResource.SnsActionProperty\"}]},\"optional\":true}", true)]
        public object Sns
        {
            get;
            set;
        }

        /// <summary>``TopicRuleResource.ActionProperty.Sqs``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-sqs </remarks>
        [JsiiProperty("sqs", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-iot.cloudformation.TopicRuleResource.SqsActionProperty\"}]},\"optional\":true}", true)]
        public object Sqs
        {
            get;
            set;
        }
    }
}
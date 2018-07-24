using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.IoT.cloudformation.TopicRuleResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html </remarks>
    [JsiiInterface(typeof(IActionProperty), "@aws-cdk/aws-iot.cloudformation.TopicRuleResource.ActionProperty")]
    public interface IActionProperty
    {
        /// <summary>``TopicRuleResource.ActionProperty.CloudwatchAlarm``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-cloudwatchalarm </remarks>
        [JsiiProperty("cloudwatchAlarm", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-iot.cloudformation.TopicRuleResource.CloudwatchAlarmActionProperty\"}]},\"optional\":true}")]
        object CloudwatchAlarm
        {
            get;
            set;
        }

        /// <summary>``TopicRuleResource.ActionProperty.CloudwatchMetric``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-cloudwatchmetric </remarks>
        [JsiiProperty("cloudwatchMetric", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-iot.cloudformation.TopicRuleResource.CloudwatchMetricActionProperty\"}]},\"optional\":true}")]
        object CloudwatchMetric
        {
            get;
            set;
        }

        /// <summary>``TopicRuleResource.ActionProperty.DynamoDB``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-dynamodb </remarks>
        [JsiiProperty("dynamoDb", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-iot.cloudformation.TopicRuleResource.DynamoDBActionProperty\"}]},\"optional\":true}")]
        object DynamoDb
        {
            get;
            set;
        }

        /// <summary>``TopicRuleResource.ActionProperty.DynamoDBv2``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-dynamodbv2 </remarks>
        [JsiiProperty("dynamoDBv2", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-iot.cloudformation.TopicRuleResource.DynamoDBv2ActionProperty\"}]},\"optional\":true}")]
        object DynamoDBv2
        {
            get;
            set;
        }

        /// <summary>``TopicRuleResource.ActionProperty.Elasticsearch``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-elasticsearch </remarks>
        [JsiiProperty("elasticsearch", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-iot.cloudformation.TopicRuleResource.ElasticsearchActionProperty\"}]},\"optional\":true}")]
        object Elasticsearch
        {
            get;
            set;
        }

        /// <summary>``TopicRuleResource.ActionProperty.Firehose``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-firehose </remarks>
        [JsiiProperty("firehose", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-iot.cloudformation.TopicRuleResource.FirehoseActionProperty\"}]},\"optional\":true}")]
        object Firehose
        {
            get;
            set;
        }

        /// <summary>``TopicRuleResource.ActionProperty.Kinesis``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-kinesis </remarks>
        [JsiiProperty("kinesis", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-iot.cloudformation.TopicRuleResource.KinesisActionProperty\"}]},\"optional\":true}")]
        object Kinesis
        {
            get;
            set;
        }

        /// <summary>``TopicRuleResource.ActionProperty.Lambda``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-lambda </remarks>
        [JsiiProperty("lambda", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-iot.cloudformation.TopicRuleResource.LambdaActionProperty\"}]},\"optional\":true}")]
        object Lambda
        {
            get;
            set;
        }

        /// <summary>``TopicRuleResource.ActionProperty.Republish``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-republish </remarks>
        [JsiiProperty("republish", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-iot.cloudformation.TopicRuleResource.RepublishActionProperty\"}]},\"optional\":true}")]
        object Republish
        {
            get;
            set;
        }

        /// <summary>``TopicRuleResource.ActionProperty.S3``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-s3 </remarks>
        [JsiiProperty("s3", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-iot.cloudformation.TopicRuleResource.S3ActionProperty\"}]},\"optional\":true}")]
        object S3
        {
            get;
            set;
        }

        /// <summary>``TopicRuleResource.ActionProperty.Sns``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-sns </remarks>
        [JsiiProperty("sns", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-iot.cloudformation.TopicRuleResource.SnsActionProperty\"}]},\"optional\":true}")]
        object Sns
        {
            get;
            set;
        }

        /// <summary>``TopicRuleResource.ActionProperty.Sqs``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-sqs </remarks>
        [JsiiProperty("sqs", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-iot.cloudformation.TopicRuleResource.SqsActionProperty\"}]},\"optional\":true}")]
        object Sqs
        {
            get;
            set;
        }
    }
}
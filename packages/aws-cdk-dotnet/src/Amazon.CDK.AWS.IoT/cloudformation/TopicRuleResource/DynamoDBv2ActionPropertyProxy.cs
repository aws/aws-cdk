using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.IoT.cloudformation.TopicRuleResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-dynamodbv2action.html </remarks>
    [JsiiInterfaceProxy(typeof(IDynamoDBv2ActionProperty), "@aws-cdk/aws-iot.cloudformation.TopicRuleResource.DynamoDBv2ActionProperty")]
    internal class DynamoDBv2ActionPropertyProxy : DeputyBase, IDynamoDBv2ActionProperty
    {
        private DynamoDBv2ActionPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``TopicRuleResource.DynamoDBv2ActionProperty.PutItem``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-dynamodbv2action.html#cfn-iot-topicrule-dynamodbv2action-putitem </remarks>
        [JsiiProperty("putItem", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-iot.cloudformation.TopicRuleResource.PutItemInputProperty\"}]},\"optional\":true}")]
        public virtual object PutItem
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``TopicRuleResource.DynamoDBv2ActionProperty.RoleArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-dynamodbv2action.html#cfn-iot-topicrule-dynamodbv2action-rolearn </remarks>
        [JsiiProperty("roleArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object RoleArn
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
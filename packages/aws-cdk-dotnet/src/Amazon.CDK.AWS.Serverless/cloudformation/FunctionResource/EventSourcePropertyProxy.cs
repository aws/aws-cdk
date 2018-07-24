using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Serverless.cloudformation.FunctionResource
{
    /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#event-source-object </remarks>
    [JsiiInterfaceProxy(typeof(IEventSourceProperty), "@aws-cdk/aws-serverless.cloudformation.FunctionResource.EventSourceProperty")]
    internal class EventSourcePropertyProxy : DeputyBase, IEventSourceProperty
    {
        private EventSourcePropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``FunctionResource.EventSourceProperty.Properties``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#event-source-types </remarks>
        [JsiiProperty("properties", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-serverless.cloudformation.FunctionResource.AlexaSkillEventProperty\"},{\"fqn\":\"@aws-cdk/aws-serverless.cloudformation.FunctionResource.ApiEventProperty\"},{\"fqn\":\"@aws-cdk/aws-serverless.cloudformation.FunctionResource.CloudWatchEventEventProperty\"},{\"fqn\":\"@aws-cdk/aws-serverless.cloudformation.FunctionResource.DynamoDBEventProperty\"},{\"fqn\":\"@aws-cdk/aws-serverless.cloudformation.FunctionResource.S3EventProperty\"},{\"fqn\":\"@aws-cdk/aws-serverless.cloudformation.FunctionResource.SNSEventProperty\"},{\"fqn\":\"@aws-cdk/aws-serverless.cloudformation.FunctionResource.KinesisEventProperty\"},{\"fqn\":\"@aws-cdk/aws-serverless.cloudformation.FunctionResource.ScheduleEventProperty\"},{\"fqn\":\"@aws-cdk/aws-serverless.cloudformation.FunctionResource.IoTRuleEventProperty\"}]}}")]
        public virtual object Properties
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``FunctionResource.EventSourceProperty.Type``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#event-source-object </remarks>
        [JsiiProperty("type", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Type
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
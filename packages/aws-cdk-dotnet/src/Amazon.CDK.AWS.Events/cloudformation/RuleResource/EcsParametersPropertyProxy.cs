using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Events.cloudformation.RuleResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-ecsparameters.html </remarks>
    [JsiiInterfaceProxy(typeof(IEcsParametersProperty), "@aws-cdk/aws-events.cloudformation.RuleResource.EcsParametersProperty")]
    internal class EcsParametersPropertyProxy : DeputyBase, IEcsParametersProperty
    {
        private EcsParametersPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``RuleResource.EcsParametersProperty.TaskCount``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-ecsparameters.html#cfn-events-rule-ecsparameters-taskcount </remarks>
        [JsiiProperty("taskCount", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object TaskCount
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``RuleResource.EcsParametersProperty.TaskDefinitionArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-ecsparameters.html#cfn-events-rule-ecsparameters-taskdefinitionarn </remarks>
        [JsiiProperty("taskDefinitionArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object TaskDefinitionArn
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Events.cloudformation.RuleResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-ecsparameters.html </remarks>
    [JsiiInterface(typeof(IEcsParametersProperty), "@aws-cdk/aws-events.cloudformation.RuleResource.EcsParametersProperty")]
    public interface IEcsParametersProperty
    {
        /// <summary>``RuleResource.EcsParametersProperty.TaskCount``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-ecsparameters.html#cfn-events-rule-ecsparameters-taskcount </remarks>
        [JsiiProperty("taskCount", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object TaskCount
        {
            get;
            set;
        }

        /// <summary>``RuleResource.EcsParametersProperty.TaskDefinitionArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-ecsparameters.html#cfn-events-rule-ecsparameters-taskdefinitionarn </remarks>
        [JsiiProperty("taskDefinitionArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object TaskDefinitionArn
        {
            get;
            set;
        }
    }
}
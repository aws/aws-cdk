using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Glue.cloudformation.TriggerResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-condition.html </remarks>
    [JsiiInterface(typeof(IConditionProperty), "@aws-cdk/aws-glue.cloudformation.TriggerResource.ConditionProperty")]
    public interface IConditionProperty
    {
        /// <summary>``TriggerResource.ConditionProperty.JobName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-condition.html#cfn-glue-trigger-condition-jobname </remarks>
        [JsiiProperty("jobName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object JobName
        {
            get;
            set;
        }

        /// <summary>``TriggerResource.ConditionProperty.LogicalOperator``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-condition.html#cfn-glue-trigger-condition-logicaloperator </remarks>
        [JsiiProperty("logicalOperator", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object LogicalOperator
        {
            get;
            set;
        }

        /// <summary>``TriggerResource.ConditionProperty.State``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-condition.html#cfn-glue-trigger-condition-state </remarks>
        [JsiiProperty("state", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object State
        {
            get;
            set;
        }
    }
}
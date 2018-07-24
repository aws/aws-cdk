using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EMR.cloudformation.InstanceGroupConfigResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-scalingtrigger.html </remarks>
    [JsiiInterface(typeof(IScalingTriggerProperty), "@aws-cdk/aws-emr.cloudformation.InstanceGroupConfigResource.ScalingTriggerProperty")]
    public interface IScalingTriggerProperty
    {
        /// <summary>``InstanceGroupConfigResource.ScalingTriggerProperty.CloudWatchAlarmDefinition``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-scalingtrigger.html#cfn-elasticmapreduce-instancegroupconfig-scalingtrigger-cloudwatchalarmdefinition </remarks>
        [JsiiProperty("cloudWatchAlarmDefinition", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-emr.cloudformation.InstanceGroupConfigResource.CloudWatchAlarmDefinitionProperty\"}]}}")]
        object CloudWatchAlarmDefinition
        {
            get;
            set;
        }
    }
}
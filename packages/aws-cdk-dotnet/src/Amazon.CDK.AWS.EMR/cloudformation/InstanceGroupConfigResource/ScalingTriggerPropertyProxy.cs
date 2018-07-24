using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EMR.cloudformation.InstanceGroupConfigResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-scalingtrigger.html </remarks>
    [JsiiInterfaceProxy(typeof(IScalingTriggerProperty), "@aws-cdk/aws-emr.cloudformation.InstanceGroupConfigResource.ScalingTriggerProperty")]
    internal class ScalingTriggerPropertyProxy : DeputyBase, Amazon.CDK.AWS.EMR.cloudformation.InstanceGroupConfigResource.IScalingTriggerProperty
    {
        private ScalingTriggerPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``InstanceGroupConfigResource.ScalingTriggerProperty.CloudWatchAlarmDefinition``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-scalingtrigger.html#cfn-elasticmapreduce-instancegroupconfig-scalingtrigger-cloudwatchalarmdefinition </remarks>
        [JsiiProperty("cloudWatchAlarmDefinition", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-emr.cloudformation.InstanceGroupConfigResource.CloudWatchAlarmDefinitionProperty\"}]}}")]
        public virtual object CloudWatchAlarmDefinition
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation.SpotFleetResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-spotfleet-spotfleetrequestconfigdata-launchspecifications-monitoring.html </remarks>
    [JsiiInterfaceProxy(typeof(ISpotFleetMonitoringProperty), "@aws-cdk/aws-ec2.cloudformation.SpotFleetResource.SpotFleetMonitoringProperty")]
    internal class SpotFleetMonitoringPropertyProxy : DeputyBase, ISpotFleetMonitoringProperty
    {
        private SpotFleetMonitoringPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``SpotFleetResource.SpotFleetMonitoringProperty.Enabled``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-spotfleet-spotfleetrequestconfigdata-launchspecifications-monitoring.html#cfn-ec2-spotfleet-spotfleetmonitoring-enabled </remarks>
        [JsiiProperty("enabled", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Enabled
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
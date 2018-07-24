using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SES.cloudformation.ConfigurationSetEventDestinationResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationseteventdestination-cloudwatchdestination.html </remarks>
    [JsiiInterfaceProxy(typeof(ICloudWatchDestinationProperty), "@aws-cdk/aws-ses.cloudformation.ConfigurationSetEventDestinationResource.CloudWatchDestinationProperty")]
    internal class CloudWatchDestinationPropertyProxy : DeputyBase, ICloudWatchDestinationProperty
    {
        private CloudWatchDestinationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ConfigurationSetEventDestinationResource.CloudWatchDestinationProperty.DimensionConfigurations``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationseteventdestination-cloudwatchdestination.html#cfn-ses-configurationseteventdestination-cloudwatchdestination-dimensionconfigurations </remarks>
        [JsiiProperty("dimensionConfigurations", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ses.cloudformation.ConfigurationSetEventDestinationResource.DimensionConfigurationProperty\"}]}}}}]},\"optional\":true}")]
        public virtual object DimensionConfigurations
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
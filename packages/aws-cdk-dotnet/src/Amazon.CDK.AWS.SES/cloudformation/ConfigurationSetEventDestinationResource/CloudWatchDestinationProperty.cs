using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SES.cloudformation.ConfigurationSetEventDestinationResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationseteventdestination-cloudwatchdestination.html </remarks>
    public class CloudWatchDestinationProperty : DeputyBase, ICloudWatchDestinationProperty
    {
        /// <summary>``ConfigurationSetEventDestinationResource.CloudWatchDestinationProperty.DimensionConfigurations``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationseteventdestination-cloudwatchdestination.html#cfn-ses-configurationseteventdestination-cloudwatchdestination-dimensionconfigurations </remarks>
        [JsiiProperty("dimensionConfigurations", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ses.cloudformation.ConfigurationSetEventDestinationResource.DimensionConfigurationProperty\"}]}}}}]},\"optional\":true}", true)]
        public object DimensionConfigurations
        {
            get;
            set;
        }
    }
}
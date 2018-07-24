using Amazon.CDK;
using Amazon.CDK.AWS.SES.cloudformation.ConfigurationSetEventDestinationResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SES.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-configurationseteventdestination.html </remarks>
    [JsiiInterfaceProxy(typeof(IConfigurationSetEventDestinationResourceProps), "@aws-cdk/aws-ses.cloudformation.ConfigurationSetEventDestinationResourceProps")]
    internal class ConfigurationSetEventDestinationResourcePropsProxy : DeputyBase, IConfigurationSetEventDestinationResourceProps
    {
        private ConfigurationSetEventDestinationResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::SES::ConfigurationSetEventDestination.ConfigurationSetName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-configurationseteventdestination.html#cfn-ses-configurationseteventdestination-configurationsetname </remarks>
        [JsiiProperty("configurationSetName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object ConfigurationSetName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::SES::ConfigurationSetEventDestination.EventDestination``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-configurationseteventdestination.html#cfn-ses-configurationseteventdestination-eventdestination </remarks>
        [JsiiProperty("eventDestination", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ses.cloudformation.ConfigurationSetEventDestinationResource.EventDestinationProperty\"}]}}")]
        public virtual object EventDestination
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
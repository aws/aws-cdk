using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SES.cloudformation.ConfigurationSetEventDestinationResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationseteventdestination-dimensionconfiguration.html </remarks>
    [JsiiInterfaceProxy(typeof(IDimensionConfigurationProperty), "@aws-cdk/aws-ses.cloudformation.ConfigurationSetEventDestinationResource.DimensionConfigurationProperty")]
    internal class DimensionConfigurationPropertyProxy : DeputyBase, IDimensionConfigurationProperty
    {
        private DimensionConfigurationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ConfigurationSetEventDestinationResource.DimensionConfigurationProperty.DefaultDimensionValue``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationseteventdestination-dimensionconfiguration.html#cfn-ses-configurationseteventdestination-dimensionconfiguration-defaultdimensionvalue </remarks>
        [JsiiProperty("defaultDimensionValue", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object DefaultDimensionValue
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ConfigurationSetEventDestinationResource.DimensionConfigurationProperty.DimensionName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationseteventdestination-dimensionconfiguration.html#cfn-ses-configurationseteventdestination-dimensionconfiguration-dimensionname </remarks>
        [JsiiProperty("dimensionName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object DimensionName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ConfigurationSetEventDestinationResource.DimensionConfigurationProperty.DimensionValueSource``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationseteventdestination-dimensionconfiguration.html#cfn-ses-configurationseteventdestination-dimensionconfiguration-dimensionvaluesource </remarks>
        [JsiiProperty("dimensionValueSource", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object DimensionValueSource
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
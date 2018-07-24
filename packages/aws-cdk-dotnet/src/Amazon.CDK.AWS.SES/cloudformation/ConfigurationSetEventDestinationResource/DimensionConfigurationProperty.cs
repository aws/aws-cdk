using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SES.cloudformation.ConfigurationSetEventDestinationResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationseteventdestination-dimensionconfiguration.html </remarks>
    public class DimensionConfigurationProperty : DeputyBase, IDimensionConfigurationProperty
    {
        /// <summary>``ConfigurationSetEventDestinationResource.DimensionConfigurationProperty.DefaultDimensionValue``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationseteventdestination-dimensionconfiguration.html#cfn-ses-configurationseteventdestination-dimensionconfiguration-defaultdimensionvalue </remarks>
        [JsiiProperty("defaultDimensionValue", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object DefaultDimensionValue
        {
            get;
            set;
        }

        /// <summary>``ConfigurationSetEventDestinationResource.DimensionConfigurationProperty.DimensionName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationseteventdestination-dimensionconfiguration.html#cfn-ses-configurationseteventdestination-dimensionconfiguration-dimensionname </remarks>
        [JsiiProperty("dimensionName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object DimensionName
        {
            get;
            set;
        }

        /// <summary>``ConfigurationSetEventDestinationResource.DimensionConfigurationProperty.DimensionValueSource``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationseteventdestination-dimensionconfiguration.html#cfn-ses-configurationseteventdestination-dimensionconfiguration-dimensionvaluesource </remarks>
        [JsiiProperty("dimensionValueSource", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object DimensionValueSource
        {
            get;
            set;
        }
    }
}
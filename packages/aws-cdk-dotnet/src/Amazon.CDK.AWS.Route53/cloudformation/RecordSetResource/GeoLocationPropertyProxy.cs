using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Route53.cloudformation.RecordSetResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-recordset-geolocation.html </remarks>
    [JsiiInterfaceProxy(typeof(IGeoLocationProperty), "@aws-cdk/aws-route53.cloudformation.RecordSetResource.GeoLocationProperty")]
    internal class GeoLocationPropertyProxy : DeputyBase, Amazon.CDK.AWS.Route53.cloudformation.RecordSetResource.IGeoLocationProperty
    {
        private GeoLocationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``RecordSetResource.GeoLocationProperty.ContinentCode``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-recordset-geolocation.html#cfn-route53-recordset-geolocation-continentcode </remarks>
        [JsiiProperty("continentCode", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ContinentCode
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``RecordSetResource.GeoLocationProperty.CountryCode``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-recordset-geolocation.html#cfn-route53-recordset-geolocation-countrycode </remarks>
        [JsiiProperty("countryCode", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object CountryCode
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``RecordSetResource.GeoLocationProperty.SubdivisionCode``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-recordset-geolocation.html#cfn-route53-recordset-geolocation-subdivisioncode </remarks>
        [JsiiProperty("subdivisionCode", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object SubdivisionCode
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
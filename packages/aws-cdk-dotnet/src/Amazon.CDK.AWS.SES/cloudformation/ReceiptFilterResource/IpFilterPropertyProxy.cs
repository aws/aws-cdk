using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SES.cloudformation.ReceiptFilterResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptfilter-ipfilter.html </remarks>
    [JsiiInterfaceProxy(typeof(IIpFilterProperty), "@aws-cdk/aws-ses.cloudformation.ReceiptFilterResource.IpFilterProperty")]
    internal class IpFilterPropertyProxy : DeputyBase, IIpFilterProperty
    {
        private IpFilterPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ReceiptFilterResource.IpFilterProperty.Cidr``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptfilter-ipfilter.html#cfn-ses-receiptfilter-ipfilter-cidr </remarks>
        [JsiiProperty("cidr", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Cidr
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ReceiptFilterResource.IpFilterProperty.Policy``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptfilter-ipfilter.html#cfn-ses-receiptfilter-ipfilter-policy </remarks>
        [JsiiProperty("policy", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Policy
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
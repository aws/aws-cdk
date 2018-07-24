using Amazon.CDK;
using Amazon.CDK.AWS.WAFRegional.cloudformation.IPSetResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.WAFRegional.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-ipset.html </remarks>
    [JsiiInterfaceProxy(typeof(IIPSetResourceProps), "@aws-cdk/aws-wafregional.cloudformation.IPSetResourceProps")]
    internal class IPSetResourcePropsProxy : DeputyBase, IIPSetResourceProps
    {
        private IPSetResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::WAFRegional::IPSet.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-ipset.html#cfn-wafregional-ipset-name </remarks>
        [JsiiProperty("ipSetName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object IpSetName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::WAFRegional::IPSet.IPSetDescriptors``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-ipset.html#cfn-wafregional-ipset-ipsetdescriptors </remarks>
        [JsiiProperty("ipSetDescriptors", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-wafregional.cloudformation.IPSetResource.IPSetDescriptorProperty\"}]}}}}]},\"optional\":true}")]
        public virtual object IpSetDescriptors
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
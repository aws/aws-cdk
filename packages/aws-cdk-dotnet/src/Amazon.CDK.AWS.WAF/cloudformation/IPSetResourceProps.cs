using Amazon.CDK;
using Amazon.CDK.AWS.WAF.cloudformation.IPSetResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.WAF.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-ipset.html </remarks>
    public class IPSetResourceProps : DeputyBase, IIPSetResourceProps
    {
        /// <summary>``AWS::WAF::IPSet.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-ipset.html#cfn-waf-ipset-name </remarks>
        [JsiiProperty("ipSetName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object IpSetName
        {
            get;
            set;
        }

        /// <summary>``AWS::WAF::IPSet.IPSetDescriptors``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-ipset.html#cfn-waf-ipset-ipsetdescriptors </remarks>
        [JsiiProperty("ipSetDescriptors", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-waf.cloudformation.IPSetResource.IPSetDescriptorProperty\"}]}}}}]},\"optional\":true}", true)]
        public object IpSetDescriptors
        {
            get;
            set;
        }
    }
}
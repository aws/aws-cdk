using Amazon.CDK;
using Amazon.CDK.AWS.WAFRegional.cloudformation.IPSetResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.WAFRegional.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-ipset.html </remarks>
    [JsiiInterface(typeof(IIPSetResourceProps), "@aws-cdk/aws-wafregional.cloudformation.IPSetResourceProps")]
    public interface IIPSetResourceProps
    {
        /// <summary>``AWS::WAFRegional::IPSet.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-ipset.html#cfn-wafregional-ipset-name </remarks>
        [JsiiProperty("ipSetName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object IpSetName
        {
            get;
            set;
        }

        /// <summary>``AWS::WAFRegional::IPSet.IPSetDescriptors``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-ipset.html#cfn-wafregional-ipset-ipsetdescriptors </remarks>
        [JsiiProperty("ipSetDescriptors", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-wafregional.cloudformation.IPSetResource.IPSetDescriptorProperty\"}]}}}}]},\"optional\":true}")]
        object IpSetDescriptors
        {
            get;
            set;
        }
    }
}
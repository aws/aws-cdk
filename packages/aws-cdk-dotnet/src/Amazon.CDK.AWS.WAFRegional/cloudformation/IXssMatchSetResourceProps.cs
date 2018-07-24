using Amazon.CDK;
using Amazon.CDK.AWS.WAFRegional.cloudformation.XssMatchSetResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.WAFRegional.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-xssmatchset.html </remarks>
    [JsiiInterface(typeof(IXssMatchSetResourceProps), "@aws-cdk/aws-wafregional.cloudformation.XssMatchSetResourceProps")]
    public interface IXssMatchSetResourceProps
    {
        /// <summary>``AWS::WAFRegional::XssMatchSet.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-xssmatchset.html#cfn-wafregional-xssmatchset-name </remarks>
        [JsiiProperty("xssMatchSetName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object XssMatchSetName
        {
            get;
            set;
        }

        /// <summary>``AWS::WAFRegional::XssMatchSet.XssMatchTuples``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-xssmatchset.html#cfn-wafregional-xssmatchset-xssmatchtuples </remarks>
        [JsiiProperty("xssMatchTuples", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-wafregional.cloudformation.XssMatchSetResource.XssMatchTupleProperty\"}]}}}}]},\"optional\":true}")]
        object XssMatchTuples
        {
            get;
            set;
        }
    }
}
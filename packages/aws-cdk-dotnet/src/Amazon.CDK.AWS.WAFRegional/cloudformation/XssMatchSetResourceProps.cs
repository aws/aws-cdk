using Amazon.CDK;
using Amazon.CDK.AWS.WAFRegional.cloudformation.XssMatchSetResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.WAFRegional.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-xssmatchset.html </remarks>
    public class XssMatchSetResourceProps : DeputyBase, IXssMatchSetResourceProps
    {
        /// <summary>``AWS::WAFRegional::XssMatchSet.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-xssmatchset.html#cfn-wafregional-xssmatchset-name </remarks>
        [JsiiProperty("xssMatchSetName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object XssMatchSetName
        {
            get;
            set;
        }

        /// <summary>``AWS::WAFRegional::XssMatchSet.XssMatchTuples``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-xssmatchset.html#cfn-wafregional-xssmatchset-xssmatchtuples </remarks>
        [JsiiProperty("xssMatchTuples", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-wafregional.cloudformation.XssMatchSetResource.XssMatchTupleProperty\"}]}}}}]},\"optional\":true}", true)]
        public object XssMatchTuples
        {
            get;
            set;
        }
    }
}
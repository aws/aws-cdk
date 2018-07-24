using Amazon.CDK;
using Amazon.CDK.AWS.WAF.cloudformation.XssMatchSetResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.WAF.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-xssmatchset.html </remarks>
    public class XssMatchSetResourceProps : DeputyBase, IXssMatchSetResourceProps
    {
        /// <summary>``AWS::WAF::XssMatchSet.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-xssmatchset.html#cfn-waf-xssmatchset-name </remarks>
        [JsiiProperty("xssMatchSetName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object XssMatchSetName
        {
            get;
            set;
        }

        /// <summary>``AWS::WAF::XssMatchSet.XssMatchTuples``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-xssmatchset.html#cfn-waf-xssmatchset-xssmatchtuples </remarks>
        [JsiiProperty("xssMatchTuples", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-waf.cloudformation.XssMatchSetResource.XssMatchTupleProperty\"}]}}}}]}}", true)]
        public object XssMatchTuples
        {
            get;
            set;
        }
    }
}
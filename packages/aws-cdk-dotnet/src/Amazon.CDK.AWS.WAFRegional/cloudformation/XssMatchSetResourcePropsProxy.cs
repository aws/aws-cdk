using Amazon.CDK;
using Amazon.CDK.AWS.WAFRegional.cloudformation.XssMatchSetResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.WAFRegional.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-xssmatchset.html </remarks>
    [JsiiInterfaceProxy(typeof(IXssMatchSetResourceProps), "@aws-cdk/aws-wafregional.cloudformation.XssMatchSetResourceProps")]
    internal class XssMatchSetResourcePropsProxy : DeputyBase, IXssMatchSetResourceProps
    {
        private XssMatchSetResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::WAFRegional::XssMatchSet.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-xssmatchset.html#cfn-wafregional-xssmatchset-name </remarks>
        [JsiiProperty("xssMatchSetName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object XssMatchSetName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::WAFRegional::XssMatchSet.XssMatchTuples``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-xssmatchset.html#cfn-wafregional-xssmatchset-xssmatchtuples </remarks>
        [JsiiProperty("xssMatchTuples", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-wafregional.cloudformation.XssMatchSetResource.XssMatchTupleProperty\"}]}}}}]},\"optional\":true}")]
        public virtual object XssMatchTuples
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
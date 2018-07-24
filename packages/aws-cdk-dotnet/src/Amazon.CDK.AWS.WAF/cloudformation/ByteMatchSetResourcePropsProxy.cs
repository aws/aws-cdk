using Amazon.CDK;
using Amazon.CDK.AWS.WAF.cloudformation.ByteMatchSetResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.WAF.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-bytematchset.html </remarks>
    [JsiiInterfaceProxy(typeof(IByteMatchSetResourceProps), "@aws-cdk/aws-waf.cloudformation.ByteMatchSetResourceProps")]
    internal class ByteMatchSetResourcePropsProxy : DeputyBase, IByteMatchSetResourceProps
    {
        private ByteMatchSetResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::WAF::ByteMatchSet.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-bytematchset.html#cfn-waf-bytematchset-name </remarks>
        [JsiiProperty("byteMatchSetName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object ByteMatchSetName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::WAF::ByteMatchSet.ByteMatchTuples``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-bytematchset.html#cfn-waf-bytematchset-bytematchtuples </remarks>
        [JsiiProperty("byteMatchTuples", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-waf.cloudformation.ByteMatchSetResource.ByteMatchTupleProperty\"}]}}}}]},\"optional\":true}")]
        public virtual object ByteMatchTuples
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
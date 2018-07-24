using Amazon.CDK;
using Amazon.CDK.AWS.WAFRegional.cloudformation.ByteMatchSetResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.WAFRegional.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-bytematchset.html </remarks>
    [JsiiInterfaceProxy(typeof(IByteMatchSetResourceProps), "@aws-cdk/aws-wafregional.cloudformation.ByteMatchSetResourceProps")]
    internal class ByteMatchSetResourcePropsProxy : DeputyBase, IByteMatchSetResourceProps
    {
        private ByteMatchSetResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::WAFRegional::ByteMatchSet.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-bytematchset.html#cfn-wafregional-bytematchset-name </remarks>
        [JsiiProperty("byteMatchSetName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object ByteMatchSetName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::WAFRegional::ByteMatchSet.ByteMatchTuples``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-bytematchset.html#cfn-wafregional-bytematchset-bytematchtuples </remarks>
        [JsiiProperty("byteMatchTuples", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-wafregional.cloudformation.ByteMatchSetResource.ByteMatchTupleProperty\"}]}}}}]},\"optional\":true}")]
        public virtual object ByteMatchTuples
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
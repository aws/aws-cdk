using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.WAFRegional.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-webaclassociation.html </remarks>
    [JsiiInterfaceProxy(typeof(IWebACLAssociationResourceProps), "@aws-cdk/aws-wafregional.cloudformation.WebACLAssociationResourceProps")]
    internal class WebACLAssociationResourcePropsProxy : DeputyBase, IWebACLAssociationResourceProps
    {
        private WebACLAssociationResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::WAFRegional::WebACLAssociation.ResourceArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-webaclassociation.html#cfn-wafregional-webaclassociation-resourcearn </remarks>
        [JsiiProperty("resourceArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object ResourceArn
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::WAFRegional::WebACLAssociation.WebACLId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-webaclassociation.html#cfn-wafregional-webaclassociation-webaclid </remarks>
        [JsiiProperty("webAclId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object WebAclId
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.WAF.cloudformation.WebACLResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-webacl-action.html </remarks>
    [JsiiInterfaceProxy(typeof(IWafActionProperty), "@aws-cdk/aws-waf.cloudformation.WebACLResource.WafActionProperty")]
    internal class WafActionPropertyProxy : DeputyBase, IWafActionProperty
    {
        private WafActionPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``WebACLResource.WafActionProperty.Type``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-webacl-action.html#cfn-waf-webacl-action-type </remarks>
        [JsiiProperty("type", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Type
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
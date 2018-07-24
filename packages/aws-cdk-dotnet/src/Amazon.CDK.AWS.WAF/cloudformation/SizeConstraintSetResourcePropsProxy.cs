using Amazon.CDK;
using Amazon.CDK.AWS.WAF.cloudformation.SizeConstraintSetResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.WAF.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-sizeconstraintset.html </remarks>
    [JsiiInterfaceProxy(typeof(ISizeConstraintSetResourceProps), "@aws-cdk/aws-waf.cloudformation.SizeConstraintSetResourceProps")]
    internal class SizeConstraintSetResourcePropsProxy : DeputyBase, ISizeConstraintSetResourceProps
    {
        private SizeConstraintSetResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::WAF::SizeConstraintSet.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-sizeconstraintset.html#cfn-waf-sizeconstraintset-name </remarks>
        [JsiiProperty("sizeConstraintSetName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object SizeConstraintSetName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::WAF::SizeConstraintSet.SizeConstraints``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-sizeconstraintset.html#cfn-waf-sizeconstraintset-sizeconstraints </remarks>
        [JsiiProperty("sizeConstraints", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-waf.cloudformation.SizeConstraintSetResource.SizeConstraintProperty\"}]}}}}]}}")]
        public virtual object SizeConstraints
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
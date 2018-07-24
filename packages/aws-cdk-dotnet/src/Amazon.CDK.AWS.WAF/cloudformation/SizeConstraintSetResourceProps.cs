using Amazon.CDK;
using Amazon.CDK.AWS.WAF.cloudformation.SizeConstraintSetResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.WAF.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-sizeconstraintset.html </remarks>
    public class SizeConstraintSetResourceProps : DeputyBase, ISizeConstraintSetResourceProps
    {
        /// <summary>``AWS::WAF::SizeConstraintSet.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-sizeconstraintset.html#cfn-waf-sizeconstraintset-name </remarks>
        [JsiiProperty("sizeConstraintSetName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object SizeConstraintSetName
        {
            get;
            set;
        }

        /// <summary>``AWS::WAF::SizeConstraintSet.SizeConstraints``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-sizeconstraintset.html#cfn-waf-sizeconstraintset-sizeconstraints </remarks>
        [JsiiProperty("sizeConstraints", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-waf.cloudformation.SizeConstraintSetResource.SizeConstraintProperty\"}]}}}}]}}", true)]
        public object SizeConstraints
        {
            get;
            set;
        }
    }
}
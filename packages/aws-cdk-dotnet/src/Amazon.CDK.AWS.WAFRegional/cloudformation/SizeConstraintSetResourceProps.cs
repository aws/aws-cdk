using Amazon.CDK;
using Amazon.CDK.AWS.WAFRegional.cloudformation.SizeConstraintSetResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.WAFRegional.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-sizeconstraintset.html </remarks>
    public class SizeConstraintSetResourceProps : DeputyBase, ISizeConstraintSetResourceProps
    {
        /// <summary>``AWS::WAFRegional::SizeConstraintSet.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-sizeconstraintset.html#cfn-wafregional-sizeconstraintset-name </remarks>
        [JsiiProperty("sizeConstraintSetName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object SizeConstraintSetName
        {
            get;
            set;
        }

        /// <summary>``AWS::WAFRegional::SizeConstraintSet.SizeConstraints``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-sizeconstraintset.html#cfn-wafregional-sizeconstraintset-sizeconstraints </remarks>
        [JsiiProperty("sizeConstraints", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-wafregional.cloudformation.SizeConstraintSetResource.SizeConstraintProperty\"}]}}}}]},\"optional\":true}", true)]
        public object SizeConstraints
        {
            get;
            set;
        }
    }
}
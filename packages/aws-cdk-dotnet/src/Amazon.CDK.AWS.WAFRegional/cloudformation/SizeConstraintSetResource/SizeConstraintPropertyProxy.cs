using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.WAFRegional.cloudformation.SizeConstraintSetResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sizeconstraintset-sizeconstraint.html </remarks>
    [JsiiInterfaceProxy(typeof(ISizeConstraintProperty), "@aws-cdk/aws-wafregional.cloudformation.SizeConstraintSetResource.SizeConstraintProperty")]
    internal class SizeConstraintPropertyProxy : DeputyBase, ISizeConstraintProperty
    {
        private SizeConstraintPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``SizeConstraintSetResource.SizeConstraintProperty.ComparisonOperator``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sizeconstraintset-sizeconstraint.html#cfn-wafregional-sizeconstraintset-sizeconstraint-comparisonoperator </remarks>
        [JsiiProperty("comparisonOperator", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object ComparisonOperator
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``SizeConstraintSetResource.SizeConstraintProperty.FieldToMatch``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sizeconstraintset-sizeconstraint.html#cfn-wafregional-sizeconstraintset-sizeconstraint-fieldtomatch </remarks>
        [JsiiProperty("fieldToMatch", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-wafregional.cloudformation.SizeConstraintSetResource.FieldToMatchProperty\"}]}}")]
        public virtual object FieldToMatch
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``SizeConstraintSetResource.SizeConstraintProperty.Size``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sizeconstraintset-sizeconstraint.html#cfn-wafregional-sizeconstraintset-sizeconstraint-size </remarks>
        [JsiiProperty("size", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Size
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``SizeConstraintSetResource.SizeConstraintProperty.TextTransformation``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sizeconstraintset-sizeconstraint.html#cfn-wafregional-sizeconstraintset-sizeconstraint-texttransformation </remarks>
        [JsiiProperty("textTransformation", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object TextTransformation
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
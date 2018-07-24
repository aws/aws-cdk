using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.WAF.cloudformation.SizeConstraintSetResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-sizeconstraintset-sizeconstraint-fieldtomatch.html </remarks>
    [JsiiInterfaceProxy(typeof(IFieldToMatchProperty), "@aws-cdk/aws-waf.cloudformation.SizeConstraintSetResource.FieldToMatchProperty")]
    internal class FieldToMatchPropertyProxy : DeputyBase, Amazon.CDK.AWS.WAF.cloudformation.SizeConstraintSetResource.IFieldToMatchProperty
    {
        private FieldToMatchPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``SizeConstraintSetResource.FieldToMatchProperty.Data``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-sizeconstraintset-sizeconstraint-fieldtomatch.html#cfn-waf-sizeconstraintset-sizeconstraint-fieldtomatch-data </remarks>
        [JsiiProperty("data", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Data
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``SizeConstraintSetResource.FieldToMatchProperty.Type``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-sizeconstraintset-sizeconstraint-fieldtomatch.html#cfn-waf-sizeconstraintset-sizeconstraint-fieldtomatch-type </remarks>
        [JsiiProperty("type", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Type
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
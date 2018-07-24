using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Glue.cloudformation.TriggerResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-predicate.html </remarks>
    [JsiiInterfaceProxy(typeof(IPredicateProperty), "@aws-cdk/aws-glue.cloudformation.TriggerResource.PredicateProperty")]
    internal class PredicatePropertyProxy : DeputyBase, IPredicateProperty
    {
        private PredicatePropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``TriggerResource.PredicateProperty.Conditions``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-predicate.html#cfn-glue-trigger-predicate-conditions </remarks>
        [JsiiProperty("conditions", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-glue.cloudformation.TriggerResource.ConditionProperty\"}]}}}}]},\"optional\":true}")]
        public virtual object Conditions
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``TriggerResource.PredicateProperty.Logical``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-predicate.html#cfn-glue-trigger-predicate-logical </remarks>
        [JsiiProperty("logical", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Logical
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
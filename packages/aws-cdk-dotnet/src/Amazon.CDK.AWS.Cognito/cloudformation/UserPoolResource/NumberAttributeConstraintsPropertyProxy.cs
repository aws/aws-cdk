using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Cognito.cloudformation.UserPoolResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-numberattributeconstraints.html </remarks>
    [JsiiInterfaceProxy(typeof(INumberAttributeConstraintsProperty), "@aws-cdk/aws-cognito.cloudformation.UserPoolResource.NumberAttributeConstraintsProperty")]
    internal class NumberAttributeConstraintsPropertyProxy : DeputyBase, INumberAttributeConstraintsProperty
    {
        private NumberAttributeConstraintsPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``UserPoolResource.NumberAttributeConstraintsProperty.MaxValue``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-numberattributeconstraints.html#cfn-cognito-userpool-numberattributeconstraints-maxvalue </remarks>
        [JsiiProperty("maxValue", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object MaxValue
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``UserPoolResource.NumberAttributeConstraintsProperty.MinValue``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-numberattributeconstraints.html#cfn-cognito-userpool-numberattributeconstraints-minvalue </remarks>
        [JsiiProperty("minValue", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object MinValue
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Cognito.cloudformation.UserPoolResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-stringattributeconstraints.html </remarks>
    [JsiiInterfaceProxy(typeof(IStringAttributeConstraintsProperty), "@aws-cdk/aws-cognito.cloudformation.UserPoolResource.StringAttributeConstraintsProperty")]
    internal class StringAttributeConstraintsPropertyProxy : DeputyBase, IStringAttributeConstraintsProperty
    {
        private StringAttributeConstraintsPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``UserPoolResource.StringAttributeConstraintsProperty.MaxLength``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-stringattributeconstraints.html#cfn-cognito-userpool-stringattributeconstraints-maxlength </remarks>
        [JsiiProperty("maxLength", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object MaxLength
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``UserPoolResource.StringAttributeConstraintsProperty.MinLength``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-stringattributeconstraints.html#cfn-cognito-userpool-stringattributeconstraints-minlength </remarks>
        [JsiiProperty("minLength", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object MinLength
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
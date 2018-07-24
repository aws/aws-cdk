using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Cognito.cloudformation.UserPoolResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-stringattributeconstraints.html </remarks>
    [JsiiInterface(typeof(IStringAttributeConstraintsProperty), "@aws-cdk/aws-cognito.cloudformation.UserPoolResource.StringAttributeConstraintsProperty")]
    public interface IStringAttributeConstraintsProperty
    {
        /// <summary>``UserPoolResource.StringAttributeConstraintsProperty.MaxLength``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-stringattributeconstraints.html#cfn-cognito-userpool-stringattributeconstraints-maxlength </remarks>
        [JsiiProperty("maxLength", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object MaxLength
        {
            get;
            set;
        }

        /// <summary>``UserPoolResource.StringAttributeConstraintsProperty.MinLength``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-stringattributeconstraints.html#cfn-cognito-userpool-stringattributeconstraints-minlength </remarks>
        [JsiiProperty("minLength", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object MinLength
        {
            get;
            set;
        }
    }
}
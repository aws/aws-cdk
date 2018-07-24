using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Cognito.cloudformation.UserPoolResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-policies.html </remarks>
    [JsiiInterfaceProxy(typeof(IPoliciesProperty), "@aws-cdk/aws-cognito.cloudformation.UserPoolResource.PoliciesProperty")]
    internal class PoliciesPropertyProxy : DeputyBase, IPoliciesProperty
    {
        private PoliciesPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``UserPoolResource.PoliciesProperty.PasswordPolicy``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-policies.html#cfn-cognito-userpool-policies-passwordpolicy </remarks>
        [JsiiProperty("passwordPolicy", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cognito.cloudformation.UserPoolResource.PasswordPolicyProperty\"}]},\"optional\":true}")]
        public virtual object PasswordPolicy
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
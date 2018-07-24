using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.IAM.cloudformation.UserResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iam-user-loginprofile.html </remarks>
    [JsiiInterfaceProxy(typeof(ILoginProfileProperty), "@aws-cdk/aws-iam.cloudformation.UserResource.LoginProfileProperty")]
    internal class LoginProfilePropertyProxy : DeputyBase, ILoginProfileProperty
    {
        private LoginProfilePropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``UserResource.LoginProfileProperty.Password``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iam-user-loginprofile.html#cfn-iam-user-loginprofile-password </remarks>
        [JsiiProperty("password", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Password
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``UserResource.LoginProfileProperty.PasswordResetRequired``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iam-user-loginprofile.html#cfn-iam-user-loginprofile-passwordresetrequired </remarks>
        [JsiiProperty("passwordResetRequired", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object PasswordResetRequired
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
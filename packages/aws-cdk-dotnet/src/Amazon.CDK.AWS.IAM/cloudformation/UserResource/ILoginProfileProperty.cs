using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.IAM.cloudformation.UserResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iam-user-loginprofile.html </remarks>
    [JsiiInterface(typeof(ILoginProfileProperty), "@aws-cdk/aws-iam.cloudformation.UserResource.LoginProfileProperty")]
    public interface ILoginProfileProperty
    {
        /// <summary>``UserResource.LoginProfileProperty.Password``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iam-user-loginprofile.html#cfn-iam-user-loginprofile-password </remarks>
        [JsiiProperty("password", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Password
        {
            get;
            set;
        }

        /// <summary>``UserResource.LoginProfileProperty.PasswordResetRequired``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iam-user-loginprofile.html#cfn-iam-user-loginprofile-passwordresetrequired </remarks>
        [JsiiProperty("passwordResetRequired", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object PasswordResetRequired
        {
            get;
            set;
        }
    }
}
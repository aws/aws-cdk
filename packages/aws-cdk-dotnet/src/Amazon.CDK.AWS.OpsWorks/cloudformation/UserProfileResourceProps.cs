using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.OpsWorks.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-userprofile.html </remarks>
    public class UserProfileResourceProps : DeputyBase, IUserProfileResourceProps
    {
        /// <summary>``AWS::OpsWorks::UserProfile.IamUserArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-userprofile.html#cfn-opsworks-userprofile-iamuserarn </remarks>
        [JsiiProperty("iamUserArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object IamUserArn
        {
            get;
            set;
        }

        /// <summary>``AWS::OpsWorks::UserProfile.AllowSelfManagement``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-userprofile.html#cfn-opsworks-userprofile-allowselfmanagement </remarks>
        [JsiiProperty("allowSelfManagement", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object AllowSelfManagement
        {
            get;
            set;
        }

        /// <summary>``AWS::OpsWorks::UserProfile.SshPublicKey``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-userprofile.html#cfn-opsworks-userprofile-sshpublickey </remarks>
        [JsiiProperty("sshPublicKey", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object SshPublicKey
        {
            get;
            set;
        }

        /// <summary>``AWS::OpsWorks::UserProfile.SshUsername``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-userprofile.html#cfn-opsworks-userprofile-sshusername </remarks>
        [JsiiProperty("sshUsername", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object SshUsername
        {
            get;
            set;
        }
    }
}
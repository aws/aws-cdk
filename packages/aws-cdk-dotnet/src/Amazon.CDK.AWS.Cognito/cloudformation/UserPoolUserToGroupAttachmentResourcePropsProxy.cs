using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Cognito.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolusertogroupattachment.html </remarks>
    [JsiiInterfaceProxy(typeof(IUserPoolUserToGroupAttachmentResourceProps), "@aws-cdk/aws-cognito.cloudformation.UserPoolUserToGroupAttachmentResourceProps")]
    internal class UserPoolUserToGroupAttachmentResourcePropsProxy : DeputyBase, IUserPoolUserToGroupAttachmentResourceProps
    {
        private UserPoolUserToGroupAttachmentResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::Cognito::UserPoolUserToGroupAttachment.GroupName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolusertogroupattachment.html#cfn-cognito-userpoolusertogroupattachment-groupname </remarks>
        [JsiiProperty("groupName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object GroupName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::Cognito::UserPoolUserToGroupAttachment.Username``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolusertogroupattachment.html#cfn-cognito-userpoolusertogroupattachment-username </remarks>
        [JsiiProperty("username", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Username
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::Cognito::UserPoolUserToGroupAttachment.UserPoolId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolusertogroupattachment.html#cfn-cognito-userpoolusertogroupattachment-userpoolid </remarks>
        [JsiiProperty("userPoolId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object UserPoolId
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
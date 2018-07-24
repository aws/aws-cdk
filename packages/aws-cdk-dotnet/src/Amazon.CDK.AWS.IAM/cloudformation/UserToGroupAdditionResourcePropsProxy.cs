using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.IAM.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iam-addusertogroup.html </remarks>
    [JsiiInterfaceProxy(typeof(IUserToGroupAdditionResourceProps), "@aws-cdk/aws-iam.cloudformation.UserToGroupAdditionResourceProps")]
    internal class UserToGroupAdditionResourcePropsProxy : DeputyBase, IUserToGroupAdditionResourceProps
    {
        private UserToGroupAdditionResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::IAM::UserToGroupAddition.GroupName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iam-addusertogroup.html#cfn-iam-addusertogroup-groupname </remarks>
        [JsiiProperty("groupName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object GroupName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::IAM::UserToGroupAddition.Users``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iam-addusertogroup.html#cfn-iam-addusertogroup-users </remarks>
        [JsiiProperty("users", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]}}")]
        public virtual object Users
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
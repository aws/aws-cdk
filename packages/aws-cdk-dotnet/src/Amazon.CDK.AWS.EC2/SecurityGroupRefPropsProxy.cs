using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    [JsiiInterfaceProxy(typeof(ISecurityGroupRefProps), "@aws-cdk/aws-ec2.SecurityGroupRefProps")]
    internal class SecurityGroupRefPropsProxy : DeputyBase, ISecurityGroupRefProps
    {
        private SecurityGroupRefPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>ID of security group</summary>
        [JsiiProperty("securityGroupId", "{\"fqn\":\"@aws-cdk/aws-ec2.SecurityGroupId\"}")]
        public virtual SecurityGroupId SecurityGroupId
        {
            get => GetInstanceProperty<SecurityGroupId>();
            set => SetInstanceProperty(value);
        }
    }
}
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    public class SecurityGroupRefProps : DeputyBase, ISecurityGroupRefProps
    {
        /// <summary>ID of security group</summary>
        [JsiiProperty("securityGroupId", "{\"fqn\":\"@aws-cdk/aws-ec2.SecurityGroupId\"}", true)]
        public SecurityGroupId SecurityGroupId
        {
            get;
            set;
        }
    }
}
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    [JsiiInterface(typeof(ISecurityGroupRefProps), "@aws-cdk/aws-ec2.SecurityGroupRefProps")]
    public interface ISecurityGroupRefProps
    {
        /// <summary>ID of security group</summary>
        [JsiiProperty("securityGroupId", "{\"fqn\":\"@aws-cdk/aws-ec2.SecurityGroupId\"}")]
        SecurityGroupId SecurityGroupId
        {
            get;
            set;
        }
    }
}
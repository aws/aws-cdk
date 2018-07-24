using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    public class SecurityGroupProps : DeputyBase, ISecurityGroupProps
    {
        /// <summary>
        /// The name of the security group. For valid values, see the GroupName
        /// parameter of the CreateSecurityGroup action in the Amazon EC2 API
        /// Reference.
        /// 
        /// It is not recommended to use an explicit group name.
        /// </summary>
        /// <remarks>
        /// default: If you don't specify a GroupName, AWS CloudFormation generates a
        /// unique physical ID and uses that ID for the group name.
        /// </remarks>
        [JsiiProperty("groupName", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string GroupName
        {
            get;
            set;
        }

        /// <summary>A description of the security group.</summary>
        /// <remarks>default: The default name will be the construct's CDK path.</remarks>
        [JsiiProperty("description", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string Description
        {
            get;
            set;
        }

        /// <summary>The VPC in which to create the security group.</summary>
        [JsiiProperty("vpc", "{\"fqn\":\"@aws-cdk/aws-ec2.VpcNetworkRef\"}", true)]
        public VpcNetworkRef Vpc
        {
            get;
            set;
        }
    }
}
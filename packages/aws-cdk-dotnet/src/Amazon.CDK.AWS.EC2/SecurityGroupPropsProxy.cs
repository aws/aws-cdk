using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    [JsiiInterfaceProxy(typeof(ISecurityGroupProps), "@aws-cdk/aws-ec2.SecurityGroupProps")]
    internal class SecurityGroupPropsProxy : DeputyBase, ISecurityGroupProps
    {
        private SecurityGroupPropsProxy(ByRefValue reference): base(reference)
        {
        }

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
        [JsiiProperty("groupName", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string GroupName
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>A description of the security group.</summary>
        /// <remarks>default: The default name will be the construct's CDK path.</remarks>
        [JsiiProperty("description", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string Description
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The VPC in which to create the security group.</summary>
        [JsiiProperty("vpc", "{\"fqn\":\"@aws-cdk/aws-ec2.VpcNetworkRef\"}")]
        public virtual VpcNetworkRef Vpc
        {
            get => GetInstanceProperty<VpcNetworkRef>();
            set => SetInstanceProperty(value);
        }
    }
}
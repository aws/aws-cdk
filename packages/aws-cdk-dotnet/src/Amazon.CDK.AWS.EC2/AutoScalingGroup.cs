using Amazon.CDK;
using Amazon.CDK.AWS.IAM;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>
    /// A Fleet represents a managed set of EC2 instances
    /// 
    /// The Fleet models a number of AutoScalingGroups, a launch configuration, a
    /// security group and an instance role.
    /// 
    /// It allows adding arbitrary commands to the startup scripts of the instances
    /// in the fleet.
    /// 
    /// The ASG spans all availability zones.
    /// </summary>
    [JsiiClass(typeof(AutoScalingGroup), "@aws-cdk/aws-ec2.AutoScalingGroup", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.AutoScalingGroupProps\"}}]")]
    public class AutoScalingGroup : Construct, IIClassicLoadBalancerTarget
    {
        public AutoScalingGroup(Construct parent, string name, IAutoScalingGroupProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected AutoScalingGroup(ByRefValue reference): base(reference)
        {
        }

        protected AutoScalingGroup(DeputyProps props): base(props)
        {
        }

        [JsiiProperty("connectionPeer", "{\"fqn\":\"@aws-cdk/aws-ec2.IConnectionPeer\"}")]
        public virtual IIConnectionPeer ConnectionPeer
        {
            get => GetInstanceProperty<IIConnectionPeer>();
        }

        /// <summary>The type of OS instances of this fleet are running.</summary>
        [JsiiProperty("osType", "{\"fqn\":\"@aws-cdk/aws-ec2.OperatingSystemType\"}")]
        public virtual OperatingSystemType OsType
        {
            get => GetInstanceProperty<OperatingSystemType>();
        }

        /// <summary>Allows specify security group connections for instances of this fleet.</summary>
        [JsiiProperty("connections", "{\"fqn\":\"@aws-cdk/aws-ec2.IConnections\"}")]
        public virtual IIConnections Connections
        {
            get => GetInstanceProperty<IIConnections>();
        }

        /// <summary>The IAM role assumed by instances of this fleet.</summary>
        [JsiiProperty("role", "{\"fqn\":\"@aws-cdk/aws-iam.Role\"}")]
        public virtual Role Role
        {
            get => GetInstanceProperty<Role>();
        }

        /// <summary>Attach load-balanced target to a classic ELB</summary>
        [JsiiMethod("attachToClassicLB", null, "[{\"name\":\"loadBalancer\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.ClassicLoadBalancer\"}}]")]
        public virtual void AttachToClassicLB(ClassicLoadBalancer loadBalancer)
        {
            InvokeInstanceVoidMethod(new object[]{loadBalancer});
        }

        /// <summary>
        /// Add command to the startup script of fleet instances.
        /// The command must be in the scripting language supported by the fleet's OS (i.e. Linux/Windows).
        /// </summary>
        [JsiiMethod("addUserData", null, "[{\"name\":\"script\",\"type\":{\"primitive\":\"string\"}}]")]
        public virtual void AddUserData(string script)
        {
            InvokeInstanceVoidMethod(new object[]{script});
        }

        [JsiiMethod("autoScalingGroupName", "{\"fqn\":\"@aws-cdk/cdk.Token\"}", "[]")]
        public virtual Token AutoScalingGroupName()
        {
            return InvokeInstanceMethod<Token>(new object[]{});
        }

        /// <summary>Adds a statement to the IAM role assumed by instances of this fleet.</summary>
        [JsiiMethod("addToRolePolicy", null, "[{\"name\":\"statement\",\"type\":{\"fqn\":\"@aws-cdk/cdk.PolicyStatement\"}}]")]
        public virtual void AddToRolePolicy(PolicyStatement statement)
        {
            InvokeInstanceVoidMethod(new object[]{statement});
        }
    }
}
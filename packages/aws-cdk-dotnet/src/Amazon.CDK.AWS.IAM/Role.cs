using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.IAM
{
    /// <summary>
    /// IAM Role
    /// 
    /// Defines an IAM role. The role is created with an assume policy document associated with
    /// the specified AWS service principal defined in `serviceAssumeRole`.
    /// </summary>
    [JsiiClass(typeof(Role), "@aws-cdk/aws-iam.Role", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-iam.RoleProps\"}}]")]
    public class Role : Construct, IIIdentityResource, IIDependable
    {
        public Role(Construct parent, string name, IRoleProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected Role(ByRefValue reference): base(reference)
        {
        }

        protected Role(DeputyProps props): base(props)
        {
        }

        /// <summary>The assume role policy document associated with this role.</summary>
        [JsiiProperty("assumeRolePolicy", "{\"fqn\":\"@aws-cdk/cdk.PolicyDocument\",\"optional\":true}")]
        public virtual PolicyDocument AssumeRolePolicy
        {
            get => GetInstanceProperty<PolicyDocument>();
        }

        /// <summary>Returns the ARN of this role.</summary>
        [JsiiProperty("roleArn", "{\"fqn\":\"@aws-cdk/aws-iam.RoleArn\"}")]
        public virtual RoleArn RoleArn
        {
            get => GetInstanceProperty<RoleArn>();
        }

        /// <summary>Returns the name of the role.</summary>
        [JsiiProperty("roleName", "{\"fqn\":\"@aws-cdk/aws-iam.RoleName\"}")]
        public virtual RoleName RoleName
        {
            get => GetInstanceProperty<RoleName>();
        }

        /// <summary>Returns the ARN of this role.</summary>
        [JsiiProperty("principal", "{\"fqn\":\"@aws-cdk/cdk.PolicyPrincipal\"}")]
        public virtual PolicyPrincipal Principal
        {
            get => GetInstanceProperty<PolicyPrincipal>();
        }

        /// <summary>Returns the role.</summary>
        [JsiiProperty("dependencyElements", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/cdk.IDependable\"}}}")]
        public virtual IIDependable[] DependencyElements
        {
            get => GetInstanceProperty<IIDependable[]>();
        }

        /// <summary>
        /// Adds a permission to the role's default policy document.
        /// If there is no default policy attached to this role, it will be created.
        /// </summary>
        [JsiiMethod("addToPolicy", null, "[{\"name\":\"statement\",\"type\":{\"fqn\":\"@aws-cdk/cdk.PolicyStatement\"}}]")]
        public virtual void AddToPolicy(PolicyStatement statement)
        {
            InvokeInstanceVoidMethod(new object[]{statement});
        }

        /// <summary>Attaches a managed policy to this role.</summary>
        /// <param name = "arn">The ARN of the managed policy to attach.</param>
        [JsiiMethod("attachManagedPolicy", null, "[{\"name\":\"arn\",\"type\":{\"primitive\":\"any\"}}]")]
        public virtual void AttachManagedPolicy(object arn)
        {
            InvokeInstanceVoidMethod(new object[]{arn});
        }

        /// <summary>Attaches a policy to this role.</summary>
        /// <param name = "policy">The policy to attach</param>
        [JsiiMethod("attachInlinePolicy", null, "[{\"name\":\"policy\",\"type\":{\"fqn\":\"@aws-cdk/aws-iam.Policy\"}}]")]
        public virtual void AttachInlinePolicy(Policy policy)
        {
            InvokeInstanceVoidMethod(new object[]{policy});
        }
    }
}
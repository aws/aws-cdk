using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.IAM
{
    /// <summary>
    /// The AWS::IAM::Policy resource associates an IAM policy with IAM users, roles,
    /// or groups. For more information about IAM policies, see [Overview of IAM
    /// Policies](http://docs.aws.amazon.com/IAM/latest/UserGuide/policies_overview.html)
    /// in the IAM User Guide guide.
    /// </summary>
    [JsiiClass(typeof(Policy), "@aws-cdk/aws-iam.Policy", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-iam.PolicyProps\",\"optional\":true}}]")]
    public class Policy : Construct, IIDependable
    {
        public Policy(Construct parent, string name, IPolicyProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected Policy(ByRefValue reference): base(reference)
        {
        }

        protected Policy(DeputyProps props): base(props)
        {
        }

        /// <summary>The policy document.</summary>
        [JsiiProperty("document", "{\"fqn\":\"@aws-cdk/cdk.PolicyDocument\"}")]
        public virtual PolicyDocument Document
        {
            get => GetInstanceProperty<PolicyDocument>();
        }

        /// <summary>The name of this policy.</summary>
        [JsiiProperty("policyName", "{\"primitive\":\"string\"}")]
        public virtual string PolicyName
        {
            get => GetInstanceProperty<string>();
        }

        /// <summary>Lists all the elements consumers should "depend-on".</summary>
        [JsiiProperty("dependencyElements", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/cdk.IDependable\"}}}")]
        public virtual IIDependable[] DependencyElements
        {
            get => GetInstanceProperty<IIDependable[]>();
        }

        /// <summary>Adds a statement to the policy document.</summary>
        [JsiiMethod("addStatement", null, "[{\"name\":\"statement\",\"type\":{\"fqn\":\"@aws-cdk/cdk.PolicyStatement\"}}]")]
        public virtual void AddStatement(PolicyStatement statement)
        {
            InvokeInstanceVoidMethod(new object[]{statement});
        }

        /// <summary>Attaches this policy to a user.</summary>
        [JsiiMethod("attachToUser", null, "[{\"name\":\"user\",\"type\":{\"fqn\":\"@aws-cdk/aws-iam.User\"}}]")]
        public virtual void AttachToUser(User user)
        {
            InvokeInstanceVoidMethod(new object[]{user});
        }

        /// <summary>Attaches this policy to a role.</summary>
        [JsiiMethod("attachToRole", null, "[{\"name\":\"role\",\"type\":{\"fqn\":\"@aws-cdk/aws-iam.Role\"}}]")]
        public virtual void AttachToRole(Role role)
        {
            InvokeInstanceVoidMethod(new object[]{role});
        }

        /// <summary>Attaches this policy to a group.</summary>
        [JsiiMethod("attachToGroup", null, "[{\"name\":\"group\",\"type\":{\"fqn\":\"@aws-cdk/aws-iam.Group\"}}]")]
        public virtual void AttachToGroup(Group group)
        {
            InvokeInstanceVoidMethod(new object[]{group});
        }

        /// <summary>
        /// This method can be implemented by derived constructs in order to perform
        /// validation logic. It is called on all constructs before synthesis.
        /// </summary>
        [JsiiMethod("validate", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}}}", "[]")]
        public override string[] Validate()
        {
            return InvokeInstanceMethod<string[]>(new object[]{});
        }
    }
}
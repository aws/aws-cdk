using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.IAM
{
    [JsiiClass(typeof(Group), "@aws-cdk/aws-iam.Group", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-iam.GroupProps\",\"optional\":true}}]")]
    public class Group : Construct, IIIdentityResource
    {
        public Group(Construct parent, string name, IGroupProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected Group(ByRefValue reference): base(reference)
        {
        }

        protected Group(DeputyProps props): base(props)
        {
        }

        /// <summary>The runtime name of this group.</summary>
        [JsiiProperty("groupName", "{\"fqn\":\"@aws-cdk/aws-iam.GroupName\"}")]
        public virtual GroupName GroupName
        {
            get => GetInstanceProperty<GroupName>();
        }

        /// <summary>The ARN of this group.</summary>
        [JsiiProperty("groupArn", "{\"fqn\":\"@aws-cdk/aws-iam.GroupArn\"}")]
        public virtual GroupArn GroupArn
        {
            get => GetInstanceProperty<GroupArn>();
        }

        /// <summary>An "AWS" policy principal that represents this group.</summary>
        [JsiiProperty("principal", "{\"fqn\":\"@aws-cdk/cdk.PolicyPrincipal\"}")]
        public virtual PolicyPrincipal Principal
        {
            get => GetInstanceProperty<PolicyPrincipal>();
        }

        /// <summary>Attaches a managed policy to this group.</summary>
        /// <param name = "arn">The ARN of the managed policy to attach.</param>
        [JsiiMethod("attachManagedPolicy", null, "[{\"name\":\"arn\",\"type\":{\"primitive\":\"any\"}}]")]
        public virtual void AttachManagedPolicy(object arn)
        {
            InvokeInstanceVoidMethod(new object[]{arn});
        }

        /// <summary>Attaches a policy to this group.</summary>
        /// <param name = "policy">The policy to attach.</param>
        [JsiiMethod("attachInlinePolicy", null, "[{\"name\":\"policy\",\"type\":{\"fqn\":\"@aws-cdk/aws-iam.Policy\"}}]")]
        public virtual void AttachInlinePolicy(Policy policy)
        {
            InvokeInstanceVoidMethod(new object[]{policy});
        }

        /// <summary>Adds a user to this group.</summary>
        [JsiiMethod("addUser", null, "[{\"name\":\"user\",\"type\":{\"fqn\":\"@aws-cdk/aws-iam.User\"}}]")]
        public virtual void AddUser(User user)
        {
            InvokeInstanceVoidMethod(new object[]{user});
        }

        /// <summary>Adds an IAM statement to the default policy.</summary>
        [JsiiMethod("addToPolicy", null, "[{\"name\":\"statement\",\"type\":{\"fqn\":\"@aws-cdk/cdk.PolicyStatement\"}}]")]
        public virtual void AddToPolicy(PolicyStatement statement)
        {
            InvokeInstanceVoidMethod(new object[]{statement});
        }
    }
}
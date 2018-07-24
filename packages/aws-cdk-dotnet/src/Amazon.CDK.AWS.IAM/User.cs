using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.IAM
{
    [JsiiClass(typeof(User), "@aws-cdk/aws-iam.User", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-iam.UserProps\",\"optional\":true}}]")]
    public class User : Construct, IIIdentityResource
    {
        public User(Construct parent, string name, IUserProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected User(ByRefValue reference): base(reference)
        {
        }

        protected User(DeputyProps props): base(props)
        {
        }

        /// <summary>An attribute that represents the user name.</summary>
        [JsiiProperty("userName", "{\"fqn\":\"@aws-cdk/aws-iam.UserName\"}")]
        public virtual UserName UserName
        {
            get => GetInstanceProperty<UserName>();
        }

        /// <summary>An attribute that represents the user's ARN.</summary>
        [JsiiProperty("userArn", "{\"fqn\":\"@aws-cdk/aws-iam.UserArn\"}")]
        public virtual UserArn UserArn
        {
            get => GetInstanceProperty<UserArn>();
        }

        /// <summary>Returns the ARN of this user.</summary>
        [JsiiProperty("principal", "{\"fqn\":\"@aws-cdk/cdk.PolicyPrincipal\"}")]
        public virtual PolicyPrincipal Principal
        {
            get => GetInstanceProperty<PolicyPrincipal>();
        }

        /// <summary>Adds this user to a group.</summary>
        [JsiiMethod("addToGroup", null, "[{\"name\":\"group\",\"type\":{\"fqn\":\"@aws-cdk/aws-iam.Group\"}}]")]
        public virtual void AddToGroup(Group group)
        {
            InvokeInstanceVoidMethod(new object[]{group});
        }

        /// <summary>Attaches a managed policy to the user.</summary>
        /// <param name = "arn">The ARN of the managed policy to attach.</param>
        [JsiiMethod("attachManagedPolicy", null, "[{\"name\":\"arn\",\"type\":{\"primitive\":\"any\"}}]")]
        public virtual void AttachManagedPolicy(object arn)
        {
            InvokeInstanceVoidMethod(new object[]{arn});
        }

        /// <summary>Attaches a policy to this user.</summary>
        [JsiiMethod("attachInlinePolicy", null, "[{\"name\":\"policy\",\"type\":{\"fqn\":\"@aws-cdk/aws-iam.Policy\"}}]")]
        public virtual void AttachInlinePolicy(Policy policy)
        {
            InvokeInstanceVoidMethod(new object[]{policy});
        }

        /// <summary>Adds an IAM statement to the default policy.</summary>
        [JsiiMethod("addToPolicy", null, "[{\"name\":\"statement\",\"type\":{\"fqn\":\"@aws-cdk/cdk.PolicyStatement\"}}]")]
        public virtual void AddToPolicy(PolicyStatement statement)
        {
            InvokeInstanceVoidMethod(new object[]{statement});
        }
    }
}
using Amazon.CDK;
using Amazon.CDK.AWS.IAM;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeBuild
{
    /// <summary>
    /// A CodeBuild project that is completely driven
    /// from CodePipeline (does not hot have its own input or output)
    /// </summary>
    [JsiiClass(typeof(BuildProject), "@aws-cdk/aws-codebuild.BuildProject", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-codebuild.BuildProjectProps\"}}]")]
    public class BuildProject : BuildProjectRef
    {
        public BuildProject(Construct parent, string name, IBuildProjectProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected BuildProject(ByRefValue reference): base(reference)
        {
        }

        protected BuildProject(DeputyProps props): base(props)
        {
        }

        /// <summary>The IAM role for this project.</summary>
        [JsiiProperty("role", "{\"fqn\":\"@aws-cdk/aws-iam.Role\"}")]
        public override Role Role
        {
            get => GetInstanceProperty<Role>();
        }

        /// <summary>The ARN of the project.</summary>
        [JsiiProperty("projectArn", "{\"fqn\":\"@aws-cdk/aws-codebuild.ProjectArn\"}")]
        public override ProjectArn ProjectArn
        {
            get => GetInstanceProperty<ProjectArn>();
        }

        /// <summary>The name of the project.</summary>
        [JsiiProperty("projectName", "{\"fqn\":\"@aws-cdk/aws-codebuild.ProjectName\"}")]
        public override ProjectName ProjectName
        {
            get => GetInstanceProperty<ProjectName>();
        }

        /// <summary>Add a permission only if there's a policy attached.</summary>
        /// <param name = "statement">The permissions statement to add</param>
        [JsiiMethod("addToRolePolicy", null, "[{\"name\":\"statement\",\"type\":{\"fqn\":\"@aws-cdk/cdk.PolicyStatement\"}}]")]
        public virtual void AddToRolePolicy(PolicyStatement statement)
        {
            InvokeInstanceVoidMethod(new object[]{statement});
        }
    }
}
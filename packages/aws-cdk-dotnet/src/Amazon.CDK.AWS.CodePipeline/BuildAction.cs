using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline
{
    /// <summary>
    /// Low level class for build actions.
    /// It is recommended that concrete types are used instead, such as {@link codebuild.PipelineBuildAction}.
    /// </summary>
    [JsiiClass(typeof(BuildAction), "@aws-cdk/aws-codepipeline.BuildAction", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/aws-codepipeline.Stage\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-codepipeline.BuildActionProps\"}}]")]
    public abstract class BuildAction : Action
    {
        protected BuildAction(Stage parent, string name, IBuildActionProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected BuildAction(ByRefValue reference): base(reference)
        {
        }

        protected BuildAction(DeputyProps props): base(props)
        {
        }

        [JsiiProperty("artifact", "{\"fqn\":\"@aws-cdk/aws-codepipeline.Artifact\",\"optional\":true}")]
        public virtual Artifact Artifact
        {
            get => GetInstanceProperty<Artifact>();
        }
    }
}
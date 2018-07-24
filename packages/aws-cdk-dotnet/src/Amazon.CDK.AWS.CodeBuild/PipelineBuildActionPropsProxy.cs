using Amazon.CDK.AWS.CodePipeline;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeBuild
{
    /// <summary>Construction properties of the {@link PipelineBuildAction CodeBuild build CodePipeline Action}.</summary>
    [JsiiInterfaceProxy(typeof(IPipelineBuildActionProps), "@aws-cdk/aws-codebuild.PipelineBuildActionProps")]
    internal class PipelineBuildActionPropsProxy : DeputyBase, IPipelineBuildActionProps
    {
        private PipelineBuildActionPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The source to use as input for this build</summary>
        [JsiiProperty("inputArtifact", "{\"fqn\":\"@aws-cdk/aws-codepipeline.Artifact\"}")]
        public virtual Artifact InputArtifact
        {
            get => GetInstanceProperty<Artifact>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The name of the build's output artifact</summary>
        [JsiiProperty("artifactName", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string ArtifactName
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The build project</summary>
        [JsiiProperty("project", "{\"fqn\":\"@aws-cdk/aws-codebuild.BuildProjectRef\"}")]
        public virtual BuildProjectRef Project
        {
            get => GetInstanceProperty<BuildProjectRef>();
            set => SetInstanceProperty(value);
        }
    }
}
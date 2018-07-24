using Amazon.CDK.AWS.CodePipeline;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeBuild
{
    /// <summary>Construction properties of the {@link PipelineBuildAction CodeBuild build CodePipeline Action}.</summary>
    [JsiiInterface(typeof(IPipelineBuildActionProps), "@aws-cdk/aws-codebuild.PipelineBuildActionProps")]
    public interface IPipelineBuildActionProps
    {
        /// <summary>The source to use as input for this build</summary>
        [JsiiProperty("inputArtifact", "{\"fqn\":\"@aws-cdk/aws-codepipeline.Artifact\"}")]
        Artifact InputArtifact
        {
            get;
            set;
        }

        /// <summary>The name of the build's output artifact</summary>
        [JsiiProperty("artifactName", "{\"primitive\":\"string\",\"optional\":true}")]
        string ArtifactName
        {
            get;
            set;
        }

        /// <summary>The build project</summary>
        [JsiiProperty("project", "{\"fqn\":\"@aws-cdk/aws-codebuild.BuildProjectRef\"}")]
        BuildProjectRef Project
        {
            get;
            set;
        }
    }
}
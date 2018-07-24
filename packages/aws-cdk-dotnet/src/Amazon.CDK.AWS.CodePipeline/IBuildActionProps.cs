using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline
{
    /// <summary>Construction properties of the low level {@link BuildAction build action}</summary>
    [JsiiInterface(typeof(IBuildActionProps), "@aws-cdk/aws-codepipeline.BuildActionProps")]
    public interface IBuildActionProps
    {
        /// <summary>The source to use as input for this build</summary>
        [JsiiProperty("inputArtifact", "{\"fqn\":\"@aws-cdk/aws-codepipeline.Artifact\"}")]
        Artifact InputArtifact
        {
            get;
            set;
        }

        /// <summary>The service provider that the action calls. For example, a valid provider for Source actions is CodeBuild.</summary>
        [JsiiProperty("provider", "{\"primitive\":\"string\"}")]
        string Provider
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

        /// <summary>
        /// The action's configuration. These are key-value pairs that specify input values for an action.
        /// For more information, see the AWS CodePipeline User Guide.
        /// 
        /// http://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#action-requirements
        /// </summary>
        [JsiiProperty("configuration", "{\"primitive\":\"any\",\"optional\":true}")]
        object Configuration
        {
            get;
            set;
        }
    }
}
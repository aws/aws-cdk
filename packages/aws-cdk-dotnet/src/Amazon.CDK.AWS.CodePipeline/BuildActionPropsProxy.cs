using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline
{
    /// <summary>Construction properties of the low level {@link BuildAction build action}</summary>
    [JsiiInterfaceProxy(typeof(IBuildActionProps), "@aws-cdk/aws-codepipeline.BuildActionProps")]
    internal class BuildActionPropsProxy : DeputyBase, IBuildActionProps
    {
        private BuildActionPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The source to use as input for this build</summary>
        [JsiiProperty("inputArtifact", "{\"fqn\":\"@aws-cdk/aws-codepipeline.Artifact\"}")]
        public virtual Artifact InputArtifact
        {
            get => GetInstanceProperty<Artifact>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The service provider that the action calls. For example, a valid provider for Source actions is CodeBuild.</summary>
        [JsiiProperty("provider", "{\"primitive\":\"string\"}")]
        public virtual string Provider
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The name of the build's output artifact</summary>
        [JsiiProperty("artifactName", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string ArtifactName
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// The action's configuration. These are key-value pairs that specify input values for an action.
        /// For more information, see the AWS CodePipeline User Guide.
        /// 
        /// http://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#action-requirements
        /// </summary>
        [JsiiProperty("configuration", "{\"primitive\":\"any\",\"optional\":true}")]
        public virtual object Configuration
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
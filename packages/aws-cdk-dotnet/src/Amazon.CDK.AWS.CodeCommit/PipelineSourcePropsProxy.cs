using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeCommit
{
    /// <summary>Construction properties of the {@link PipelineSource CodeCommit source CodePipeline Action}.</summary>
    [JsiiInterfaceProxy(typeof(IPipelineSourceProps), "@aws-cdk/aws-codecommit.PipelineSourceProps")]
    internal class PipelineSourcePropsProxy : DeputyBase, IPipelineSourceProps
    {
        private PipelineSourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>
        /// The name of the source's output artifact. Output artifacts are used by CodePipeline as
        /// inputs into other actions.
        /// </summary>
        [JsiiProperty("artifactName", "{\"primitive\":\"string\"}")]
        public virtual string ArtifactName
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The CodeCommit repository.</summary>
        [JsiiProperty("repository", "{\"fqn\":\"@aws-cdk/aws-codecommit.RepositoryRef\"}")]
        public virtual RepositoryRef Repository
        {
            get => GetInstanceProperty<RepositoryRef>();
            set => SetInstanceProperty(value);
        }

        /// <remarks>default: 'master'</remarks>
        [JsiiProperty("branch", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string Branch
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Whether or not AWS CodePipeline should poll for source changes</summary>
        /// <remarks>default: true</remarks>
        [JsiiProperty("pollForSourceChanges", "{\"primitive\":\"boolean\",\"optional\":true}")]
        public virtual bool? PollForSourceChanges
        {
            get => GetInstanceProperty<bool? >();
            set => SetInstanceProperty(value);
        }
    }
}
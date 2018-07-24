using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeCommit
{
    /// <summary>Construction properties of the {@link PipelineSource CodeCommit source CodePipeline Action}.</summary>
    [JsiiInterface(typeof(IPipelineSourceProps), "@aws-cdk/aws-codecommit.PipelineSourceProps")]
    public interface IPipelineSourceProps
    {
        /// <summary>
        /// The name of the source's output artifact. Output artifacts are used by CodePipeline as
        /// inputs into other actions.
        /// </summary>
        [JsiiProperty("artifactName", "{\"primitive\":\"string\"}")]
        string ArtifactName
        {
            get;
            set;
        }

        /// <summary>The CodeCommit repository.</summary>
        [JsiiProperty("repository", "{\"fqn\":\"@aws-cdk/aws-codecommit.RepositoryRef\"}")]
        RepositoryRef Repository
        {
            get;
            set;
        }

        /// <remarks>default: 'master'</remarks>
        [JsiiProperty("branch", "{\"primitive\":\"string\",\"optional\":true}")]
        string Branch
        {
            get;
            set;
        }

        /// <summary>Whether or not AWS CodePipeline should poll for source changes</summary>
        /// <remarks>default: true</remarks>
        [JsiiProperty("pollForSourceChanges", "{\"primitive\":\"boolean\",\"optional\":true}")]
        bool? PollForSourceChanges
        {
            get;
            set;
        }
    }
}
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline
{
    /// <summary>Construction properties of the low level {@link Source source action}</summary>
    [JsiiInterface(typeof(ISourceProps), "@aws-cdk/aws-codepipeline.SourceProps")]
    public interface ISourceProps
    {
        /// <summary>The source action owner (could e "AWS", "ThirdParty" or "Custom")</summary>
        /// <remarks>default: AWS</remarks>
        [JsiiProperty("owner", "{\"primitive\":\"string\",\"optional\":true}")]
        string Owner
        {
            get;
            set;
        }

        /// <summary>The source action verison.</summary>
        /// <remarks>default: "1"</remarks>
        [JsiiProperty("version", "{\"primitive\":\"string\",\"optional\":true}")]
        string Version
        {
            get;
            set;
        }

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

        /// <summary>The service provider that the action calls. For example, a valid provider for Source actions is S3.</summary>
        [JsiiProperty("provider", "{\"primitive\":\"string\"}")]
        string Provider
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
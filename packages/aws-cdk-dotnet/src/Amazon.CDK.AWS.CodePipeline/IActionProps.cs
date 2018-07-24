using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline
{
    /// <summary>Construction properties of the low level {@link Action action type}.</summary>
    [JsiiInterface(typeof(IActionProps), "@aws-cdk/aws-codepipeline.ActionProps")]
    public interface IActionProps
    {
        /// <summary>
        /// A category that defines which action type the owner (the entity that performs the action) performs.
        /// The category that you select determine the providers that you can specify for the {@link #provider} property.
        /// </summary>
        [JsiiProperty("category", "{\"fqn\":\"@aws-cdk/aws-codepipeline.ActionCategory\"}")]
        ActionCategory Category
        {
            get;
            set;
        }

        /// <summary>
        /// The service provider that the action calls. The providers that you can specify are determined by
        /// the category that you select. For example, a valid provider for the Deploy category is AWS CodeDeploy,
        /// which you would specify as CodeDeploy.
        /// </summary>
        [JsiiProperty("provider", "{\"primitive\":\"string\"}")]
        string Provider
        {
            get;
            set;
        }

        /// <summary>The constraints to apply to the number of input and output artifacts used by this action.</summary>
        [JsiiProperty("artifactBounds", "{\"fqn\":\"@aws-cdk/aws-codepipeline.ActionArtifactBounds\"}")]
        IActionArtifactBounds ArtifactBounds
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

        /// <summary>For all currently supported action types, the only valid version string is "1".</summary>
        /// <remarks>default: 1</remarks>
        [JsiiProperty("version", "{\"primitive\":\"string\",\"optional\":true}")]
        string Version
        {
            get;
            set;
        }

        /// <summary>
        /// For all currently supported action types, the only valid owner string is
        /// "AWS", "ThirdParty", or "Custom". For more information, see the AWS
        /// CodePipeline API Reference.
        /// </summary>
        /// <remarks>default: 'AWS'</remarks>
        [JsiiProperty("owner", "{\"primitive\":\"string\",\"optional\":true}")]
        string Owner
        {
            get;
            set;
        }
    }
}
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline
{
    /// <summary>Construction properties of the low level {@link Action action type}.</summary>
    [JsiiInterfaceProxy(typeof(IActionProps), "@aws-cdk/aws-codepipeline.ActionProps")]
    internal class ActionPropsProxy : DeputyBase, IActionProps
    {
        private ActionPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>
        /// A category that defines which action type the owner (the entity that performs the action) performs.
        /// The category that you select determine the providers that you can specify for the {@link #provider} property.
        /// </summary>
        [JsiiProperty("category", "{\"fqn\":\"@aws-cdk/aws-codepipeline.ActionCategory\"}")]
        public virtual ActionCategory Category
        {
            get => GetInstanceProperty<ActionCategory>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// The service provider that the action calls. The providers that you can specify are determined by
        /// the category that you select. For example, a valid provider for the Deploy category is AWS CodeDeploy,
        /// which you would specify as CodeDeploy.
        /// </summary>
        [JsiiProperty("provider", "{\"primitive\":\"string\"}")]
        public virtual string Provider
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The constraints to apply to the number of input and output artifacts used by this action.</summary>
        [JsiiProperty("artifactBounds", "{\"fqn\":\"@aws-cdk/aws-codepipeline.ActionArtifactBounds\"}")]
        public virtual IActionArtifactBounds ArtifactBounds
        {
            get => GetInstanceProperty<IActionArtifactBounds>();
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

        /// <summary>For all currently supported action types, the only valid version string is "1".</summary>
        /// <remarks>default: 1</remarks>
        [JsiiProperty("version", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string Version
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// For all currently supported action types, the only valid owner string is
        /// "AWS", "ThirdParty", or "Custom". For more information, see the AWS
        /// CodePipeline API Reference.
        /// </summary>
        /// <remarks>default: 'AWS'</remarks>
        [JsiiProperty("owner", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string Owner
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }
    }
}
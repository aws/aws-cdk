using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline.cloudformation.PipelineResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions-outputartifacts.html </remarks>
    [JsiiInterfaceProxy(typeof(IOutputArtifactProperty), "@aws-cdk/aws-codepipeline.cloudformation.PipelineResource.OutputArtifactProperty")]
    internal class OutputArtifactPropertyProxy : DeputyBase, IOutputArtifactProperty
    {
        private OutputArtifactPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``PipelineResource.OutputArtifactProperty.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions-outputartifacts.html#cfn-codepipeline-pipeline-stages-actions-outputartifacts-name </remarks>
        [JsiiProperty("name", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Name
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
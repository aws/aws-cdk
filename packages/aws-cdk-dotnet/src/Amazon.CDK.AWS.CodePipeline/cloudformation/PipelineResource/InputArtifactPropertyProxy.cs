using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline.cloudformation.PipelineResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions-inputartifacts.html </remarks>
    [JsiiInterfaceProxy(typeof(IInputArtifactProperty), "@aws-cdk/aws-codepipeline.cloudformation.PipelineResource.InputArtifactProperty")]
    internal class InputArtifactPropertyProxy : DeputyBase, IInputArtifactProperty
    {
        private InputArtifactPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``PipelineResource.InputArtifactProperty.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions-inputartifacts.html#cfn-codepipeline-pipeline-stages-actions-inputartifacts-name </remarks>
        [JsiiProperty("name", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Name
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
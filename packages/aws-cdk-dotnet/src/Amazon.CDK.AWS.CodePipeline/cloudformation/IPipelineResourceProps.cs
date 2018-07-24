using Amazon.CDK;
using Amazon.CDK.AWS.CodePipeline.cloudformation.PipelineResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html </remarks>
    [JsiiInterface(typeof(IPipelineResourceProps), "@aws-cdk/aws-codepipeline.cloudformation.PipelineResourceProps")]
    public interface IPipelineResourceProps
    {
        /// <summary>``AWS::CodePipeline::Pipeline.ArtifactStore``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-artifactstore </remarks>
        [JsiiProperty("artifactStore", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-codepipeline.cloudformation.PipelineResource.ArtifactStoreProperty\"}]}}")]
        object ArtifactStore
        {
            get;
            set;
        }

        /// <summary>``AWS::CodePipeline::Pipeline.RoleArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-rolearn </remarks>
        [JsiiProperty("roleArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object RoleArn
        {
            get;
            set;
        }

        /// <summary>``AWS::CodePipeline::Pipeline.Stages``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-stages </remarks>
        [JsiiProperty("stages", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-codepipeline.cloudformation.PipelineResource.StageDeclarationProperty\"}]}}}}]}}")]
        object Stages
        {
            get;
            set;
        }

        /// <summary>``AWS::CodePipeline::Pipeline.DisableInboundStageTransitions``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-disableinboundstagetransitions </remarks>
        [JsiiProperty("disableInboundStageTransitions", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-codepipeline.cloudformation.PipelineResource.StageTransitionProperty\"}]}}}}]},\"optional\":true}")]
        object DisableInboundStageTransitions
        {
            get;
            set;
        }

        /// <summary>``AWS::CodePipeline::Pipeline.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-name </remarks>
        [JsiiProperty("pipelineName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object PipelineName
        {
            get;
            set;
        }

        /// <summary>``AWS::CodePipeline::Pipeline.RestartExecutionOnUpdate``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-restartexecutiononupdate </remarks>
        [JsiiProperty("restartExecutionOnUpdate", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object RestartExecutionOnUpdate
        {
            get;
            set;
        }
    }
}
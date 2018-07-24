using Amazon.CDK;
using Amazon.CDK.AWS.DataPipeline.cloudformation.PipelineResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DataPipeline.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datapipeline-pipeline.html </remarks>
    public class PipelineResourceProps : DeputyBase, IPipelineResourceProps
    {
        /// <summary>``AWS::DataPipeline::Pipeline.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datapipeline-pipeline.html#cfn-datapipeline-pipeline-name </remarks>
        [JsiiProperty("pipelineName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object PipelineName
        {
            get;
            set;
        }

        /// <summary>``AWS::DataPipeline::Pipeline.ParameterObjects``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datapipeline-pipeline.html#cfn-datapipeline-pipeline-parameterobjects </remarks>
        [JsiiProperty("parameterObjects", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-datapipeline.cloudformation.PipelineResource.ParameterObjectProperty\"}]}}}}]}}", true)]
        public object ParameterObjects
        {
            get;
            set;
        }

        /// <summary>``AWS::DataPipeline::Pipeline.Activate``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datapipeline-pipeline.html#cfn-datapipeline-pipeline-activate </remarks>
        [JsiiProperty("activate", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Activate
        {
            get;
            set;
        }

        /// <summary>``AWS::DataPipeline::Pipeline.Description``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datapipeline-pipeline.html#cfn-datapipeline-pipeline-description </remarks>
        [JsiiProperty("description", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Description
        {
            get;
            set;
        }

        /// <summary>``AWS::DataPipeline::Pipeline.ParameterValues``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datapipeline-pipeline.html#cfn-datapipeline-pipeline-parametervalues </remarks>
        [JsiiProperty("parameterValues", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-datapipeline.cloudformation.PipelineResource.ParameterValueProperty\"}]}}}}]},\"optional\":true}", true)]
        public object ParameterValues
        {
            get;
            set;
        }

        /// <summary>``AWS::DataPipeline::Pipeline.PipelineObjects``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datapipeline-pipeline.html#cfn-datapipeline-pipeline-pipelineobjects </remarks>
        [JsiiProperty("pipelineObjects", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-datapipeline.cloudformation.PipelineResource.PipelineObjectProperty\"}]}}}}]},\"optional\":true}", true)]
        public object PipelineObjects
        {
            get;
            set;
        }

        /// <summary>``AWS::DataPipeline::Pipeline.PipelineTags``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datapipeline-pipeline.html#cfn-datapipeline-pipeline-pipelinetags </remarks>
        [JsiiProperty("pipelineTags", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-datapipeline.cloudformation.PipelineResource.PipelineTagProperty\"}]}}}}]},\"optional\":true}", true)]
        public object PipelineTags
        {
            get;
            set;
        }
    }
}
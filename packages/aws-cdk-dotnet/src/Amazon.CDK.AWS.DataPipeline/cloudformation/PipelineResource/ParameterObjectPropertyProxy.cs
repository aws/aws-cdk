using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DataPipeline.cloudformation.PipelineResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datapipeline-pipeline-parameterobjects.html </remarks>
    [JsiiInterfaceProxy(typeof(IParameterObjectProperty), "@aws-cdk/aws-datapipeline.cloudformation.PipelineResource.ParameterObjectProperty")]
    internal class ParameterObjectPropertyProxy : DeputyBase, IParameterObjectProperty
    {
        private ParameterObjectPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``PipelineResource.ParameterObjectProperty.Attributes``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datapipeline-pipeline-parameterobjects.html#cfn-datapipeline-pipeline-parameterobjects-attributes </remarks>
        [JsiiProperty("attributes", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-datapipeline.cloudformation.PipelineResource.ParameterAttributeProperty\"}]}}}}]}}")]
        public virtual object Attributes
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``PipelineResource.ParameterObjectProperty.Id``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datapipeline-pipeline-parameterobjects.html#cfn-datapipeline-pipeline-parameterobjects-id </remarks>
        [JsiiProperty("id", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Id
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
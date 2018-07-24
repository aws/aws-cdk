using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DataPipeline.cloudformation.PipelineResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datapipeline-pipeline-parameterobjects-attributes.html </remarks>
    [JsiiInterfaceProxy(typeof(IParameterAttributeProperty), "@aws-cdk/aws-datapipeline.cloudformation.PipelineResource.ParameterAttributeProperty")]
    internal class ParameterAttributePropertyProxy : DeputyBase, IParameterAttributeProperty
    {
        private ParameterAttributePropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``PipelineResource.ParameterAttributeProperty.Key``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datapipeline-pipeline-parameterobjects-attributes.html#cfn-datapipeline-pipeline-parameterobjects-attribtues-key </remarks>
        [JsiiProperty("key", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Key
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``PipelineResource.ParameterAttributeProperty.StringValue``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datapipeline-pipeline-parameterobjects-attributes.html#cfn-datapipeline-pipeline-parameterobjects-attribtues-stringvalue </remarks>
        [JsiiProperty("stringValue", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object StringValue
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
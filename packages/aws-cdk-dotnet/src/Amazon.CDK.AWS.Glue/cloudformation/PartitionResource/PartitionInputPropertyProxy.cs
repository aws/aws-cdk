using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;

namespace Amazon.CDK.AWS.Glue.cloudformation.PartitionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-partitioninput.html </remarks>
    [JsiiInterfaceProxy(typeof(IPartitionInputProperty), "@aws-cdk/aws-glue.cloudformation.PartitionResource.PartitionInputProperty")]
    internal class PartitionInputPropertyProxy : DeputyBase, IPartitionInputProperty
    {
        private PartitionInputPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``PartitionResource.PartitionInputProperty.Parameters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-partitioninput.html#cfn-glue-partition-partitioninput-parameters </remarks>
        [JsiiProperty("parameters", "{\"union\":{\"types\":[{\"primitive\":\"json\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Parameters
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``PartitionResource.PartitionInputProperty.StorageDescriptor``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-partitioninput.html#cfn-glue-partition-partitioninput-storagedescriptor </remarks>
        [JsiiProperty("storageDescriptor", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-glue.cloudformation.PartitionResource.StorageDescriptorProperty\"}]},\"optional\":true}")]
        public virtual object StorageDescriptor
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``PartitionResource.PartitionInputProperty.Values``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-partitioninput.html#cfn-glue-partition-partitioninput-values </remarks>
        [JsiiProperty("values", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]}}")]
        public virtual object Values
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
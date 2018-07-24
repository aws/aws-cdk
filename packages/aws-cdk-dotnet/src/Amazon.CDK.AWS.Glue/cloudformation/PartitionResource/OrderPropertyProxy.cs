using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Glue.cloudformation.PartitionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-order.html </remarks>
    [JsiiInterfaceProxy(typeof(IOrderProperty), "@aws-cdk/aws-glue.cloudformation.PartitionResource.OrderProperty")]
    internal class OrderPropertyProxy : DeputyBase, Amazon.CDK.AWS.Glue.cloudformation.PartitionResource.IOrderProperty
    {
        private OrderPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``PartitionResource.OrderProperty.Column``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-order.html#cfn-glue-partition-order-column </remarks>
        [JsiiProperty("column", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Column
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``PartitionResource.OrderProperty.SortOrder``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-order.html#cfn-glue-partition-order-sortorder </remarks>
        [JsiiProperty("sortOrder", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object SortOrder
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
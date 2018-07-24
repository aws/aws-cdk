using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Glue.cloudformation.PartitionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-order.html </remarks>
    public class OrderProperty : DeputyBase, Amazon.CDK.AWS.Glue.cloudformation.PartitionResource.IOrderProperty
    {
        /// <summary>``PartitionResource.OrderProperty.Column``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-order.html#cfn-glue-partition-order-column </remarks>
        [JsiiProperty("column", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object Column
        {
            get;
            set;
        }

        /// <summary>``PartitionResource.OrderProperty.SortOrder``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-order.html#cfn-glue-partition-order-sortorder </remarks>
        [JsiiProperty("sortOrder", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object SortOrder
        {
            get;
            set;
        }
    }
}
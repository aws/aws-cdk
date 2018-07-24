using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Glue.cloudformation.TableResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-order.html </remarks>
    public class OrderProperty : DeputyBase, Amazon.CDK.AWS.Glue.cloudformation.TableResource.IOrderProperty
    {
        /// <summary>``TableResource.OrderProperty.Column``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-order.html#cfn-glue-table-order-column </remarks>
        [JsiiProperty("column", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object Column
        {
            get;
            set;
        }

        /// <summary>``TableResource.OrderProperty.SortOrder``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-order.html#cfn-glue-table-order-sortorder </remarks>
        [JsiiProperty("sortOrder", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object SortOrder
        {
            get;
            set;
        }
    }
}
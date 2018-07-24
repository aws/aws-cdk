using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Glue.cloudformation.TableResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-order.html </remarks>
    [JsiiInterfaceProxy(typeof(IOrderProperty), "@aws-cdk/aws-glue.cloudformation.TableResource.OrderProperty")]
    internal class OrderPropertyProxy : DeputyBase, Amazon.CDK.AWS.Glue.cloudformation.TableResource.IOrderProperty
    {
        private OrderPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``TableResource.OrderProperty.Column``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-order.html#cfn-glue-table-order-column </remarks>
        [JsiiProperty("column", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Column
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``TableResource.OrderProperty.SortOrder``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-order.html#cfn-glue-table-order-sortorder </remarks>
        [JsiiProperty("sortOrder", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object SortOrder
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisFirehose.cloudformation.DeliveryStreamResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-copycommand.html </remarks>
    [JsiiInterface(typeof(ICopyCommandProperty), "@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResource.CopyCommandProperty")]
    public interface ICopyCommandProperty
    {
        /// <summary>``DeliveryStreamResource.CopyCommandProperty.CopyOptions``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-copycommand.html#cfn-kinesisfirehose-deliverystream-copycommand-copyoptions </remarks>
        [JsiiProperty("copyOptions", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object CopyOptions
        {
            get;
            set;
        }

        /// <summary>``DeliveryStreamResource.CopyCommandProperty.DataTableColumns``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-copycommand.html#cfn-kinesisfirehose-deliverystream-copycommand-datatablecolumns </remarks>
        [JsiiProperty("dataTableColumns", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object DataTableColumns
        {
            get;
            set;
        }

        /// <summary>``DeliveryStreamResource.CopyCommandProperty.DataTableName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-copycommand.html#cfn-kinesisfirehose-deliverystream-copycommand-datatablename </remarks>
        [JsiiProperty("dataTableName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object DataTableName
        {
            get;
            set;
        }
    }
}
using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Config.cloudformation.DeliveryChannelResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-deliverychannel-configsnapshotdeliveryproperties.html </remarks>
    [JsiiInterface(typeof(IConfigSnapshotDeliveryPropertiesProperty), "@aws-cdk/aws-config.cloudformation.DeliveryChannelResource.ConfigSnapshotDeliveryPropertiesProperty")]
    public interface IConfigSnapshotDeliveryPropertiesProperty
    {
        /// <summary>``DeliveryChannelResource.ConfigSnapshotDeliveryPropertiesProperty.DeliveryFrequency``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-deliverychannel-configsnapshotdeliveryproperties.html#cfn-config-deliverychannel-configsnapshotdeliveryproperties-deliveryfrequency </remarks>
        [JsiiProperty("deliveryFrequency", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object DeliveryFrequency
        {
            get;
            set;
        }
    }
}
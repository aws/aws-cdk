using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Config.cloudformation.DeliveryChannelResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-deliverychannel-configsnapshotdeliveryproperties.html </remarks>
    [JsiiInterfaceProxy(typeof(IConfigSnapshotDeliveryPropertiesProperty), "@aws-cdk/aws-config.cloudformation.DeliveryChannelResource.ConfigSnapshotDeliveryPropertiesProperty")]
    internal class ConfigSnapshotDeliveryPropertiesPropertyProxy : DeputyBase, IConfigSnapshotDeliveryPropertiesProperty
    {
        private ConfigSnapshotDeliveryPropertiesPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``DeliveryChannelResource.ConfigSnapshotDeliveryPropertiesProperty.DeliveryFrequency``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-deliverychannel-configsnapshotdeliveryproperties.html#cfn-config-deliverychannel-configsnapshotdeliveryproperties-deliveryfrequency </remarks>
        [JsiiProperty("deliveryFrequency", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object DeliveryFrequency
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
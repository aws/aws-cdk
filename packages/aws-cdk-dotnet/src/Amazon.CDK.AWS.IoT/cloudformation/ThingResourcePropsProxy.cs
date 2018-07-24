using Amazon.CDK;
using Amazon.CDK.AWS.IoT.cloudformation.ThingResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.IoT.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-thing.html </remarks>
    [JsiiInterfaceProxy(typeof(IThingResourceProps), "@aws-cdk/aws-iot.cloudformation.ThingResourceProps")]
    internal class ThingResourcePropsProxy : DeputyBase, IThingResourceProps
    {
        private ThingResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::IoT::Thing.AttributePayload``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-thing.html#cfn-iot-thing-attributepayload </remarks>
        [JsiiProperty("attributePayload", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-iot.cloudformation.ThingResource.AttributePayloadProperty\"}]},\"optional\":true}")]
        public virtual object AttributePayload
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::IoT::Thing.ThingName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-thing.html#cfn-iot-thing-thingname </remarks>
        [JsiiProperty("thingName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ThingName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
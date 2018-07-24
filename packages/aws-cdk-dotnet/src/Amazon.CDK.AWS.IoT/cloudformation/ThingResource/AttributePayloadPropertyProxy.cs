using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.IoT.cloudformation.ThingResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-thing-attributepayload.html </remarks>
    [JsiiInterfaceProxy(typeof(IAttributePayloadProperty), "@aws-cdk/aws-iot.cloudformation.ThingResource.AttributePayloadProperty")]
    internal class AttributePayloadPropertyProxy : DeputyBase, IAttributePayloadProperty
    {
        private AttributePayloadPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ThingResource.AttributePayloadProperty.Attributes``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-thing-attributepayload.html#cfn-iot-thing-attributepayload-attributes </remarks>
        [JsiiProperty("attributes", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        public virtual object Attributes
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
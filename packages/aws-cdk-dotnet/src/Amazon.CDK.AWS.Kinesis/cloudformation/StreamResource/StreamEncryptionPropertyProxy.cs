using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Kinesis.cloudformation.StreamResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesis-stream-streamencryption.html </remarks>
    [JsiiInterfaceProxy(typeof(IStreamEncryptionProperty), "@aws-cdk/aws-kinesis.cloudformation.StreamResource.StreamEncryptionProperty")]
    internal class StreamEncryptionPropertyProxy : DeputyBase, IStreamEncryptionProperty
    {
        private StreamEncryptionPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``StreamResource.StreamEncryptionProperty.EncryptionType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesis-stream-streamencryption.html#cfn-kinesis-stream-streamencryption-encryptiontype </remarks>
        [JsiiProperty("encryptionType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object EncryptionType
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``StreamResource.StreamEncryptionProperty.KeyId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesis-stream-streamencryption.html#cfn-kinesis-stream-streamencryption-keyid </remarks>
        [JsiiProperty("keyId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object KeyId
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
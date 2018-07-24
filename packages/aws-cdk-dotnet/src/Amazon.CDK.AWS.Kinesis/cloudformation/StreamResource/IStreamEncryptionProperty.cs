using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Kinesis.cloudformation.StreamResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesis-stream-streamencryption.html </remarks>
    [JsiiInterface(typeof(IStreamEncryptionProperty), "@aws-cdk/aws-kinesis.cloudformation.StreamResource.StreamEncryptionProperty")]
    public interface IStreamEncryptionProperty
    {
        /// <summary>``StreamResource.StreamEncryptionProperty.EncryptionType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesis-stream-streamencryption.html#cfn-kinesis-stream-streamencryption-encryptiontype </remarks>
        [JsiiProperty("encryptionType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object EncryptionType
        {
            get;
            set;
        }

        /// <summary>``StreamResource.StreamEncryptionProperty.KeyId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesis-stream-streamencryption.html#cfn-kinesis-stream-streamencryption-keyid </remarks>
        [JsiiProperty("keyId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object KeyId
        {
            get;
            set;
        }
    }
}
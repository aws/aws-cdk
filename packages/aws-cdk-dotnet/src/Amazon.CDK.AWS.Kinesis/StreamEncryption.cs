using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Kinesis
{
    /// <summary>What kind of server-side encryption to apply to this stream</summary>
    [JsiiEnum(typeof(StreamEncryption), "@aws-cdk/aws-kinesis.StreamEncryption")]
    public enum StreamEncryption
    {
        [JsiiEnumMember("Unencrypted")]
        Unencrypted,
        [JsiiEnumMember("Kms")]
        Kms
    }
}
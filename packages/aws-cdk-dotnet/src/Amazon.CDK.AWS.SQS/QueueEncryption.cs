using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SQS
{
    /// <summary>What kind of encryption to apply to this queue</summary>
    [JsiiEnum(typeof(QueueEncryption), "@aws-cdk/aws-sqs.QueueEncryption")]
    public enum QueueEncryption
    {
        [JsiiEnumMember("Unencrypted")]
        Unencrypted,
        [JsiiEnumMember("KmsManaged")]
        KmsManaged,
        [JsiiEnumMember("Kms")]
        Kms
    }
}
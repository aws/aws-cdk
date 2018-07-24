using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    [JsiiEnum(typeof(RemovalPolicy), "@aws-cdk/cdk.RemovalPolicy")]
    public enum RemovalPolicy
    {
        [JsiiEnumMember("Destroy")]
        Destroy,
        [JsiiEnumMember("Orphan")]
        Orphan,
        [JsiiEnumMember("Forbid")]
        Forbid
    }
}
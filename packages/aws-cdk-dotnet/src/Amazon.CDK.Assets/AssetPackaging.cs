using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.Assets
{
    /// <summary>Defines the way an asset is packaged before it is uploaded to S3.</summary>
    [JsiiEnum(typeof(AssetPackaging), "@aws-cdk/assets.AssetPackaging")]
    public enum AssetPackaging
    {
        [JsiiEnumMember("ZipDirectory")]
        ZipDirectory,
        [JsiiEnumMember("File")]
        File
    }
}
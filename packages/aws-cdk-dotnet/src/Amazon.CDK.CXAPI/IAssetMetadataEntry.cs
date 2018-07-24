using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.CXAPI
{
    [JsiiInterface(typeof(IAssetMetadataEntry), "@aws-cdk/cx-api.AssetMetadataEntry")]
    public interface IAssetMetadataEntry
    {
        [JsiiProperty("path", "{\"primitive\":\"string\"}")]
        string Path
        {
            get;
            set;
        }

        [JsiiProperty("packaging", "{\"primitive\":\"string\"}")]
        string Packaging
        {
            get;
            set;
        }

        [JsiiProperty("s3BucketParameter", "{\"primitive\":\"string\"}")]
        string S3BucketParameter
        {
            get;
            set;
        }

        [JsiiProperty("s3KeyParameter", "{\"primitive\":\"string\"}")]
        string S3KeyParameter
        {
            get;
            set;
        }
    }
}
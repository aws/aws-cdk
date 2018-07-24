using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.CXAPI
{
    public class AssetMetadataEntry : DeputyBase, IAssetMetadataEntry
    {
        [JsiiProperty("path", "{\"primitive\":\"string\"}", true)]
        public string Path
        {
            get;
            set;
        }

        [JsiiProperty("packaging", "{\"primitive\":\"string\"}", true)]
        public string Packaging
        {
            get;
            set;
        }

        [JsiiProperty("s3BucketParameter", "{\"primitive\":\"string\"}", true)]
        public string S3BucketParameter
        {
            get;
            set;
        }

        [JsiiProperty("s3KeyParameter", "{\"primitive\":\"string\"}", true)]
        public string S3KeyParameter
        {
            get;
            set;
        }
    }
}
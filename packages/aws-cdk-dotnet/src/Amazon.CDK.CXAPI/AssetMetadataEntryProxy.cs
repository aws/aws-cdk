using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.CXAPI
{
    [JsiiInterfaceProxy(typeof(IAssetMetadataEntry), "@aws-cdk/cx-api.AssetMetadataEntry")]
    internal class AssetMetadataEntryProxy : DeputyBase, IAssetMetadataEntry
    {
        private AssetMetadataEntryProxy(ByRefValue reference): base(reference)
        {
        }

        [JsiiProperty("path", "{\"primitive\":\"string\"}")]
        public virtual string Path
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        [JsiiProperty("packaging", "{\"primitive\":\"string\"}")]
        public virtual string Packaging
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        [JsiiProperty("s3BucketParameter", "{\"primitive\":\"string\"}")]
        public virtual string S3BucketParameter
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        [JsiiProperty("s3KeyParameter", "{\"primitive\":\"string\"}")]
        public virtual string S3KeyParameter
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }
    }
}
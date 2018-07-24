using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.Assets
{
    /// <summary>An asset that represents a ZIP archive of a directory on disk.</summary>
    [JsiiClass(typeof(ZipDirectoryAsset), "@aws-cdk/assets.ZipDirectoryAsset", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"id\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/assets.ZipDirectoryAssetProps\"}}]")]
    public class ZipDirectoryAsset : Asset
    {
        public ZipDirectoryAsset(Construct parent, string id, IZipDirectoryAssetProps props): base(new DeputyProps(new object[]{parent, id, props}))
        {
        }

        protected ZipDirectoryAsset(ByRefValue reference): base(reference)
        {
        }

        protected ZipDirectoryAsset(DeputyProps props): base(props)
        {
        }
    }
}
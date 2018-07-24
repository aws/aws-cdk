using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.Assets
{
    /// <summary>An asset that represents a file on disk.</summary>
    [JsiiClass(typeof(FileAsset), "@aws-cdk/assets.FileAsset", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"id\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/assets.FileAssetProps\"}}]")]
    public class FileAsset : Asset
    {
        public FileAsset(Construct parent, string id, IFileAssetProps props): base(new DeputyProps(new object[]{parent, id, props}))
        {
        }

        protected FileAsset(ByRefValue reference): base(reference)
        {
        }

        protected FileAsset(DeputyProps props): base(props)
        {
        }
    }
}
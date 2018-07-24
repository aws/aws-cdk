using Amazon.CDK.AWS.IAM;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.Assets
{
    [JsiiInterface(typeof(IGenericAssetProps), "@aws-cdk/assets.GenericAssetProps")]
    public interface IGenericAssetProps
    {
        /// <summary>The disk location of the asset.</summary>
        [JsiiProperty("path", "{\"primitive\":\"string\"}")]
        string Path
        {
            get;
            set;
        }

        /// <summary>The packaging type for this asset.</summary>
        [JsiiProperty("packaging", "{\"fqn\":\"@aws-cdk/assets.AssetPackaging\"}")]
        AssetPackaging Packaging
        {
            get;
            set;
        }

        /// <summary>
        /// A list of principals that should be able to read this asset from S3.
        /// You can use `asset.grantRead(principal)` to grant read permissions later.
        /// </summary>
        [JsiiProperty("readers", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-iam.IPrincipal\"}},\"optional\":true}")]
        IIPrincipal[] Readers
        {
            get;
            set;
        }
    }
}
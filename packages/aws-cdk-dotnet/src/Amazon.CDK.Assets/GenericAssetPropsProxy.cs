using Amazon.CDK.AWS.IAM;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.Assets
{
    [JsiiInterfaceProxy(typeof(IGenericAssetProps), "@aws-cdk/assets.GenericAssetProps")]
    internal class GenericAssetPropsProxy : DeputyBase, IGenericAssetProps
    {
        private GenericAssetPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The disk location of the asset.</summary>
        [JsiiProperty("path", "{\"primitive\":\"string\"}")]
        public virtual string Path
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The packaging type for this asset.</summary>
        [JsiiProperty("packaging", "{\"fqn\":\"@aws-cdk/assets.AssetPackaging\"}")]
        public virtual AssetPackaging Packaging
        {
            get => GetInstanceProperty<AssetPackaging>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// A list of principals that should be able to read this asset from S3.
        /// You can use `asset.grantRead(principal)` to grant read permissions later.
        /// </summary>
        [JsiiProperty("readers", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-iam.IPrincipal\"}},\"optional\":true}")]
        public virtual IIPrincipal[] Readers
        {
            get => GetInstanceProperty<IIPrincipal[]>();
            set => SetInstanceProperty(value);
        }
    }
}
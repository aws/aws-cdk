using Amazon.CDK.AWS.IAM;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.Assets
{
    [JsiiInterfaceProxy(typeof(IZipDirectoryAssetProps), "@aws-cdk/assets.ZipDirectoryAssetProps")]
    internal class ZipDirectoryAssetPropsProxy : DeputyBase, IZipDirectoryAssetProps
    {
        private ZipDirectoryAssetPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>Path of the directory.</summary>
        [JsiiProperty("path", "{\"primitive\":\"string\"}")]
        public virtual string Path
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// A list of principals that should be able to read this ZIP file from S3.
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
using Amazon.CDK.AWS.IAM;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.Assets
{
    public class ZipDirectoryAssetProps : DeputyBase, IZipDirectoryAssetProps
    {
        /// <summary>Path of the directory.</summary>
        [JsiiProperty("path", "{\"primitive\":\"string\"}", true)]
        public string Path
        {
            get;
            set;
        }

        /// <summary>
        /// A list of principals that should be able to read this ZIP file from S3.
        /// You can use `asset.grantRead(principal)` to grant read permissions later.
        /// </summary>
        [JsiiProperty("readers", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-iam.IPrincipal\"}},\"optional\":true}", true)]
        public IIPrincipal[] Readers
        {
            get;
            set;
        }
    }
}
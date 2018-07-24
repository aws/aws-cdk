using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EFS.cloudformation.FileSystemResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-filesystem-filesystemtags.html </remarks>
    [JsiiInterfaceProxy(typeof(IElasticFileSystemTagProperty), "@aws-cdk/aws-efs.cloudformation.FileSystemResource.ElasticFileSystemTagProperty")]
    internal class ElasticFileSystemTagPropertyProxy : DeputyBase, IElasticFileSystemTagProperty
    {
        private ElasticFileSystemTagPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``FileSystemResource.ElasticFileSystemTagProperty.Key``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-filesystem-filesystemtags.html#cfn-efs-filesystem-filesystemtags-key </remarks>
        [JsiiProperty("key", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Key
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``FileSystemResource.ElasticFileSystemTagProperty.Value``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-filesystem-filesystemtags.html#cfn-efs-filesystem-filesystemtags-value </remarks>
        [JsiiProperty("value", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Value
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
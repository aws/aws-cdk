using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3.cloudformation.BucketResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-serversideencryptionrule.html </remarks>
    [JsiiInterfaceProxy(typeof(IServerSideEncryptionRuleProperty), "@aws-cdk/aws-s3.cloudformation.BucketResource.ServerSideEncryptionRuleProperty")]
    internal class ServerSideEncryptionRulePropertyProxy : DeputyBase, IServerSideEncryptionRuleProperty
    {
        private ServerSideEncryptionRulePropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``BucketResource.ServerSideEncryptionRuleProperty.ServerSideEncryptionByDefault``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-serversideencryptionrule.html#cfn-s3-bucket-serversideencryptionrule-serversideencryptionbydefault </remarks>
        [JsiiProperty("serverSideEncryptionByDefault", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-s3.cloudformation.BucketResource.ServerSideEncryptionByDefaultProperty\"}]},\"optional\":true}")]
        public virtual object ServerSideEncryptionByDefault
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3.cloudformation.BucketResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration.html </remarks>
    [JsiiInterfaceProxy(typeof(IReplicationConfigurationProperty), "@aws-cdk/aws-s3.cloudformation.BucketResource.ReplicationConfigurationProperty")]
    internal class ReplicationConfigurationPropertyProxy : DeputyBase, IReplicationConfigurationProperty
    {
        private ReplicationConfigurationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``BucketResource.ReplicationConfigurationProperty.Role``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration.html#cfn-s3-bucket-replicationconfiguration-role </remarks>
        [JsiiProperty("role", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Role
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``BucketResource.ReplicationConfigurationProperty.Rules``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration.html#cfn-s3-bucket-replicationconfiguration-rules </remarks>
        [JsiiProperty("rules", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-s3.cloudformation.BucketResource.ReplicationRuleProperty\"}]}}}}]}}")]
        public virtual object Rules
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
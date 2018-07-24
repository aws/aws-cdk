using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElasticLoadBalancing.cloudformation.LoadBalancerResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-accessloggingpolicy.html </remarks>
    [JsiiInterfaceProxy(typeof(IAccessLoggingPolicyProperty), "@aws-cdk/aws-elasticloadbalancing.cloudformation.LoadBalancerResource.AccessLoggingPolicyProperty")]
    internal class AccessLoggingPolicyPropertyProxy : DeputyBase, IAccessLoggingPolicyProperty
    {
        private AccessLoggingPolicyPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``LoadBalancerResource.AccessLoggingPolicyProperty.EmitInterval``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-accessloggingpolicy.html#cfn-elb-accessloggingpolicy-emitinterval </remarks>
        [JsiiProperty("emitInterval", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object EmitInterval
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``LoadBalancerResource.AccessLoggingPolicyProperty.Enabled``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-accessloggingpolicy.html#cfn-elb-accessloggingpolicy-enabled </remarks>
        [JsiiProperty("enabled", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Enabled
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``LoadBalancerResource.AccessLoggingPolicyProperty.S3BucketName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-accessloggingpolicy.html#cfn-elb-accessloggingpolicy-s3bucketname </remarks>
        [JsiiProperty("s3BucketName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object S3BucketName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``LoadBalancerResource.AccessLoggingPolicyProperty.S3BucketPrefix``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-accessloggingpolicy.html#cfn-elb-accessloggingpolicy-s3bucketprefix </remarks>
        [JsiiProperty("s3BucketPrefix", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object S3BucketPrefix
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
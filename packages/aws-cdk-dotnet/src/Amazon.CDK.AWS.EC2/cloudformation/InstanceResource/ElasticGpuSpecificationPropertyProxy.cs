using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation.InstanceResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance-elasticgpuspecification.html </remarks>
    [JsiiInterfaceProxy(typeof(IElasticGpuSpecificationProperty), "@aws-cdk/aws-ec2.cloudformation.InstanceResource.ElasticGpuSpecificationProperty")]
    internal class ElasticGpuSpecificationPropertyProxy : DeputyBase, Amazon.CDK.AWS.EC2.cloudformation.InstanceResource.IElasticGpuSpecificationProperty
    {
        private ElasticGpuSpecificationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``InstanceResource.ElasticGpuSpecificationProperty.Type``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance-elasticgpuspecification.html#cfn-ec2-instance-elasticgpuspecification-type </remarks>
        [JsiiProperty("type", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Type
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
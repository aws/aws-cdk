using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation.LaunchTemplateResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-elasticgpuspecification.html </remarks>
    [JsiiInterfaceProxy(typeof(IElasticGpuSpecificationProperty), "@aws-cdk/aws-ec2.cloudformation.LaunchTemplateResource.ElasticGpuSpecificationProperty")]
    internal class ElasticGpuSpecificationPropertyProxy : DeputyBase, Amazon.CDK.AWS.EC2.cloudformation.LaunchTemplateResource.IElasticGpuSpecificationProperty
    {
        private ElasticGpuSpecificationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``LaunchTemplateResource.ElasticGpuSpecificationProperty.Type``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-elasticgpuspecification.html#cfn-ec2-launchtemplate-elasticgpuspecification-type </remarks>
        [JsiiProperty("type", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Type
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation.InstanceResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance-creditspecification.html </remarks>
    [JsiiInterfaceProxy(typeof(ICreditSpecificationProperty), "@aws-cdk/aws-ec2.cloudformation.InstanceResource.CreditSpecificationProperty")]
    internal class CreditSpecificationPropertyProxy : DeputyBase, Amazon.CDK.AWS.EC2.cloudformation.InstanceResource.ICreditSpecificationProperty
    {
        private CreditSpecificationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``InstanceResource.CreditSpecificationProperty.CPUCredits``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance-creditspecification.html#cfn-ec2-instance-creditspecification-cpucredits </remarks>
        [JsiiProperty("cpuCredits", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object CpuCredits
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
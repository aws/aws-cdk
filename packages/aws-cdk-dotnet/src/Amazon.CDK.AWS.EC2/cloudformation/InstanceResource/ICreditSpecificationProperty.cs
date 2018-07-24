using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation.InstanceResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance-creditspecification.html </remarks>
    [JsiiInterface(typeof(ICreditSpecificationProperty), "@aws-cdk/aws-ec2.cloudformation.InstanceResource.CreditSpecificationProperty")]
    public interface ICreditSpecificationProperty
    {
        /// <summary>``InstanceResource.CreditSpecificationProperty.CPUCredits``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance-creditspecification.html#cfn-ec2-instance-creditspecification-cpucredits </remarks>
        [JsiiProperty("cpuCredits", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object CpuCredits
        {
            get;
            set;
        }
    }
}
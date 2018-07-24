using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation.InstanceResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance-creditspecification.html </remarks>
    public class CreditSpecificationProperty : DeputyBase, Amazon.CDK.AWS.EC2.cloudformation.InstanceResource.ICreditSpecificationProperty
    {
        /// <summary>``InstanceResource.CreditSpecificationProperty.CPUCredits``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance-creditspecification.html#cfn-ec2-instance-creditspecification-cpucredits </remarks>
        [JsiiProperty("cpuCredits", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object CpuCredits
        {
            get;
            set;
        }
    }
}
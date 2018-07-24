using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation.LaunchTemplateResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata-creditspecification.html </remarks>
    public class CreditSpecificationProperty : DeputyBase, Amazon.CDK.AWS.EC2.cloudformation.LaunchTemplateResource.ICreditSpecificationProperty
    {
        /// <summary>``LaunchTemplateResource.CreditSpecificationProperty.CpuCredits``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata-creditspecification.html#cfn-ec2-launchtemplate-launchtemplatedata-creditspecification-cpucredits </remarks>
        [JsiiProperty("cpuCredits", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object CpuCredits
        {
            get;
            set;
        }
    }
}
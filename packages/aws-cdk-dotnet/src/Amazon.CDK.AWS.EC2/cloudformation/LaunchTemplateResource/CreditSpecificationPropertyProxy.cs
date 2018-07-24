using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation.LaunchTemplateResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata-creditspecification.html </remarks>
    [JsiiInterfaceProxy(typeof(ICreditSpecificationProperty), "@aws-cdk/aws-ec2.cloudformation.LaunchTemplateResource.CreditSpecificationProperty")]
    internal class CreditSpecificationPropertyProxy : DeputyBase, Amazon.CDK.AWS.EC2.cloudformation.LaunchTemplateResource.ICreditSpecificationProperty
    {
        private CreditSpecificationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``LaunchTemplateResource.CreditSpecificationProperty.CpuCredits``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata-creditspecification.html#cfn-ec2-launchtemplate-launchtemplatedata-creditspecification-cpucredits </remarks>
        [JsiiProperty("cpuCredits", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object CpuCredits
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
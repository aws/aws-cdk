using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CertificateManager.cloudformation.CertificateResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-certificatemanager-certificate-domainvalidationoption.html </remarks>
    [JsiiInterfaceProxy(typeof(IDomainValidationOptionProperty), "@aws-cdk/aws-certificatemanager.cloudformation.CertificateResource.DomainValidationOptionProperty")]
    internal class DomainValidationOptionPropertyProxy : DeputyBase, IDomainValidationOptionProperty
    {
        private DomainValidationOptionPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``CertificateResource.DomainValidationOptionProperty.DomainName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-certificatemanager-certificate-domainvalidationoption.html#cfn-certificatemanager-certificate-domainvalidationoptions-domainname </remarks>
        [JsiiProperty("domainName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object DomainName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``CertificateResource.DomainValidationOptionProperty.ValidationDomain``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-certificatemanager-certificate-domainvalidationoption.html#cfn-certificatemanager-certificate-domainvalidationoption-validationdomain </remarks>
        [JsiiProperty("validationDomain", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object ValidationDomain
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
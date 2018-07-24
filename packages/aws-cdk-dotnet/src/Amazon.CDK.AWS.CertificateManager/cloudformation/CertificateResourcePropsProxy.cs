using Amazon.CDK;
using Amazon.CDK.AWS.CertificateManager.cloudformation.CertificateResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CertificateManager.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-certificatemanager-certificate.html </remarks>
    [JsiiInterfaceProxy(typeof(ICertificateResourceProps), "@aws-cdk/aws-certificatemanager.cloudformation.CertificateResourceProps")]
    internal class CertificateResourcePropsProxy : DeputyBase, ICertificateResourceProps
    {
        private CertificateResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::CertificateManager::Certificate.DomainName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-certificatemanager-certificate.html#cfn-certificatemanager-certificate-domainname </remarks>
        [JsiiProperty("domainName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object DomainName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::CertificateManager::Certificate.DomainValidationOptions``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-certificatemanager-certificate.html#cfn-certificatemanager-certificate-domainvalidationoptions </remarks>
        [JsiiProperty("domainValidationOptions", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-certificatemanager.cloudformation.CertificateResource.DomainValidationOptionProperty\"}]}}}}]},\"optional\":true}")]
        public virtual object DomainValidationOptions
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::CertificateManager::Certificate.SubjectAlternativeNames``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-certificatemanager-certificate.html#cfn-certificatemanager-certificate-subjectalternativenames </remarks>
        [JsiiProperty("subjectAlternativeNames", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        public virtual object SubjectAlternativeNames
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::CertificateManager::Certificate.Tags``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-certificatemanager-certificate.html#cfn-certificatemanager-certificate-tags </remarks>
        [JsiiProperty("tags", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/cdk.Tag\"}]}}}}]},\"optional\":true}")]
        public virtual object Tags
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::CertificateManager::Certificate.ValidationMethod``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-certificatemanager-certificate.html#cfn-certificatemanager-certificate-validationmethod </remarks>
        [JsiiProperty("validationMethod", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ValidationMethod
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
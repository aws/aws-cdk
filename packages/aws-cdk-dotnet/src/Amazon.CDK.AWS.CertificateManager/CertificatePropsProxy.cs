using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.CertificateManager
{
    /// <summary>Properties for your certificate</summary>
    [JsiiInterfaceProxy(typeof(ICertificateProps), "@aws-cdk/aws-certificatemanager.CertificateProps")]
    internal class CertificatePropsProxy : DeputyBase, ICertificateProps
    {
        private CertificatePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>
        /// Fully-qualified domain name to request a certificate for.
        /// 
        /// May contain wildcards, such as ``*.domain.com``.
        /// </summary>
        [JsiiProperty("domainName", "{\"primitive\":\"string\"}")]
        public virtual string DomainName
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// Alternative domain names on your certificate.
        /// 
        /// Use this to register alternative domain names that represent the same site.
        /// </summary>
        [JsiiProperty("subjectAlternativeNames", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}},\"optional\":true}")]
        public virtual string[] SubjectAlternativeNames
        {
            get => GetInstanceProperty<string[]>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// What validation domain to use for every requested domain.
        /// 
        /// Has to be a superdomain of the requested domain.
        /// </summary>
        /// <remarks>default: Apex domain is used for every domain that's not overridden.</remarks>
        [JsiiProperty("validationDomains", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"string\"}},\"optional\":true}")]
        public virtual IDictionary<string, string> ValidationDomains
        {
            get => GetInstanceProperty<IDictionary<string, string>>();
            set => SetInstanceProperty(value);
        }
    }
}
using Amazon.CDK.AWS.CertificateManager;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront
{
    /// <summary>
    /// CloudFront can use a custom domain that you provide instead of a "cloudfront.net" domain.
    /// To use this feature - you must provide the list of additional domains,
    /// and the ACM Certificate that CloudFront should use for these additional domains.
    /// 
    /// Note - CloudFront only accepts one additional certificate - therefore the certificate *must*
    /// use have SANs (Subject Alternative Names) for all domains listed.
    /// 
    /// sslMethod is optional - we default to SNI if not specified. See the notes on SSLMethod if you wish to use other SSL termination types.
    /// </summary>
    /// <remarks>default: sslMethod: SNI by default</remarks>
    [JsiiInterface(typeof(IAliasConfiguration), "@aws-cdk/aws-cloudfront.AliasConfiguration")]
    public interface IAliasConfiguration
    {
        [JsiiProperty("names", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}}}")]
        string[] Names
        {
            get;
        }

        [JsiiProperty("acmCertRef", "{\"fqn\":\"@aws-cdk/aws-certificatemanager.CertificateArn\"}")]
        CertificateArn AcmCertRef
        {
            get;
        }

        [JsiiProperty("sslMethod", "{\"fqn\":\"@aws-cdk/aws-cloudfront.SSLMethod\",\"optional\":true}")]
        SSLMethod SslMethod
        {
            get;
        }
    }
}
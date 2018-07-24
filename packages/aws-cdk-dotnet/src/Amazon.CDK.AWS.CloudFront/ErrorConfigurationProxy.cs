using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront
{
    [JsiiInterfaceProxy(typeof(IErrorConfiguration), "@aws-cdk/aws-cloudfront.ErrorConfiguration")]
    internal class ErrorConfigurationProxy : DeputyBase, IErrorConfiguration
    {
        private ErrorConfigurationProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The error code matched from the origin</summary>
        [JsiiProperty("originErrorCode", "{\"primitive\":\"number\"}")]
        public virtual double OriginErrorCode
        {
            get => GetInstanceProperty<double>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The error code that is sent to the caller.</summary>
        [JsiiProperty("respondWithErrorCode", "{\"primitive\":\"number\"}")]
        public virtual double RespondWithErrorCode
        {
            get => GetInstanceProperty<double>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The path to service instead</summary>
        [JsiiProperty("respondWithPage", "{\"primitive\":\"string\"}")]
        public virtual string RespondWithPage
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>How long before this error is retried.</summary>
        [JsiiProperty("cacheTtl", "{\"primitive\":\"number\",\"optional\":true}")]
        public virtual double? CacheTtl
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
        }
    }
}
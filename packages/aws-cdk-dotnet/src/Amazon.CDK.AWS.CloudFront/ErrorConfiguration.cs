using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront
{
    public class ErrorConfiguration : DeputyBase, IErrorConfiguration
    {
        /// <summary>The error code matched from the origin</summary>
        [JsiiProperty("originErrorCode", "{\"primitive\":\"number\"}", true)]
        public double OriginErrorCode
        {
            get;
            set;
        }

        /// <summary>The error code that is sent to the caller.</summary>
        [JsiiProperty("respondWithErrorCode", "{\"primitive\":\"number\"}", true)]
        public double RespondWithErrorCode
        {
            get;
            set;
        }

        /// <summary>The path to service instead</summary>
        [JsiiProperty("respondWithPage", "{\"primitive\":\"string\"}", true)]
        public string RespondWithPage
        {
            get;
            set;
        }

        /// <summary>How long before this error is retried.</summary>
        [JsiiProperty("cacheTtl", "{\"primitive\":\"number\",\"optional\":true}", true)]
        public double? CacheTtl
        {
            get;
            set;
        }
    }
}
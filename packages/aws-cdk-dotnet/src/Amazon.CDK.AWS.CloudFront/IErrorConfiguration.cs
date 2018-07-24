using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront
{
    [JsiiInterface(typeof(IErrorConfiguration), "@aws-cdk/aws-cloudfront.ErrorConfiguration")]
    public interface IErrorConfiguration
    {
        /// <summary>The error code matched from the origin</summary>
        [JsiiProperty("originErrorCode", "{\"primitive\":\"number\"}")]
        double OriginErrorCode
        {
            get;
            set;
        }

        /// <summary>The error code that is sent to the caller.</summary>
        [JsiiProperty("respondWithErrorCode", "{\"primitive\":\"number\"}")]
        double RespondWithErrorCode
        {
            get;
            set;
        }

        /// <summary>The path to service instead</summary>
        [JsiiProperty("respondWithPage", "{\"primitive\":\"string\"}")]
        string RespondWithPage
        {
            get;
            set;
        }

        /// <summary>How long before this error is retried.</summary>
        [JsiiProperty("cacheTtl", "{\"primitive\":\"number\",\"optional\":true}")]
        double? CacheTtl
        {
            get;
            set;
        }
    }
}
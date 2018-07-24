using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Route53.cloudformation.HealthCheckResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-healthcheck-healthcheckconfig.html </remarks>
    [JsiiInterface(typeof(IHealthCheckConfigProperty), "@aws-cdk/aws-route53.cloudformation.HealthCheckResource.HealthCheckConfigProperty")]
    public interface IHealthCheckConfigProperty
    {
        /// <summary>``HealthCheckResource.HealthCheckConfigProperty.AlarmIdentifier``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-healthcheck-healthcheckconfig.html#cfn-route53-healthcheck-healthcheckconfig-alarmidentifier </remarks>
        [JsiiProperty("alarmIdentifier", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-route53.cloudformation.HealthCheckResource.AlarmIdentifierProperty\"}]},\"optional\":true}")]
        object AlarmIdentifier
        {
            get;
            set;
        }

        /// <summary>``HealthCheckResource.HealthCheckConfigProperty.ChildHealthChecks``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-healthcheck-healthcheckconfig.html#cfn-route53-healthcheck-healthcheckconfig-childhealthchecks </remarks>
        [JsiiProperty("childHealthChecks", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object ChildHealthChecks
        {
            get;
            set;
        }

        /// <summary>``HealthCheckResource.HealthCheckConfigProperty.EnableSNI``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-healthcheck-healthcheckconfig.html#cfn-route53-healthcheck-healthcheckconfig-enablesni </remarks>
        [JsiiProperty("enableSni", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object EnableSni
        {
            get;
            set;
        }

        /// <summary>``HealthCheckResource.HealthCheckConfigProperty.FailureThreshold``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-healthcheck-healthcheckconfig.html#cfn-route53-healthcheck-healthcheckconfig-failurethreshold </remarks>
        [JsiiProperty("failureThreshold", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object FailureThreshold
        {
            get;
            set;
        }

        /// <summary>``HealthCheckResource.HealthCheckConfigProperty.FullyQualifiedDomainName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-healthcheck-healthcheckconfig.html#cfn-route53-healthcheck-healthcheckconfig-fullyqualifieddomainname </remarks>
        [JsiiProperty("fullyQualifiedDomainName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object FullyQualifiedDomainName
        {
            get;
            set;
        }

        /// <summary>``HealthCheckResource.HealthCheckConfigProperty.HealthThreshold``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-healthcheck-healthcheckconfig.html#cfn-route53-healthcheck-healthcheckconfig-healththreshold </remarks>
        [JsiiProperty("healthThreshold", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object HealthThreshold
        {
            get;
            set;
        }

        /// <summary>``HealthCheckResource.HealthCheckConfigProperty.IPAddress``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-healthcheck-healthcheckconfig.html#cfn-route53-healthcheck-healthcheckconfig-ipaddress </remarks>
        [JsiiProperty("ipAddress", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object IpAddress
        {
            get;
            set;
        }

        /// <summary>``HealthCheckResource.HealthCheckConfigProperty.InsufficientDataHealthStatus``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-healthcheck-healthcheckconfig.html#cfn-route53-healthcheck-healthcheckconfig-insufficientdatahealthstatus </remarks>
        [JsiiProperty("insufficientDataHealthStatus", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object InsufficientDataHealthStatus
        {
            get;
            set;
        }

        /// <summary>``HealthCheckResource.HealthCheckConfigProperty.Inverted``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-healthcheck-healthcheckconfig.html#cfn-route53-healthcheck-healthcheckconfig-inverted </remarks>
        [JsiiProperty("inverted", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Inverted
        {
            get;
            set;
        }

        /// <summary>``HealthCheckResource.HealthCheckConfigProperty.MeasureLatency``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-healthcheck-healthcheckconfig.html#cfn-route53-healthcheck-healthcheckconfig-measurelatency </remarks>
        [JsiiProperty("measureLatency", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object MeasureLatency
        {
            get;
            set;
        }

        /// <summary>``HealthCheckResource.HealthCheckConfigProperty.Port``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-healthcheck-healthcheckconfig.html#cfn-route53-healthcheck-healthcheckconfig-port </remarks>
        [JsiiProperty("port", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Port
        {
            get;
            set;
        }

        /// <summary>``HealthCheckResource.HealthCheckConfigProperty.Regions``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-healthcheck-healthcheckconfig.html#cfn-route53-healthcheck-healthcheckconfig-regions </remarks>
        [JsiiProperty("regions", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object Regions
        {
            get;
            set;
        }

        /// <summary>``HealthCheckResource.HealthCheckConfigProperty.RequestInterval``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-healthcheck-healthcheckconfig.html#cfn-route53-healthcheck-healthcheckconfig-requestinterval </remarks>
        [JsiiProperty("requestInterval", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object RequestInterval
        {
            get;
            set;
        }

        /// <summary>``HealthCheckResource.HealthCheckConfigProperty.ResourcePath``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-healthcheck-healthcheckconfig.html#cfn-route53-healthcheck-healthcheckconfig-resourcepath </remarks>
        [JsiiProperty("resourcePath", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ResourcePath
        {
            get;
            set;
        }

        /// <summary>``HealthCheckResource.HealthCheckConfigProperty.SearchString``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-healthcheck-healthcheckconfig.html#cfn-route53-healthcheck-healthcheckconfig-searchstring </remarks>
        [JsiiProperty("searchString", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object SearchString
        {
            get;
            set;
        }

        /// <summary>``HealthCheckResource.HealthCheckConfigProperty.Type``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-healthcheck-healthcheckconfig.html#cfn-route53-healthcheck-healthcheckconfig-type </remarks>
        [JsiiProperty("type", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Type
        {
            get;
            set;
        }
    }
}
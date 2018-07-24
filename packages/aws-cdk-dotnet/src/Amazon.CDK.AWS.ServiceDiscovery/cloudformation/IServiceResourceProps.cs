using Amazon.CDK;
using Amazon.CDK.AWS.ServiceDiscovery.cloudformation.ServiceResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ServiceDiscovery.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-service.html </remarks>
    [JsiiInterface(typeof(IServiceResourceProps), "@aws-cdk/aws-servicediscovery.cloudformation.ServiceResourceProps")]
    public interface IServiceResourceProps
    {
        /// <summary>``AWS::ServiceDiscovery::Service.DnsConfig``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-service.html#cfn-servicediscovery-service-dnsconfig </remarks>
        [JsiiProperty("dnsConfig", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-servicediscovery.cloudformation.ServiceResource.DnsConfigProperty\"}]}}")]
        object DnsConfig
        {
            get;
            set;
        }

        /// <summary>``AWS::ServiceDiscovery::Service.Description``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-service.html#cfn-servicediscovery-service-description </remarks>
        [JsiiProperty("description", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Description
        {
            get;
            set;
        }

        /// <summary>``AWS::ServiceDiscovery::Service.HealthCheckConfig``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-service.html#cfn-servicediscovery-service-healthcheckconfig </remarks>
        [JsiiProperty("healthCheckConfig", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-servicediscovery.cloudformation.ServiceResource.HealthCheckConfigProperty\"}]},\"optional\":true}")]
        object HealthCheckConfig
        {
            get;
            set;
        }

        /// <summary>``AWS::ServiceDiscovery::Service.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-service.html#cfn-servicediscovery-service-name </remarks>
        [JsiiProperty("serviceName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ServiceName
        {
            get;
            set;
        }
    }
}
using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.APIGateway.cloudformation.DeploymentResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-stagedescription-methodsetting.html </remarks>
    public class MethodSettingProperty : DeputyBase, Amazon.CDK.AWS.APIGateway.cloudformation.DeploymentResource.IMethodSettingProperty
    {
        /// <summary>``DeploymentResource.MethodSettingProperty.CacheDataEncrypted``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-stagedescription-methodsetting.html#cfn-apigateway-deployment-stagedescription-methodsetting-cachedataencrypted </remarks>
        [JsiiProperty("cacheDataEncrypted", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object CacheDataEncrypted
        {
            get;
            set;
        }

        /// <summary>``DeploymentResource.MethodSettingProperty.CacheTtlInSeconds``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-stagedescription-methodsetting.html#cfn-apigateway-deployment-stagedescription-methodsetting-cachettlinseconds </remarks>
        [JsiiProperty("cacheTtlInSeconds", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object CacheTtlInSeconds
        {
            get;
            set;
        }

        /// <summary>``DeploymentResource.MethodSettingProperty.CachingEnabled``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-stagedescription-methodsetting.html#cfn-apigateway-deployment-stagedescription-methodsetting-cachingenabled </remarks>
        [JsiiProperty("cachingEnabled", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object CachingEnabled
        {
            get;
            set;
        }

        /// <summary>``DeploymentResource.MethodSettingProperty.DataTraceEnabled``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-stagedescription-methodsetting.html#cfn-apigateway-deployment-stagedescription-methodsetting-datatraceenabled </remarks>
        [JsiiProperty("dataTraceEnabled", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object DataTraceEnabled
        {
            get;
            set;
        }

        /// <summary>``DeploymentResource.MethodSettingProperty.HttpMethod``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-stagedescription-methodsetting.html#cfn-apigateway-deployment-stagedescription-methodsetting-httpmethod </remarks>
        [JsiiProperty("httpMethod", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object HttpMethod
        {
            get;
            set;
        }

        /// <summary>``DeploymentResource.MethodSettingProperty.LoggingLevel``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-stagedescription-methodsetting.html#cfn-apigateway-deployment-stagedescription-methodsetting-logginglevel </remarks>
        [JsiiProperty("loggingLevel", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object LoggingLevel
        {
            get;
            set;
        }

        /// <summary>``DeploymentResource.MethodSettingProperty.MetricsEnabled``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-stagedescription-methodsetting.html#cfn-apigateway-deployment-stagedescription-methodsetting-metricsenabled </remarks>
        [JsiiProperty("metricsEnabled", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object MetricsEnabled
        {
            get;
            set;
        }

        /// <summary>``DeploymentResource.MethodSettingProperty.ResourcePath``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-stagedescription-methodsetting.html#cfn-apigateway-deployment-stagedescription-methodsetting-resourcepath </remarks>
        [JsiiProperty("resourcePath", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object ResourcePath
        {
            get;
            set;
        }

        /// <summary>``DeploymentResource.MethodSettingProperty.ThrottlingBurstLimit``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-stagedescription-methodsetting.html#cfn-apigateway-deployment-stagedescription-methodsetting-throttlingburstlimit </remarks>
        [JsiiProperty("throttlingBurstLimit", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object ThrottlingBurstLimit
        {
            get;
            set;
        }

        /// <summary>``DeploymentResource.MethodSettingProperty.ThrottlingRateLimit``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-stagedescription-methodsetting.html#cfn-apigateway-deployment-stagedescription-methodsetting-throttlingratelimit </remarks>
        [JsiiProperty("throttlingRateLimit", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object ThrottlingRateLimit
        {
            get;
            set;
        }
    }
}
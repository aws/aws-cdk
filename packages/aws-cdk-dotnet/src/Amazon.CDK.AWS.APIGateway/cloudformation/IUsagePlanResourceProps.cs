using Amazon.CDK;
using Amazon.CDK.AWS.APIGateway.cloudformation.UsagePlanResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.APIGateway.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-usageplan.html </remarks>
    [JsiiInterface(typeof(IUsagePlanResourceProps), "@aws-cdk/aws-apigateway.cloudformation.UsagePlanResourceProps")]
    public interface IUsagePlanResourceProps
    {
        /// <summary>``AWS::ApiGateway::UsagePlan.ApiStages``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-usageplan.html#cfn-apigateway-usageplan-apistages </remarks>
        [JsiiProperty("apiStages", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-apigateway.cloudformation.UsagePlanResource.ApiStageProperty\"}]}}}}]},\"optional\":true}")]
        object ApiStages
        {
            get;
            set;
        }

        /// <summary>``AWS::ApiGateway::UsagePlan.Description``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-usageplan.html#cfn-apigateway-usageplan-description </remarks>
        [JsiiProperty("description", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Description
        {
            get;
            set;
        }

        /// <summary>``AWS::ApiGateway::UsagePlan.Quota``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-usageplan.html#cfn-apigateway-usageplan-quota </remarks>
        [JsiiProperty("quota", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-apigateway.cloudformation.UsagePlanResource.QuotaSettingsProperty\"}]},\"optional\":true}")]
        object Quota
        {
            get;
            set;
        }

        /// <summary>``AWS::ApiGateway::UsagePlan.Throttle``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-usageplan.html#cfn-apigateway-usageplan-throttle </remarks>
        [JsiiProperty("throttle", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-apigateway.cloudformation.UsagePlanResource.ThrottleSettingsProperty\"}]},\"optional\":true}")]
        object Throttle
        {
            get;
            set;
        }

        /// <summary>``AWS::ApiGateway::UsagePlan.UsagePlanName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-usageplan.html#cfn-apigateway-usageplan-usageplanname </remarks>
        [JsiiProperty("usagePlanName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object UsagePlanName
        {
            get;
            set;
        }
    }
}
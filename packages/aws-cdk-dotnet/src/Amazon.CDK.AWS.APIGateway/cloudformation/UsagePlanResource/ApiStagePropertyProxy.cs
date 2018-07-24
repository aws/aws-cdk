using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.APIGateway.cloudformation.UsagePlanResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-usageplan-apistage.html </remarks>
    [JsiiInterfaceProxy(typeof(IApiStageProperty), "@aws-cdk/aws-apigateway.cloudformation.UsagePlanResource.ApiStageProperty")]
    internal class ApiStagePropertyProxy : DeputyBase, IApiStageProperty
    {
        private ApiStagePropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``UsagePlanResource.ApiStageProperty.ApiId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-usageplan-apistage.html#cfn-apigateway-usageplan-apistage-apiid </remarks>
        [JsiiProperty("apiId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ApiId
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``UsagePlanResource.ApiStageProperty.Stage``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-usageplan-apistage.html#cfn-apigateway-usageplan-apistage-stage </remarks>
        [JsiiProperty("stage", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Stage
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
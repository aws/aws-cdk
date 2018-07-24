using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.APIGateway.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-usageplankey.html </remarks>
    public class UsagePlanKeyResourceProps : DeputyBase, IUsagePlanKeyResourceProps
    {
        /// <summary>``AWS::ApiGateway::UsagePlanKey.KeyId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-usageplankey.html#cfn-apigateway-usageplankey-keyid </remarks>
        [JsiiProperty("keyId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object KeyId
        {
            get;
            set;
        }

        /// <summary>``AWS::ApiGateway::UsagePlanKey.KeyType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-usageplankey.html#cfn-apigateway-usageplankey-keytype </remarks>
        [JsiiProperty("keyType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object KeyType
        {
            get;
            set;
        }

        /// <summary>``AWS::ApiGateway::UsagePlanKey.UsagePlanId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-usageplankey.html#cfn-apigateway-usageplankey-usageplanid </remarks>
        [JsiiProperty("usagePlanId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object UsagePlanId
        {
            get;
            set;
        }
    }
}
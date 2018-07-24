using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.APIGateway.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-account.html </remarks>
    [JsiiInterface(typeof(IAccountResourceProps), "@aws-cdk/aws-apigateway.cloudformation.AccountResourceProps")]
    public interface IAccountResourceProps
    {
        /// <summary>``AWS::ApiGateway::Account.CloudWatchRoleArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-account.html#cfn-apigateway-account-cloudwatchrolearn </remarks>
        [JsiiProperty("cloudWatchRoleArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object CloudWatchRoleArn
        {
            get;
            set;
        }
    }
}
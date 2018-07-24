using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront.cloudformation.DistributionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-lambdafunctionassociation.html </remarks>
    [JsiiInterface(typeof(ILambdaFunctionAssociationProperty), "@aws-cdk/aws-cloudfront.cloudformation.DistributionResource.LambdaFunctionAssociationProperty")]
    public interface ILambdaFunctionAssociationProperty
    {
        /// <summary>``DistributionResource.LambdaFunctionAssociationProperty.EventType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-lambdafunctionassociation.html#cfn-cloudfront-distribution-lambdafunctionassociation-eventtype </remarks>
        [JsiiProperty("eventType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object EventType
        {
            get;
            set;
        }

        /// <summary>``DistributionResource.LambdaFunctionAssociationProperty.LambdaFunctionARN``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-lambdafunctionassociation.html#cfn-cloudfront-distribution-lambdafunctionassociation-lambdafunctionarn </remarks>
        [JsiiProperty("lambdaFunctionArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object LambdaFunctionArn
        {
            get;
            set;
        }
    }
}
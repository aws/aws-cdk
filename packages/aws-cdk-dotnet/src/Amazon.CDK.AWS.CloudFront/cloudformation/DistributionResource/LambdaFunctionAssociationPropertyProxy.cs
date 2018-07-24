using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront.cloudformation.DistributionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-lambdafunctionassociation.html </remarks>
    [JsiiInterfaceProxy(typeof(ILambdaFunctionAssociationProperty), "@aws-cdk/aws-cloudfront.cloudformation.DistributionResource.LambdaFunctionAssociationProperty")]
    internal class LambdaFunctionAssociationPropertyProxy : DeputyBase, ILambdaFunctionAssociationProperty
    {
        private LambdaFunctionAssociationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``DistributionResource.LambdaFunctionAssociationProperty.EventType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-lambdafunctionassociation.html#cfn-cloudfront-distribution-lambdafunctionassociation-eventtype </remarks>
        [JsiiProperty("eventType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object EventType
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``DistributionResource.LambdaFunctionAssociationProperty.LambdaFunctionARN``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-lambdafunctionassociation.html#cfn-cloudfront-distribution-lambdafunctionassociation-lambdafunctionarn </remarks>
        [JsiiProperty("lambdaFunctionArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object LambdaFunctionArn
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
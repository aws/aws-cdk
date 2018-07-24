using Amazon.CDK;
using Amazon.CDK.AWS.GameLift.cloudformation.AliasResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.GameLift.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-alias.html </remarks>
    [JsiiInterfaceProxy(typeof(IAliasResourceProps), "@aws-cdk/aws-gamelift.cloudformation.AliasResourceProps")]
    internal class AliasResourcePropsProxy : DeputyBase, IAliasResourceProps
    {
        private AliasResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::GameLift::Alias.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-alias.html#cfn-gamelift-alias-name </remarks>
        [JsiiProperty("aliasName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object AliasName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::GameLift::Alias.RoutingStrategy``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-alias.html#cfn-gamelift-alias-routingstrategy </remarks>
        [JsiiProperty("routingStrategy", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-gamelift.cloudformation.AliasResource.RoutingStrategyProperty\"}]}}")]
        public virtual object RoutingStrategy
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::GameLift::Alias.Description``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-alias.html#cfn-gamelift-alias-description </remarks>
        [JsiiProperty("description", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Description
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
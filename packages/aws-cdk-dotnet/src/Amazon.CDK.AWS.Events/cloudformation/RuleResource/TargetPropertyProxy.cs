using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Events.cloudformation.RuleResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html </remarks>
    [JsiiInterfaceProxy(typeof(ITargetProperty), "@aws-cdk/aws-events.cloudformation.RuleResource.TargetProperty")]
    internal class TargetPropertyProxy : DeputyBase, ITargetProperty
    {
        private TargetPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``RuleResource.TargetProperty.Arn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html#cfn-events-rule-target-arn </remarks>
        [JsiiProperty("arn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Arn
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``RuleResource.TargetProperty.EcsParameters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html#cfn-events-rule-target-ecsparameters </remarks>
        [JsiiProperty("ecsParameters", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/aws-events.cloudformation.RuleResource.EcsParametersProperty\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object EcsParameters
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``RuleResource.TargetProperty.Id``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html#cfn-events-rule-target-id </remarks>
        [JsiiProperty("id", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Id
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``RuleResource.TargetProperty.Input``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html#cfn-events-rule-target-input </remarks>
        [JsiiProperty("input", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Input
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``RuleResource.TargetProperty.InputPath``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html#cfn-events-rule-target-inputpath </remarks>
        [JsiiProperty("inputPath", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object InputPath
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``RuleResource.TargetProperty.InputTransformer``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html#cfn-events-rule-target-inputtransformer </remarks>
        [JsiiProperty("inputTransformer", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-events.cloudformation.RuleResource.InputTransformerProperty\"}]},\"optional\":true}")]
        public virtual object InputTransformer
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``RuleResource.TargetProperty.KinesisParameters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html#cfn-events-rule-target-kinesisparameters </remarks>
        [JsiiProperty("kinesisParameters", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/aws-events.cloudformation.RuleResource.KinesisParametersProperty\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object KinesisParameters
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``RuleResource.TargetProperty.RoleArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html#cfn-events-rule-target-rolearn </remarks>
        [JsiiProperty("roleArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object RoleArn
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``RuleResource.TargetProperty.RunCommandParameters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html#cfn-events-rule-target-runcommandparameters </remarks>
        [JsiiProperty("runCommandParameters", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/aws-events.cloudformation.RuleResource.RunCommandParametersProperty\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object RunCommandParameters
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
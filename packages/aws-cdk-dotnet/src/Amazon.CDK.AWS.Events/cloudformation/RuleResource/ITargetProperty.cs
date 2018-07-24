using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Events.cloudformation.RuleResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html </remarks>
    [JsiiInterface(typeof(ITargetProperty), "@aws-cdk/aws-events.cloudformation.RuleResource.TargetProperty")]
    public interface ITargetProperty
    {
        /// <summary>``RuleResource.TargetProperty.Arn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html#cfn-events-rule-target-arn </remarks>
        [JsiiProperty("arn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Arn
        {
            get;
            set;
        }

        /// <summary>``RuleResource.TargetProperty.EcsParameters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html#cfn-events-rule-target-ecsparameters </remarks>
        [JsiiProperty("ecsParameters", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/aws-events.cloudformation.RuleResource.EcsParametersProperty\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object EcsParameters
        {
            get;
            set;
        }

        /// <summary>``RuleResource.TargetProperty.Id``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html#cfn-events-rule-target-id </remarks>
        [JsiiProperty("id", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Id
        {
            get;
            set;
        }

        /// <summary>``RuleResource.TargetProperty.Input``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html#cfn-events-rule-target-input </remarks>
        [JsiiProperty("input", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Input
        {
            get;
            set;
        }

        /// <summary>``RuleResource.TargetProperty.InputPath``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html#cfn-events-rule-target-inputpath </remarks>
        [JsiiProperty("inputPath", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object InputPath
        {
            get;
            set;
        }

        /// <summary>``RuleResource.TargetProperty.InputTransformer``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html#cfn-events-rule-target-inputtransformer </remarks>
        [JsiiProperty("inputTransformer", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-events.cloudformation.RuleResource.InputTransformerProperty\"}]},\"optional\":true}")]
        object InputTransformer
        {
            get;
            set;
        }

        /// <summary>``RuleResource.TargetProperty.KinesisParameters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html#cfn-events-rule-target-kinesisparameters </remarks>
        [JsiiProperty("kinesisParameters", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/aws-events.cloudformation.RuleResource.KinesisParametersProperty\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object KinesisParameters
        {
            get;
            set;
        }

        /// <summary>``RuleResource.TargetProperty.RoleArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html#cfn-events-rule-target-rolearn </remarks>
        [JsiiProperty("roleArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object RoleArn
        {
            get;
            set;
        }

        /// <summary>``RuleResource.TargetProperty.RunCommandParameters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html#cfn-events-rule-target-runcommandparameters </remarks>
        [JsiiProperty("runCommandParameters", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/aws-events.cloudformation.RuleResource.RunCommandParametersProperty\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object RunCommandParameters
        {
            get;
            set;
        }
    }
}
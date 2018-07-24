using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3.cloudformation.BucketResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-routingrules-routingrulecondition.html </remarks>
    [JsiiInterfaceProxy(typeof(IRoutingRuleConditionProperty), "@aws-cdk/aws-s3.cloudformation.BucketResource.RoutingRuleConditionProperty")]
    internal class RoutingRuleConditionPropertyProxy : DeputyBase, IRoutingRuleConditionProperty
    {
        private RoutingRuleConditionPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``BucketResource.RoutingRuleConditionProperty.HttpErrorCodeReturnedEquals``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-routingrules-routingrulecondition.html#cfn-s3-websiteconfiguration-routingrules-routingrulecondition-httperrorcodereturnedequals </remarks>
        [JsiiProperty("httpErrorCodeReturnedEquals", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object HttpErrorCodeReturnedEquals
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``BucketResource.RoutingRuleConditionProperty.KeyPrefixEquals``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-routingrules-routingrulecondition.html#cfn-s3-websiteconfiguration-routingrules-routingrulecondition-keyprefixequals </remarks>
        [JsiiProperty("keyPrefixEquals", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object KeyPrefixEquals
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
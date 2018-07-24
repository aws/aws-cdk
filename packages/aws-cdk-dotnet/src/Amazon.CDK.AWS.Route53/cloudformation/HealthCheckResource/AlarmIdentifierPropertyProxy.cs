using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Route53.cloudformation.HealthCheckResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-healthcheck-alarmidentifier.html </remarks>
    [JsiiInterfaceProxy(typeof(IAlarmIdentifierProperty), "@aws-cdk/aws-route53.cloudformation.HealthCheckResource.AlarmIdentifierProperty")]
    internal class AlarmIdentifierPropertyProxy : DeputyBase, IAlarmIdentifierProperty
    {
        private AlarmIdentifierPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``HealthCheckResource.AlarmIdentifierProperty.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-healthcheck-alarmidentifier.html#cfn-route53-healthcheck-alarmidentifier-name </remarks>
        [JsiiProperty("name", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Name
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``HealthCheckResource.AlarmIdentifierProperty.Region``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-healthcheck-alarmidentifier.html#cfn-route53-healthcheck-alarmidentifier-region </remarks>
        [JsiiProperty("region", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Region
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
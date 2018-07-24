using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Serverless.cloudformation.FunctionResource
{
    /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#iotrule </remarks>
    [JsiiInterfaceProxy(typeof(IIoTRuleEventProperty), "@aws-cdk/aws-serverless.cloudformation.FunctionResource.IoTRuleEventProperty")]
    internal class IoTRuleEventPropertyProxy : DeputyBase, IIoTRuleEventProperty
    {
        private IoTRuleEventPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``FunctionResource.IoTRuleEventProperty.AwsIotSqlVersion``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#iotrule </remarks>
        [JsiiProperty("awsIotSqlVersion", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object AwsIotSqlVersion
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``FunctionResource.IoTRuleEventProperty.Sql``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#iotrule </remarks>
        [JsiiProperty("sql", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Sql
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
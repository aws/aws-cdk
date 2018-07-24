using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Serverless.cloudformation.FunctionResource
{
    /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#iotrule </remarks>
    public class IoTRuleEventProperty : DeputyBase, IIoTRuleEventProperty
    {
        /// <summary>``FunctionResource.IoTRuleEventProperty.AwsIotSqlVersion``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#iotrule </remarks>
        [JsiiProperty("awsIotSqlVersion", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object AwsIotSqlVersion
        {
            get;
            set;
        }

        /// <summary>``FunctionResource.IoTRuleEventProperty.Sql``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#iotrule </remarks>
        [JsiiProperty("sql", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object Sql
        {
            get;
            set;
        }
    }
}
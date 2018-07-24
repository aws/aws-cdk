using Amazon.CDK;
using Amazon.CDK.AWS.Serverless.cloudformation.SimpleTableResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Serverless.cloudformation
{
    /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesssimpletable </remarks>
    public class SimpleTableResourceProps : DeputyBase, ISimpleTableResourceProps
    {
        /// <summary>``AWS::Serverless::SimpleTable.PrimaryKey``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#primary-key-object </remarks>
        [JsiiProperty("primaryKey", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-serverless.cloudformation.SimpleTableResource.PrimaryKeyProperty\"}]},\"optional\":true}", true)]
        public object PrimaryKey
        {
            get;
            set;
        }

        /// <summary>``AWS::Serverless::SimpleTable.ProvisionedThroughput``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-provisionedthroughput.html </remarks>
        [JsiiProperty("provisionedThroughput", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-serverless.cloudformation.SimpleTableResource.ProvisionedThroughputProperty\"}]},\"optional\":true}", true)]
        public object ProvisionedThroughput
        {
            get;
            set;
        }
    }
}
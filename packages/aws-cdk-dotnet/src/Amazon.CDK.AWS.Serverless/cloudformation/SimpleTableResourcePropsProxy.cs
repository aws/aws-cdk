using Amazon.CDK;
using Amazon.CDK.AWS.Serverless.cloudformation.SimpleTableResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Serverless.cloudformation
{
    /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesssimpletable </remarks>
    [JsiiInterfaceProxy(typeof(ISimpleTableResourceProps), "@aws-cdk/aws-serverless.cloudformation.SimpleTableResourceProps")]
    internal class SimpleTableResourcePropsProxy : DeputyBase, ISimpleTableResourceProps
    {
        private SimpleTableResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::Serverless::SimpleTable.PrimaryKey``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#primary-key-object </remarks>
        [JsiiProperty("primaryKey", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-serverless.cloudformation.SimpleTableResource.PrimaryKeyProperty\"}]},\"optional\":true}")]
        public virtual object PrimaryKey
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::Serverless::SimpleTable.ProvisionedThroughput``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-provisionedthroughput.html </remarks>
        [JsiiProperty("provisionedThroughput", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-serverless.cloudformation.SimpleTableResource.ProvisionedThroughputProperty\"}]},\"optional\":true}")]
        public virtual object ProvisionedThroughput
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
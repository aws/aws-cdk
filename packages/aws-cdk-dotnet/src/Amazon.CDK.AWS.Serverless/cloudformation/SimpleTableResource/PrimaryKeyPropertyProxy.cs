using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Serverless.cloudformation.SimpleTableResource
{
    /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#primary-key-object </remarks>
    [JsiiInterfaceProxy(typeof(IPrimaryKeyProperty), "@aws-cdk/aws-serverless.cloudformation.SimpleTableResource.PrimaryKeyProperty")]
    internal class PrimaryKeyPropertyProxy : DeputyBase, IPrimaryKeyProperty
    {
        private PrimaryKeyPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``SimpleTableResource.PrimaryKeyProperty.Name``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#primary-key-object </remarks>
        [JsiiProperty("name", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Name
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``SimpleTableResource.PrimaryKeyProperty.Type``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#primary-key-object </remarks>
        [JsiiProperty("type", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Type
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
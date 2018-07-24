using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Serverless.cloudformation.FunctionResource
{
    /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#environment-object </remarks>
    [JsiiInterfaceProxy(typeof(IFunctionEnvironmentProperty), "@aws-cdk/aws-serverless.cloudformation.FunctionResource.FunctionEnvironmentProperty")]
    internal class FunctionEnvironmentPropertyProxy : DeputyBase, IFunctionEnvironmentProperty
    {
        private FunctionEnvironmentPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``FunctionResource.FunctionEnvironmentProperty.Variables``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#environment-object </remarks>
        [JsiiProperty("variables", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]}}")]
        public virtual object Variables
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
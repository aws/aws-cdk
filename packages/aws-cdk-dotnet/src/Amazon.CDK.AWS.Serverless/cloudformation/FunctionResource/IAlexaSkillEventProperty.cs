using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Serverless.cloudformation.FunctionResource
{
    /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#alexaskill </remarks>
    [JsiiInterface(typeof(IAlexaSkillEventProperty), "@aws-cdk/aws-serverless.cloudformation.FunctionResource.AlexaSkillEventProperty")]
    public interface IAlexaSkillEventProperty
    {
        /// <summary>``FunctionResource.AlexaSkillEventProperty.Variables``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#alexaskill </remarks>
        [JsiiProperty("variables", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object Variables
        {
            get;
            set;
        }
    }
}
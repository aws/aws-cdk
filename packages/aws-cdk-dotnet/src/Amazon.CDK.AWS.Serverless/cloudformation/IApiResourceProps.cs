using Amazon.CDK;
using Amazon.CDK.AWS.Serverless.cloudformation.ApiResource;
using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Serverless.cloudformation
{
    /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi </remarks>
    [JsiiInterface(typeof(IApiResourceProps), "@aws-cdk/aws-serverless.cloudformation.ApiResourceProps")]
    public interface IApiResourceProps
    {
        /// <summary>``AWS::Serverless::Api.StageName``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi </remarks>
        [JsiiProperty("stageName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object StageName
        {
            get;
            set;
        }

        /// <summary>``AWS::Serverless::Api.CacheClusterEnabled``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi </remarks>
        [JsiiProperty("cacheClusterEnabled", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object CacheClusterEnabled
        {
            get;
            set;
        }

        /// <summary>``AWS::Serverless::Api.CacheClusterSize``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi </remarks>
        [JsiiProperty("cacheClusterSize", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object CacheClusterSize
        {
            get;
            set;
        }

        /// <summary>``AWS::Serverless::Api.DefinitionBody``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi </remarks>
        [JsiiProperty("definitionBody", "{\"union\":{\"types\":[{\"primitive\":\"json\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object DefinitionBody
        {
            get;
            set;
        }

        /// <summary>``AWS::Serverless::Api.DefinitionUri``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi </remarks>
        [JsiiProperty("definitionUri", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-serverless.cloudformation.ApiResource.S3LocationProperty\"}]},\"optional\":true}")]
        object DefinitionUri
        {
            get;
            set;
        }

        /// <summary>``AWS::Serverless::Api.Name``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi </remarks>
        [JsiiProperty("apiName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ApiName
        {
            get;
            set;
        }

        /// <summary>``AWS::Serverless::Api.Variables``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi </remarks>
        [JsiiProperty("variables", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object Variables
        {
            get;
            set;
        }
    }
}
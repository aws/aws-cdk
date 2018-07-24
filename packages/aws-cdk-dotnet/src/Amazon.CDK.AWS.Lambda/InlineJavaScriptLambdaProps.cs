using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Lambda
{
    public class InlineJavaScriptLambdaProps : DeputyBase, IInlineJavaScriptLambdaProps
    {
        /// <summary>
        /// The lambda handler as a javascript function.
        /// 
        /// This must be a javascript function object. The reason it is `any` is due
        /// to limitations of the jsii compiler.
        /// </summary>
        [JsiiProperty("handler", "{\"fqn\":\"@aws-cdk/aws-lambda.IJavaScriptLambdaHandler\"}", true)]
        public IIJavaScriptLambdaHandler Handler
        {
            get;
            set;
        }

        /// <summary>A description of the function.</summary>
        [JsiiProperty("description", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string Description
        {
            get;
            set;
        }

        /// <summary>
        /// The function execution time (in seconds) after which Lambda terminates
        /// the function. Because the execution time affects cost, set this value
        /// based on the function's expected execution time.
        /// </summary>
        /// <remarks>default: 30 seconds.</remarks>
        [JsiiProperty("timeout", "{\"primitive\":\"number\",\"optional\":true}", true)]
        public double? Timeout
        {
            get;
            set;
        }

        /// <summary>
        /// Key-value pairs that Lambda caches and makes available for your Lambda
        /// functions. Use environment variables to apply configuration changes, such
        /// as test and production environment configurations, without changing your
        /// Lambda function source code.
        /// </summary>
        [JsiiProperty("environment", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}},\"optional\":true}", true)]
        public IDictionary<string, object> Environment
        {
            get;
            set;
        }

        /// <summary>
        /// The runtime environment for the Lambda function that you are uploading.
        /// For valid values, see the Runtime property in the AWS Lambda Developer
        /// Guide.
        /// </summary>
        /// <remarks>default: NodeJS810</remarks>
        [JsiiProperty("runtime", "{\"fqn\":\"@aws-cdk/aws-lambda.InlinableJavascriptLambdaRuntime\",\"optional\":true}", true)]
        public IInlinableJavascriptLambdaRuntime Runtime
        {
            get;
            set;
        }

        /// <summary>
        /// A name for the function. If you don't specify a name, AWS CloudFormation
        /// generates a unique physical ID and uses that ID for the function's name.
        /// For more information, see Name Type.
        /// </summary>
        [JsiiProperty("functionName", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string FunctionName
        {
            get;
            set;
        }

        /// <summary>
        /// The amount of memory, in MB, that is allocated to your Lambda function.
        /// Lambda uses this value to proportionally allocate the amount of CPU
        /// power. For more information, see Resource Model in the AWS Lambda
        /// Developer Guide.
        /// </summary>
        /// <remarks>default: The default value is 128 MB</remarks>
        [JsiiProperty("memorySize", "{\"primitive\":\"number\",\"optional\":true}", true)]
        public double? MemorySize
        {
            get;
            set;
        }
    }
}
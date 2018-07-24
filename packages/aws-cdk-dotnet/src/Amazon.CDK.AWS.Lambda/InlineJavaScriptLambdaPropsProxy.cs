using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Lambda
{
    [JsiiInterfaceProxy(typeof(IInlineJavaScriptLambdaProps), "@aws-cdk/aws-lambda.InlineJavaScriptLambdaProps")]
    internal class InlineJavaScriptLambdaPropsProxy : DeputyBase, IInlineJavaScriptLambdaProps
    {
        private InlineJavaScriptLambdaPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>
        /// The lambda handler as a javascript function.
        /// 
        /// This must be a javascript function object. The reason it is `any` is due
        /// to limitations of the jsii compiler.
        /// </summary>
        [JsiiProperty("handler", "{\"fqn\":\"@aws-cdk/aws-lambda.IJavaScriptLambdaHandler\"}")]
        public virtual IIJavaScriptLambdaHandler Handler
        {
            get => GetInstanceProperty<IIJavaScriptLambdaHandler>();
            set => SetInstanceProperty(value);
        }

        /// <summary>A description of the function.</summary>
        [JsiiProperty("description", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string Description
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// The function execution time (in seconds) after which Lambda terminates
        /// the function. Because the execution time affects cost, set this value
        /// based on the function's expected execution time.
        /// </summary>
        /// <remarks>default: 30 seconds.</remarks>
        [JsiiProperty("timeout", "{\"primitive\":\"number\",\"optional\":true}")]
        public virtual double? Timeout
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// Key-value pairs that Lambda caches and makes available for your Lambda
        /// functions. Use environment variables to apply configuration changes, such
        /// as test and production environment configurations, without changing your
        /// Lambda function source code.
        /// </summary>
        [JsiiProperty("environment", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}},\"optional\":true}")]
        public virtual IDictionary<string, object> Environment
        {
            get => GetInstanceProperty<IDictionary<string, object>>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// The runtime environment for the Lambda function that you are uploading.
        /// For valid values, see the Runtime property in the AWS Lambda Developer
        /// Guide.
        /// </summary>
        /// <remarks>default: NodeJS810</remarks>
        [JsiiProperty("runtime", "{\"fqn\":\"@aws-cdk/aws-lambda.InlinableJavascriptLambdaRuntime\",\"optional\":true}")]
        public virtual IInlinableJavascriptLambdaRuntime Runtime
        {
            get => GetInstanceProperty<IInlinableJavascriptLambdaRuntime>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// A name for the function. If you don't specify a name, AWS CloudFormation
        /// generates a unique physical ID and uses that ID for the function's name.
        /// For more information, see Name Type.
        /// </summary>
        [JsiiProperty("functionName", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string FunctionName
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// The amount of memory, in MB, that is allocated to your Lambda function.
        /// Lambda uses this value to proportionally allocate the amount of CPU
        /// power. For more information, see Resource Model in the AWS Lambda
        /// Developer Guide.
        /// </summary>
        /// <remarks>default: The default value is 128 MB</remarks>
        [JsiiProperty("memorySize", "{\"primitive\":\"number\",\"optional\":true}")]
        public virtual double? MemorySize
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
        }
    }
}
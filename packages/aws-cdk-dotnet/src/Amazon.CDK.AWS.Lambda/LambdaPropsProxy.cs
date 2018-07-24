using Amazon.CDK;
using Amazon.CDK.AWS.IAM;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Lambda
{
    [JsiiInterfaceProxy(typeof(ILambdaProps), "@aws-cdk/aws-lambda.LambdaProps")]
    internal class LambdaPropsProxy : DeputyBase, ILambdaProps
    {
        private LambdaPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>
        /// The source code of your Lambda function. You can point to a file in an
        /// Amazon Simple Storage Service (Amazon S3) bucket or specify your source
        /// code as inline text.
        /// </summary>
        [JsiiProperty("code", "{\"fqn\":\"@aws-cdk/aws-lambda.LambdaCode\"}")]
        public virtual LambdaCode Code
        {
            get => GetInstanceProperty<LambdaCode>();
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
        /// The name of the function (within your source code) that Lambda calls to
        /// start running your code. For more information, see the Handler property
        /// in the AWS Lambda Developer Guide.
        /// 
        /// NOTE: If you specify your source code as inline text by specifying the
        /// ZipFile property within the Code property, specify index.function_name as
        /// the handler.
        /// </summary>
        [JsiiProperty("handler", "{\"primitive\":\"string\"}")]
        public virtual string Handler
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// The function execution time (in seconds) after which Lambda terminates
        /// the function. Because the execution time affects cost, set this value
        /// based on the function's expected execution time.
        /// </summary>
        /// <remarks>default: 3 seconds.</remarks>
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
        [JsiiProperty("runtime", "{\"fqn\":\"@aws-cdk/aws-lambda.LambdaRuntime\"}")]
        public virtual LambdaRuntime Runtime
        {
            get => GetInstanceProperty<LambdaRuntime>();
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

        /// <summary>
        /// Initial policy statements to add to the created Lambda Role.
        /// 
        /// You can call `addToRolePolicy` to the created lambda to add statements post creation.
        /// </summary>
        [JsiiProperty("initialPolicy", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/cdk.PolicyStatement\"}},\"optional\":true}")]
        public virtual PolicyStatement[] InitialPolicy
        {
            get => GetInstanceProperty<PolicyStatement[]>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// Lambda execution role.
        /// 
        /// This is the role that will be assumed by the function upon execution.
        /// It controls the permissions that the function will have. The Role must
        /// be assumable by the 'lambda.amazonaws.com' service principal.
        /// </summary>
        /// <remarks>
        /// default: a unique role will be generated for this lambda function.
        /// Both supplied and generated roles can always be changed by calling `addToRolePolicy`.
        /// </remarks>
        [JsiiProperty("role", "{\"fqn\":\"@aws-cdk/aws-iam.Role\",\"optional\":true}")]
        public virtual Role Role
        {
            get => GetInstanceProperty<Role>();
            set => SetInstanceProperty(value);
        }
    }
}
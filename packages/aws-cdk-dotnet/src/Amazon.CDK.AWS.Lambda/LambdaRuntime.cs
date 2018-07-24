using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda
{
    /// <summary>Lambda function runtime environment.</summary>
    [JsiiClass(typeof(LambdaRuntime), "@aws-cdk/aws-lambda.LambdaRuntime", "[{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-lambda.LambdaRuntimeProps\",\"optional\":true}}]")]
    public class LambdaRuntime : DeputyBase
    {
        public LambdaRuntime(string name, ILambdaRuntimeProps props): base(new DeputyProps(new object[]{name, props}))
        {
        }

        protected LambdaRuntime(ByRefValue reference): base(reference)
        {
        }

        protected LambdaRuntime(DeputyProps props): base(props)
        {
        }

        [JsiiProperty("NodeJS", "{\"fqn\":\"@aws-cdk/aws-lambda.InlinableJavascriptLambdaRuntime\"}")]
        public static IInlinableJavascriptLambdaRuntime NodeJS
        {
            get;
        }

        = GetStaticProperty<IInlinableJavascriptLambdaRuntime>(typeof(LambdaRuntime));
        [JsiiProperty("NodeJS43", "{\"fqn\":\"@aws-cdk/aws-lambda.InlinableJavascriptLambdaRuntime\"}")]
        public static IInlinableJavascriptLambdaRuntime NodeJS43
        {
            get;
        }

        = GetStaticProperty<IInlinableJavascriptLambdaRuntime>(typeof(LambdaRuntime));
        [JsiiProperty("NodeJS43Edge", "{\"fqn\":\"@aws-cdk/aws-lambda.LambdaRuntime\"}")]
        public static LambdaRuntime NodeJS43Edge
        {
            get;
        }

        = GetStaticProperty<LambdaRuntime>(typeof(LambdaRuntime));
        [JsiiProperty("NodeJS610", "{\"fqn\":\"@aws-cdk/aws-lambda.InlinableJavascriptLambdaRuntime\"}")]
        public static IInlinableJavascriptLambdaRuntime NodeJS610
        {
            get;
        }

        = GetStaticProperty<IInlinableJavascriptLambdaRuntime>(typeof(LambdaRuntime));
        [JsiiProperty("NodeJS810", "{\"fqn\":\"@aws-cdk/aws-lambda.LambdaRuntime\"}")]
        public static LambdaRuntime NodeJS810
        {
            get;
        }

        = GetStaticProperty<LambdaRuntime>(typeof(LambdaRuntime));
        [JsiiProperty("Java8", "{\"fqn\":\"@aws-cdk/aws-lambda.LambdaRuntime\"}")]
        public static LambdaRuntime Java8
        {
            get;
        }

        = GetStaticProperty<LambdaRuntime>(typeof(LambdaRuntime));
        [JsiiProperty("Python27", "{\"fqn\":\"@aws-cdk/aws-lambda.InlinableLambdaRuntime\"}")]
        public static IInlinableLambdaRuntime Python27
        {
            get;
        }

        = GetStaticProperty<IInlinableLambdaRuntime>(typeof(LambdaRuntime));
        [JsiiProperty("Python36", "{\"fqn\":\"@aws-cdk/aws-lambda.InlinableLambdaRuntime\"}")]
        public static IInlinableLambdaRuntime Python36
        {
            get;
        }

        = GetStaticProperty<IInlinableLambdaRuntime>(typeof(LambdaRuntime));
        [JsiiProperty("DotNetCore1", "{\"fqn\":\"@aws-cdk/aws-lambda.LambdaRuntime\"}")]
        public static LambdaRuntime DotNetCore1
        {
            get;
        }

        = GetStaticProperty<LambdaRuntime>(typeof(LambdaRuntime));
        [JsiiProperty("DotNetCore2", "{\"fqn\":\"@aws-cdk/aws-lambda.LambdaRuntime\"}")]
        public static LambdaRuntime DotNetCore2
        {
            get;
        }

        = GetStaticProperty<LambdaRuntime>(typeof(LambdaRuntime));
        [JsiiProperty("Go1x", "{\"fqn\":\"@aws-cdk/aws-lambda.LambdaRuntime\"}")]
        public static LambdaRuntime Go1x
        {
            get;
        }

        = GetStaticProperty<LambdaRuntime>(typeof(LambdaRuntime));
        /// <summary>The name of this runtime, as expected by the Lambda resource. </summary>
        [JsiiProperty("name", "{\"primitive\":\"string\"}")]
        public virtual string Name
        {
            get => GetInstanceProperty<string>();
        }

        /// <summary>Whether the ``ZipFile`` (aka inline code) property can be used with this runtime. </summary>
        [JsiiProperty("supportsInlineCode", "{\"primitive\":\"boolean\"}")]
        public virtual bool SupportsInlineCode
        {
            get => GetInstanceProperty<bool>();
        }

        [JsiiMethod("toString", "{\"primitive\":\"string\"}", "[]")]
        public override string ToString()
        {
            return InvokeInstanceMethod<string>(new object[]{});
        }
    }
}
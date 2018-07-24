using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda
{
    /// <summary>
    /// Defines the handler code for an inline JavaScript lambda function.
    /// 
    /// AWS Lambda invokes your Lambda function via a handler object. A handler
    /// represents the name of your Lambda function (and serves as the entry point
    /// that AWS Lambda uses to execute your function code. For example:
    /// </summary>
    [JsiiInterface(typeof(IIJavaScriptLambdaHandler), "@aws-cdk/aws-lambda.IJavaScriptLambdaHandler")]
    public interface IIJavaScriptLambdaHandler
    {
        /// <summary>The main Lambda entrypoint.</summary>
        /// <param name = "@event">
        /// Event sources can range from a supported AWS service or
        /// custom applications that invoke your Lambda function. For examples, see
        /// [Sample Events Published by Event
        /// Sources](https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html).
        /// </param>
        /// <param name = "context">
        /// AWS Lambda uses this parameter to provide details of your
        /// Lambda function's execution. For more information, see [The Context
        /// Object](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html).
        /// </param>
        /// <param name = "callback">
        /// The Node.js runtimes v6.10 and v8.10 support the optional
        /// callback parameter. You can use it to explicitly return information back
        /// to the caller. Signature is `callback(err, response)`.
        /// </param>
        [JsiiMethod("fn", null, "[{\"name\":\"event\",\"type\":{\"primitive\":\"any\"}},{\"name\":\"context\",\"type\":{\"primitive\":\"any\"}},{\"name\":\"callback\",\"type\":{\"primitive\":\"any\"}}]")]
        void Fn(object @event, object context, object callback);
    }
}
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SNS
{
    /// <summary>The type of subscription, controlling the type of the endpoint parameter.</summary>
    [JsiiEnum(typeof(SubscriptionProtocol), "@aws-cdk/aws-sns.SubscriptionProtocol")]
    public enum SubscriptionProtocol
    {
        [JsiiEnumMember("Http")]
        Http,
        [JsiiEnumMember("Https")]
        Https,
        [JsiiEnumMember("Email")]
        Email,
        [JsiiEnumMember("EmailJson")]
        EmailJson,
        [JsiiEnumMember("Sms")]
        Sms,
        [JsiiEnumMember("Sqs")]
        Sqs,
        [JsiiEnumMember("Application")]
        Application,
        [JsiiEnumMember("Lambda")]
        Lambda
    }
}
using Amazon.CDK;
using Amazon.CDK.AWS.KinesisAnalytics.cloudformation.ApplicationResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisAnalytics.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-application.html </remarks>
    public class ApplicationResourceProps : DeputyBase, IApplicationResourceProps
    {
        /// <summary>``AWS::KinesisAnalytics::Application.Inputs``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-application.html#cfn-kinesisanalytics-application-inputs </remarks>
        [JsiiProperty("inputs", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationResource.InputProperty\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]}}", true)]
        public object Inputs
        {
            get;
            set;
        }

        /// <summary>``AWS::KinesisAnalytics::Application.ApplicationCode``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-application.html#cfn-kinesisanalytics-application-applicationcode </remarks>
        [JsiiProperty("applicationCode", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object ApplicationCode
        {
            get;
            set;
        }

        /// <summary>``AWS::KinesisAnalytics::Application.ApplicationDescription``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-application.html#cfn-kinesisanalytics-application-applicationdescription </remarks>
        [JsiiProperty("applicationDescription", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object ApplicationDescription
        {
            get;
            set;
        }

        /// <summary>``AWS::KinesisAnalytics::Application.ApplicationName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-application.html#cfn-kinesisanalytics-application-applicationname </remarks>
        [JsiiProperty("applicationName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object ApplicationName
        {
            get;
            set;
        }
    }
}
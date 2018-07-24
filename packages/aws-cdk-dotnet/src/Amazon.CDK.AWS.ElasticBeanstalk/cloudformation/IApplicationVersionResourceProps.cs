using Amazon.CDK;
using Amazon.CDK.AWS.ElasticBeanstalk.cloudformation.ApplicationVersionResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElasticBeanstalk.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-beanstalk-version.html </remarks>
    [JsiiInterface(typeof(IApplicationVersionResourceProps), "@aws-cdk/aws-elasticbeanstalk.cloudformation.ApplicationVersionResourceProps")]
    public interface IApplicationVersionResourceProps
    {
        /// <summary>``AWS::ElasticBeanstalk::ApplicationVersion.ApplicationName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-beanstalk-version.html#cfn-elasticbeanstalk-applicationversion-applicationname </remarks>
        [JsiiProperty("applicationName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object ApplicationName
        {
            get;
            set;
        }

        /// <summary>``AWS::ElasticBeanstalk::ApplicationVersion.SourceBundle``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-beanstalk-version.html#cfn-elasticbeanstalk-applicationversion-sourcebundle </remarks>
        [JsiiProperty("sourceBundle", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-elasticbeanstalk.cloudformation.ApplicationVersionResource.SourceBundleProperty\"}]}}")]
        object SourceBundle
        {
            get;
            set;
        }

        /// <summary>``AWS::ElasticBeanstalk::ApplicationVersion.Description``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-beanstalk-version.html#cfn-elasticbeanstalk-applicationversion-description </remarks>
        [JsiiProperty("description", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Description
        {
            get;
            set;
        }
    }
}
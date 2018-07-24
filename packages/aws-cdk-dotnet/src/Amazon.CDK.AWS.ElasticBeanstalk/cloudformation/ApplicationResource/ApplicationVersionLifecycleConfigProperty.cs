using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElasticBeanstalk.cloudformation.ApplicationResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-applicationversionlifecycleconfig.html </remarks>
    public class ApplicationVersionLifecycleConfigProperty : DeputyBase, IApplicationVersionLifecycleConfigProperty
    {
        /// <summary>``ApplicationResource.ApplicationVersionLifecycleConfigProperty.MaxAgeRule``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-applicationversionlifecycleconfig.html#cfn-elasticbeanstalk-application-applicationversionlifecycleconfig-maxagerule </remarks>
        [JsiiProperty("maxAgeRule", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-elasticbeanstalk.cloudformation.ApplicationResource.MaxAgeRuleProperty\"}]},\"optional\":true}", true)]
        public object MaxAgeRule
        {
            get;
            set;
        }

        /// <summary>``ApplicationResource.ApplicationVersionLifecycleConfigProperty.MaxCountRule``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-applicationversionlifecycleconfig.html#cfn-elasticbeanstalk-application-applicationversionlifecycleconfig-maxcountrule </remarks>
        [JsiiProperty("maxCountRule", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-elasticbeanstalk.cloudformation.ApplicationResource.MaxCountRuleProperty\"}]},\"optional\":true}", true)]
        public object MaxCountRule
        {
            get;
            set;
        }
    }
}
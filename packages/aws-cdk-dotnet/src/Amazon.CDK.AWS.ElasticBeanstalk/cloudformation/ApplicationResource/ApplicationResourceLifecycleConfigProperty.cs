using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElasticBeanstalk.cloudformation.ApplicationResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-applicationresourcelifecycleconfig.html </remarks>
    public class ApplicationResourceLifecycleConfigProperty : DeputyBase, IApplicationResourceLifecycleConfigProperty
    {
        /// <summary>``ApplicationResource.ApplicationResourceLifecycleConfigProperty.ServiceRole``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-applicationresourcelifecycleconfig.html#cfn-elasticbeanstalk-application-applicationresourcelifecycleconfig-servicerole </remarks>
        [JsiiProperty("serviceRole", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object ServiceRole
        {
            get;
            set;
        }

        /// <summary>``ApplicationResource.ApplicationResourceLifecycleConfigProperty.VersionLifecycleConfig``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-applicationresourcelifecycleconfig.html#cfn-elasticbeanstalk-application-applicationresourcelifecycleconfig-versionlifecycleconfig </remarks>
        [JsiiProperty("versionLifecycleConfig", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-elasticbeanstalk.cloudformation.ApplicationResource.ApplicationVersionLifecycleConfigProperty\"}]},\"optional\":true}", true)]
        public object VersionLifecycleConfig
        {
            get;
            set;
        }
    }
}
using Amazon.CDK;
using Amazon.CDK.AWS.ElasticBeanstalk.cloudformation.ApplicationResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElasticBeanstalk.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-beanstalk.html </remarks>
    [JsiiInterfaceProxy(typeof(IApplicationResourceProps), "@aws-cdk/aws-elasticbeanstalk.cloudformation.ApplicationResourceProps")]
    internal class ApplicationResourcePropsProxy : DeputyBase, IApplicationResourceProps
    {
        private ApplicationResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::ElasticBeanstalk::Application.ApplicationName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-beanstalk.html#cfn-elasticbeanstalk-application-name </remarks>
        [JsiiProperty("applicationName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ApplicationName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::ElasticBeanstalk::Application.Description``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-beanstalk.html#cfn-elasticbeanstalk-application-description </remarks>
        [JsiiProperty("description", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Description
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::ElasticBeanstalk::Application.ResourceLifecycleConfig``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-beanstalk.html#cfn-elasticbeanstalk-application-resourcelifecycleconfig </remarks>
        [JsiiProperty("resourceLifecycleConfig", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-elasticbeanstalk.cloudformation.ApplicationResource.ApplicationResourceLifecycleConfigProperty\"}]},\"optional\":true}")]
        public virtual object ResourceLifecycleConfig
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
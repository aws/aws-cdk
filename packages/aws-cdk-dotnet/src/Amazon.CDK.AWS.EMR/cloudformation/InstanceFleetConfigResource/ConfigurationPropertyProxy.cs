using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.EMR.cloudformation.InstanceFleetConfigResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-configuration.html </remarks>
    [JsiiInterfaceProxy(typeof(IConfigurationProperty), "@aws-cdk/aws-emr.cloudformation.InstanceFleetConfigResource.ConfigurationProperty")]
    internal class ConfigurationPropertyProxy : DeputyBase, Amazon.CDK.AWS.EMR.cloudformation.InstanceFleetConfigResource.IConfigurationProperty
    {
        private ConfigurationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``InstanceFleetConfigResource.ConfigurationProperty.Classification``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-configuration.html#cfn-elasticmapreduce-instancefleetconfig-configuration-classification </remarks>
        [JsiiProperty("classification", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Classification
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``InstanceFleetConfigResource.ConfigurationProperty.ConfigurationProperties``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-configuration.html#cfn-elasticmapreduce-instancefleetconfig-configuration-configurationproperties </remarks>
        [JsiiProperty("configurationProperties", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        public virtual object ConfigurationProperties
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``InstanceFleetConfigResource.ConfigurationProperty.Configurations``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-configuration.html#cfn-elasticmapreduce-instancefleetconfig-configuration-configurations </remarks>
        [JsiiProperty("configurations", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-emr.cloudformation.InstanceFleetConfigResource.ConfigurationProperty\"}]}}}}]},\"optional\":true}")]
        public virtual object Configurations
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}
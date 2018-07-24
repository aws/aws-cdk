using Amazon.CDK;
using Amazon.CDK.AWS.OpsWorks.cloudformation.LayerResource;
using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.OpsWorks.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html </remarks>
    [JsiiInterface(typeof(ILayerResourceProps), "@aws-cdk/aws-opsworks.cloudformation.LayerResourceProps")]
    public interface ILayerResourceProps
    {
        /// <summary>``AWS::OpsWorks::Layer.AutoAssignElasticIps``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-autoassignelasticips </remarks>
        [JsiiProperty("autoAssignElasticIps", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object AutoAssignElasticIps
        {
            get;
            set;
        }

        /// <summary>``AWS::OpsWorks::Layer.AutoAssignPublicIps``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-autoassignpublicips </remarks>
        [JsiiProperty("autoAssignPublicIps", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object AutoAssignPublicIps
        {
            get;
            set;
        }

        /// <summary>``AWS::OpsWorks::Layer.EnableAutoHealing``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-enableautohealing </remarks>
        [JsiiProperty("enableAutoHealing", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object EnableAutoHealing
        {
            get;
            set;
        }

        /// <summary>``AWS::OpsWorks::Layer.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-name </remarks>
        [JsiiProperty("layerName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object LayerName
        {
            get;
            set;
        }

        /// <summary>``AWS::OpsWorks::Layer.Shortname``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-shortname </remarks>
        [JsiiProperty("shortname", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Shortname
        {
            get;
            set;
        }

        /// <summary>``AWS::OpsWorks::Layer.StackId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-stackid </remarks>
        [JsiiProperty("stackId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object StackId
        {
            get;
            set;
        }

        /// <summary>``AWS::OpsWorks::Layer.Type``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-type </remarks>
        [JsiiProperty("type", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Type
        {
            get;
            set;
        }

        /// <summary>``AWS::OpsWorks::Layer.Attributes``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-attributes </remarks>
        [JsiiProperty("attributes", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object Attributes
        {
            get;
            set;
        }

        /// <summary>``AWS::OpsWorks::Layer.CustomInstanceProfileArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-custominstanceprofilearn </remarks>
        [JsiiProperty("customInstanceProfileArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object CustomInstanceProfileArn
        {
            get;
            set;
        }

        /// <summary>``AWS::OpsWorks::Layer.CustomJson``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-customjson </remarks>
        [JsiiProperty("customJson", "{\"union\":{\"types\":[{\"primitive\":\"json\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object CustomJson
        {
            get;
            set;
        }

        /// <summary>``AWS::OpsWorks::Layer.CustomRecipes``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-customrecipes </remarks>
        [JsiiProperty("customRecipes", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-opsworks.cloudformation.LayerResource.RecipesProperty\"}]},\"optional\":true}")]
        object CustomRecipes
        {
            get;
            set;
        }

        /// <summary>``AWS::OpsWorks::Layer.CustomSecurityGroupIds``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-customsecuritygroupids </remarks>
        [JsiiProperty("customSecurityGroupIds", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object CustomSecurityGroupIds
        {
            get;
            set;
        }

        /// <summary>``AWS::OpsWorks::Layer.InstallUpdatesOnBoot``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-installupdatesonboot </remarks>
        [JsiiProperty("installUpdatesOnBoot", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object InstallUpdatesOnBoot
        {
            get;
            set;
        }

        /// <summary>``AWS::OpsWorks::Layer.LifecycleEventConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-lifecycleeventconfiguration </remarks>
        [JsiiProperty("lifecycleEventConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-opsworks.cloudformation.LayerResource.LifecycleEventConfigurationProperty\"}]},\"optional\":true}")]
        object LifecycleEventConfiguration
        {
            get;
            set;
        }

        /// <summary>``AWS::OpsWorks::Layer.LoadBasedAutoScaling``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-loadbasedautoscaling </remarks>
        [JsiiProperty("loadBasedAutoScaling", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-opsworks.cloudformation.LayerResource.LoadBasedAutoScalingProperty\"}]},\"optional\":true}")]
        object LoadBasedAutoScaling
        {
            get;
            set;
        }

        /// <summary>``AWS::OpsWorks::Layer.Packages``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-packages </remarks>
        [JsiiProperty("packages", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object Packages
        {
            get;
            set;
        }

        /// <summary>``AWS::OpsWorks::Layer.Tags``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-tags </remarks>
        [JsiiProperty("tags", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/cdk.Tag\"}]}}}}]},\"optional\":true}")]
        object Tags
        {
            get;
            set;
        }

        /// <summary>``AWS::OpsWorks::Layer.UseEbsOptimizedInstances``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-useebsoptimizedinstances </remarks>
        [JsiiProperty("useEbsOptimizedInstances", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object UseEbsOptimizedInstances
        {
            get;
            set;
        }

        /// <summary>``AWS::OpsWorks::Layer.VolumeConfigurations``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-volumeconfigurations </remarks>
        [JsiiProperty("volumeConfigurations", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-opsworks.cloudformation.LayerResource.VolumeConfigurationProperty\"}]}}}}]},\"optional\":true}")]
        object VolumeConfigurations
        {
            get;
            set;
        }
    }
}
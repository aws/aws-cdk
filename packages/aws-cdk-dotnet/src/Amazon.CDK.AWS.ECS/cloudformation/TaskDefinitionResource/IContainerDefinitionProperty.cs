using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.ECS.cloudformation.TaskDefinitionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions.html </remarks>
    [JsiiInterface(typeof(IContainerDefinitionProperty), "@aws-cdk/aws-ecs.cloudformation.TaskDefinitionResource.ContainerDefinitionProperty")]
    public interface IContainerDefinitionProperty
    {
        /// <summary>``TaskDefinitionResource.ContainerDefinitionProperty.Command``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions.html#cfn-ecs-taskdefinition-containerdefinition-command </remarks>
        [JsiiProperty("command", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object Command
        {
            get;
            set;
        }

        /// <summary>``TaskDefinitionResource.ContainerDefinitionProperty.Cpu``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions.html#cfn-ecs-taskdefinition-containerdefinition-cpu </remarks>
        [JsiiProperty("cpu", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Cpu
        {
            get;
            set;
        }

        /// <summary>``TaskDefinitionResource.ContainerDefinitionProperty.DisableNetworking``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions.html#cfn-ecs-taskdefinition-containerdefinition-disablenetworking </remarks>
        [JsiiProperty("disableNetworking", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object DisableNetworking
        {
            get;
            set;
        }

        /// <summary>``TaskDefinitionResource.ContainerDefinitionProperty.DnsSearchDomains``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions.html#cfn-ecs-taskdefinition-containerdefinition-dnssearchdomains </remarks>
        [JsiiProperty("dnsSearchDomains", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object DnsSearchDomains
        {
            get;
            set;
        }

        /// <summary>``TaskDefinitionResource.ContainerDefinitionProperty.DnsServers``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions.html#cfn-ecs-taskdefinition-containerdefinition-dnsservers </remarks>
        [JsiiProperty("dnsServers", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object DnsServers
        {
            get;
            set;
        }

        /// <summary>``TaskDefinitionResource.ContainerDefinitionProperty.DockerLabels``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions.html#cfn-ecs-taskdefinition-containerdefinition-dockerlabels </remarks>
        [JsiiProperty("dockerLabels", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object DockerLabels
        {
            get;
            set;
        }

        /// <summary>``TaskDefinitionResource.ContainerDefinitionProperty.DockerSecurityOptions``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions.html#cfn-ecs-taskdefinition-containerdefinition-dockersecurityoptions </remarks>
        [JsiiProperty("dockerSecurityOptions", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object DockerSecurityOptions
        {
            get;
            set;
        }

        /// <summary>``TaskDefinitionResource.ContainerDefinitionProperty.EntryPoint``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions.html#cfn-ecs-taskdefinition-containerdefinition-entrypoint </remarks>
        [JsiiProperty("entryPoint", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object EntryPoint
        {
            get;
            set;
        }

        /// <summary>``TaskDefinitionResource.ContainerDefinitionProperty.Environment``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions.html#cfn-ecs-taskdefinition-containerdefinition-environment </remarks>
        [JsiiProperty("environment", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ecs.cloudformation.TaskDefinitionResource.KeyValuePairProperty\"}]}}}}]},\"optional\":true}")]
        object Environment
        {
            get;
            set;
        }

        /// <summary>``TaskDefinitionResource.ContainerDefinitionProperty.Essential``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions.html#cfn-ecs-taskdefinition-containerdefinition-essential </remarks>
        [JsiiProperty("essential", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Essential
        {
            get;
            set;
        }

        /// <summary>``TaskDefinitionResource.ContainerDefinitionProperty.ExtraHosts``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions.html#cfn-ecs-taskdefinition-containerdefinition-extrahosts </remarks>
        [JsiiProperty("extraHosts", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ecs.cloudformation.TaskDefinitionResource.HostEntryProperty\"}]}}}}]},\"optional\":true}")]
        object ExtraHosts
        {
            get;
            set;
        }

        /// <summary>``TaskDefinitionResource.ContainerDefinitionProperty.HealthCheck``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions.html#cfn-ecs-taskdefinition-containerdefinition-healthcheck </remarks>
        [JsiiProperty("healthCheck", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ecs.cloudformation.TaskDefinitionResource.HealthCheckProperty\"}]},\"optional\":true}")]
        object HealthCheck
        {
            get;
            set;
        }

        /// <summary>``TaskDefinitionResource.ContainerDefinitionProperty.Hostname``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions.html#cfn-ecs-taskdefinition-containerdefinition-hostname </remarks>
        [JsiiProperty("hostname", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Hostname
        {
            get;
            set;
        }

        /// <summary>``TaskDefinitionResource.ContainerDefinitionProperty.Image``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions.html#cfn-ecs-taskdefinition-containerdefinition-image </remarks>
        [JsiiProperty("image", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Image
        {
            get;
            set;
        }

        /// <summary>``TaskDefinitionResource.ContainerDefinitionProperty.Links``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions.html#cfn-ecs-taskdefinition-containerdefinition-links </remarks>
        [JsiiProperty("links", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object Links
        {
            get;
            set;
        }

        /// <summary>``TaskDefinitionResource.ContainerDefinitionProperty.LinuxParameters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions.html#cfn-ecs-taskdefinition-containerdefinition-linuxparameters </remarks>
        [JsiiProperty("linuxParameters", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ecs.cloudformation.TaskDefinitionResource.LinuxParametersProperty\"}]},\"optional\":true}")]
        object LinuxParameters
        {
            get;
            set;
        }

        /// <summary>``TaskDefinitionResource.ContainerDefinitionProperty.LogConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions.html#cfn-ecs-taskdefinition-containerdefinition-logconfiguration </remarks>
        [JsiiProperty("logConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ecs.cloudformation.TaskDefinitionResource.LogConfigurationProperty\"}]},\"optional\":true}")]
        object LogConfiguration
        {
            get;
            set;
        }

        /// <summary>``TaskDefinitionResource.ContainerDefinitionProperty.Memory``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions.html#cfn-ecs-taskdefinition-containerdefinition-memory </remarks>
        [JsiiProperty("memory", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Memory
        {
            get;
            set;
        }

        /// <summary>``TaskDefinitionResource.ContainerDefinitionProperty.MemoryReservation``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions.html#cfn-ecs-taskdefinition-containerdefinition-memoryreservation </remarks>
        [JsiiProperty("memoryReservation", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object MemoryReservation
        {
            get;
            set;
        }

        /// <summary>``TaskDefinitionResource.ContainerDefinitionProperty.MountPoints``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions.html#cfn-ecs-taskdefinition-containerdefinition-mountpoints </remarks>
        [JsiiProperty("mountPoints", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ecs.cloudformation.TaskDefinitionResource.MountPointProperty\"}]}}}}]},\"optional\":true}")]
        object MountPoints
        {
            get;
            set;
        }

        /// <summary>``TaskDefinitionResource.ContainerDefinitionProperty.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions.html#cfn-ecs-taskdefinition-containerdefinition-name </remarks>
        [JsiiProperty("name", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Name
        {
            get;
            set;
        }

        /// <summary>``TaskDefinitionResource.ContainerDefinitionProperty.PortMappings``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions.html#cfn-ecs-taskdefinition-containerdefinition-portmappings </remarks>
        [JsiiProperty("portMappings", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ecs.cloudformation.TaskDefinitionResource.PortMappingProperty\"}]}}}}]},\"optional\":true}")]
        object PortMappings
        {
            get;
            set;
        }

        /// <summary>``TaskDefinitionResource.ContainerDefinitionProperty.Privileged``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions.html#cfn-ecs-taskdefinition-containerdefinition-privileged </remarks>
        [JsiiProperty("privileged", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Privileged
        {
            get;
            set;
        }

        /// <summary>``TaskDefinitionResource.ContainerDefinitionProperty.ReadonlyRootFilesystem``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions.html#cfn-ecs-taskdefinition-containerdefinition-readonlyrootfilesystem </remarks>
        [JsiiProperty("readonlyRootFilesystem", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ReadonlyRootFilesystem
        {
            get;
            set;
        }

        /// <summary>``TaskDefinitionResource.ContainerDefinitionProperty.Ulimits``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions.html#cfn-ecs-taskdefinition-containerdefinition-ulimits </remarks>
        [JsiiProperty("ulimits", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ecs.cloudformation.TaskDefinitionResource.UlimitProperty\"}]}}}}]},\"optional\":true}")]
        object Ulimits
        {
            get;
            set;
        }

        /// <summary>``TaskDefinitionResource.ContainerDefinitionProperty.User``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions.html#cfn-ecs-taskdefinition-containerdefinition-user </remarks>
        [JsiiProperty("user", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object User
        {
            get;
            set;
        }

        /// <summary>``TaskDefinitionResource.ContainerDefinitionProperty.VolumesFrom``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions.html#cfn-ecs-taskdefinition-containerdefinition-volumesfrom </remarks>
        [JsiiProperty("volumesFrom", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ecs.cloudformation.TaskDefinitionResource.VolumeFromProperty\"}]}}}}]},\"optional\":true}")]
        object VolumesFrom
        {
            get;
            set;
        }

        /// <summary>``TaskDefinitionResource.ContainerDefinitionProperty.WorkingDirectory``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions.html#cfn-ecs-taskdefinition-containerdefinition-workingdirectory </remarks>
        [JsiiProperty("workingDirectory", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object WorkingDirectory
        {
            get;
            set;
        }
    }
}
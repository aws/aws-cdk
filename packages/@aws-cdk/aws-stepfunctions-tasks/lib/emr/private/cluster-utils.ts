import * as cdk from '@aws-cdk/core';
import { EmrCreateCluster } from '../emr-create-cluster';
import { EmrModifyInstanceGroupByName } from '../emr-modify-instance-group-by-name';

/**
 * Render the KerberosAttributesProperty as JSON
 */
export function KerberosAttributesPropertyToJson(property: EmrCreateCluster.KerberosAttributesProperty) {
  return {
    ADDomainJoinPassword: cdk.stringToCloudFormation(property.adDomainJoinPassword),
    ADDomainJoinUser: cdk.stringToCloudFormation(property.adDomainJoinUser),
    CrossRealmTrustPrincipalPassword: cdk.stringToCloudFormation(property.crossRealmTrustPrincipalPassword),
    KdcAdminPassword: cdk.stringToCloudFormation(property.kdcAdminPassword),
    Realm: cdk.stringToCloudFormation(property.realm),
  };
}

/**
 * Render the InstancesConfigProperty to JSON
 */
export function InstancesConfigPropertyToJson(property: EmrCreateCluster.InstancesConfigProperty) {
  return {
    AdditionalMasterSecurityGroups: cdk.listMapper(cdk.stringToCloudFormation)(property.additionalMasterSecurityGroups),
    AdditionalSlaveSecurityGroups: cdk.listMapper(cdk.stringToCloudFormation)(property.additionalSlaveSecurityGroups),
    Ec2KeyName: cdk.stringToCloudFormation(property.ec2KeyName),
    Ec2SubnetId: cdk.stringToCloudFormation(property.ec2SubnetId),
    Ec2SubnetIds: cdk.listMapper(cdk.stringToCloudFormation)(property.ec2SubnetIds),
    EmrManagedMasterSecurityGroup: cdk.stringToCloudFormation(property.emrManagedMasterSecurityGroup),
    EmrManagedSlaveSecurityGroup: cdk.stringToCloudFormation(property.emrManagedSlaveSecurityGroup),
    HadoopVersion: cdk.stringToCloudFormation(property.hadoopVersion),
    InstanceCount: cdk.numberToCloudFormation(property.instanceCount),
    InstanceFleets: cdk.listMapper(InstanceFleetConfigPropertyToJson)(property.instanceFleets),
    InstanceGroups: cdk.listMapper(InstanceGroupConfigPropertyToJson)(property.instanceGroups),
    KeepJobFlowAliveWhenNoSteps: true,
    MasterInstanceType: cdk.stringToCloudFormation(property.masterInstanceType),
    Placement: property.placement === undefined ? property.placement : PlacementTypePropertyToJson(property.placement),
    ServiceAccessSecurityGroup: cdk.stringToCloudFormation(property.serviceAccessSecurityGroup),
    SlaveInstanceType: cdk.stringToCloudFormation(property.slaveInstanceType),
    TerminationProtected: cdk.booleanToCloudFormation(property.terminationProtected),
  };
}

/**
 * Render the ApplicationConfigProperty as JSON
 */
export function ApplicationConfigPropertyToJson(property: EmrCreateCluster.ApplicationConfigProperty) {
  return {
    Name: cdk.stringToCloudFormation(property.name),
    Args: cdk.listMapper(cdk.stringToCloudFormation)(property.args),
    Version: cdk.stringToCloudFormation(property.version),
    AdditionalInfo: cdk.objectToCloudFormation(property.additionalInfo),
  };
}

/**
 * Render the AutoTerminationPolicyProperty as JSON
 */
export function AutoTerminationPolicyPropertyToJson(property: EmrCreateCluster.AutoTerminationPolicyProperty) {
  return {
    IdleTimeout: cdk.numberToCloudFormation(property.idleTimeout.toSeconds()),
  };
}

/**
 * Render the ConfigurationProperty as JSON
 */
export function ConfigurationPropertyToJson(property: EmrCreateCluster.ConfigurationProperty) {
  return {
    Classification: cdk.stringToCloudFormation(property.classification),
    Properties: cdk.objectToCloudFormation(property.properties),
    Configurations: cdk.listMapper(ConfigurationPropertyToJson)(property.configurations),
  };
}

/**
 * Render the EbsBlockDeviceConfigProperty as JSON
 */
export function EbsBlockDeviceConfigPropertyToJson(property: EmrCreateCluster.EbsBlockDeviceConfigProperty) {
  return {
    VolumeSpecification: {
      Iops: cdk.numberToCloudFormation(property.volumeSpecification.iops),
      SizeInGB: property.volumeSpecification.volumeSize?.toGibibytes(),
      VolumeType: cdk.stringToCloudFormation(property.volumeSpecification.volumeType?.valueOf()),
    },
    VolumesPerInstance: cdk.numberToCloudFormation(property.volumesPerInstance),
  };
}

/**
 * Render the EbsConfigurationProperty to JSON
 */
export function EbsConfigurationPropertyToJson(property: EmrCreateCluster.EbsConfigurationProperty) {
  return {
    EbsBlockDeviceConfigs: cdk.listMapper(EbsBlockDeviceConfigPropertyToJson)(property.ebsBlockDeviceConfigs),
    EbsOptimized: cdk.booleanToCloudFormation(property.ebsOptimized),
  };
}

/**
 * Render the InstanceTypeConfigProperty to JSON]
 *
 * @param property
 */
export function InstanceTypeConfigPropertyToJson(property: EmrCreateCluster.InstanceTypeConfigProperty) {
  return {
    BidPrice: cdk.stringToCloudFormation(property.bidPrice),
    BidPriceAsPercentageOfOnDemandPrice: cdk.numberToCloudFormation(property.bidPriceAsPercentageOfOnDemandPrice),
    Configurations: cdk.listMapper(ConfigurationPropertyToJson)(property.configurations),
    EbsConfiguration: property.ebsConfiguration === undefined ? property.ebsConfiguration : EbsConfigurationPropertyToJson(property.ebsConfiguration),
    InstanceType: cdk.stringToCloudFormation(property.instanceType?.valueOf()),
    WeightedCapacity: cdk.numberToCloudFormation(property.weightedCapacity),
  };
}

/**
 * Render the InstanceFleetProvisioningSpecificationsProperty to JSON
 */
export function InstanceFleetProvisioningSpecificationsPropertyToJson(property: EmrCreateCluster.InstanceFleetProvisioningSpecificationsProperty) {
  return {
    SpotSpecification: {
      AllocationStrategy: cdk.stringToCloudFormation(property.spotSpecification.allocationStrategy),
      BlockDurationMinutes: cdk.numberToCloudFormation(property.spotSpecification.blockDurationMinutes),
      TimeoutAction: cdk.stringToCloudFormation(property.spotSpecification.timeoutAction?.valueOf()),
      TimeoutDurationMinutes: cdk.numberToCloudFormation(property.spotSpecification.timeoutDurationMinutes),
    },
  };
}

/**
 * Render the InstanceFleetConfigProperty as JSON
 */
export function InstanceFleetConfigPropertyToJson(property: EmrCreateCluster.InstanceFleetConfigProperty) {
  return {
    InstanceFleetType: cdk.stringToCloudFormation(property.instanceFleetType?.valueOf()),
    InstanceTypeConfigs: cdk.listMapper(InstanceTypeConfigPropertyToJson)(property.instanceTypeConfigs),
    LaunchSpecifications:
      property.launchSpecifications === undefined
        ? property.launchSpecifications
        : InstanceFleetProvisioningSpecificationsPropertyToJson(property.launchSpecifications),
    Name: cdk.stringToCloudFormation(property.name),
    TargetOnDemandCapacity: cdk.numberToCloudFormation(property.targetOnDemandCapacity),
    TargetSpotCapacity: cdk.numberToCloudFormation(property.targetSpotCapacity),
  };
}

/**
 * Render the MetricDimensionProperty as JSON
 */
export function MetricDimensionPropertyToJson(property: EmrCreateCluster.MetricDimensionProperty) {
  return {
    Key: cdk.stringToCloudFormation(property.key),
    Value: cdk.stringToCloudFormation(property.value),
  };
}

/**
 * Render the ScalingTriggerProperty to JSON
 */
export function ScalingTriggerPropertyToJson(property: EmrCreateCluster.ScalingTriggerProperty) {
  return {
    CloudWatchAlarmDefinition: {
      ComparisonOperator: cdk.stringToCloudFormation(property.cloudWatchAlarmDefinition.comparisonOperator?.valueOf()),
      Dimensions: cdk.listMapper(MetricDimensionPropertyToJson)(property.cloudWatchAlarmDefinition.dimensions),
      EvaluationPeriods: cdk.numberToCloudFormation(property.cloudWatchAlarmDefinition.evaluationPeriods),
      MetricName: cdk.stringToCloudFormation(property.cloudWatchAlarmDefinition.metricName),
      Namespace: cdk.stringToCloudFormation(property.cloudWatchAlarmDefinition.namespace),
      Period: cdk.numberToCloudFormation(property.cloudWatchAlarmDefinition.period.toSeconds()),
      Statistic: cdk.stringToCloudFormation(property.cloudWatchAlarmDefinition.statistic?.valueOf()),
      Threshold: cdk.numberToCloudFormation(property.cloudWatchAlarmDefinition.threshold),
      Unit: cdk.stringToCloudFormation(property.cloudWatchAlarmDefinition.unit?.valueOf()),
    },
  };
}

/**
 * Render the ScalingActionProperty to JSON
 */
export function ScalingActionPropertyToJson(property: EmrCreateCluster.ScalingActionProperty) {
  return {
    Market: cdk.stringToCloudFormation(property.market?.valueOf()),
    SimpleScalingPolicyConfiguration: {
      AdjustmentType: cdk.stringToCloudFormation(property.simpleScalingPolicyConfiguration.adjustmentType),
      CoolDown: cdk.numberToCloudFormation(property.simpleScalingPolicyConfiguration.coolDown),
      ScalingAdjustment: cdk.numberToCloudFormation(property.simpleScalingPolicyConfiguration.scalingAdjustment),
    },
  };
}

/**
 * Render the ScalingRuleProperty to JSON
 */
export function ScalingRulePropertyToJson(property: EmrCreateCluster.ScalingRuleProperty) {
  return {
    Action: ScalingActionPropertyToJson(property.action),
    Description: cdk.stringToCloudFormation(property.description),
    Name: cdk.stringToCloudFormation(property.name),
    Trigger: ScalingTriggerPropertyToJson(property.trigger),
  };
}

/**
 * Render the AutoScalingPolicyProperty to JSON
 */
export function AutoScalingPolicyPropertyToJson(property: EmrCreateCluster.AutoScalingPolicyProperty) {
  return {
    Constraints: {
      MaxCapacity: cdk.numberToCloudFormation(property.constraints.maxCapacity),
      MinCapacity: cdk.numberToCloudFormation(property.constraints.minCapacity),
    },
    Rules: cdk.listMapper(ScalingRulePropertyToJson)(property.rules),
  };
}

/**
 * Render the InstanceGroupConfigProperty to JSON
 */
export function InstanceGroupConfigPropertyToJson(property: EmrCreateCluster.InstanceGroupConfigProperty) {
  return {
    AutoScalingPolicy:
      property.autoScalingPolicy === undefined ? property.autoScalingPolicy : AutoScalingPolicyPropertyToJson(property.autoScalingPolicy),
    BidPrice: cdk.numberToCloudFormation(property.bidPrice),
    Configurations: cdk.listMapper(ConfigurationPropertyToJson)(property.configurations),
    EbsConfiguration: property.ebsConfiguration === undefined ? property.ebsConfiguration : EbsConfigurationPropertyToJson(property.ebsConfiguration),
    InstanceCount: cdk.numberToCloudFormation(property.instanceCount),
    InstanceRole: cdk.stringToCloudFormation(property.instanceRole?.valueOf()),
    InstanceType: cdk.stringToCloudFormation(property.instanceType),
    Market: cdk.stringToCloudFormation(property.market?.valueOf()),
    Name: cdk.stringToCloudFormation(property.name),
  };
}

/**
 * Render the PlacementTypeProperty to JSON
 */
export function PlacementTypePropertyToJson(property: EmrCreateCluster.PlacementTypeProperty) {
  return {
    AvailabilityZone: cdk.stringToCloudFormation(property.availabilityZone),
    AvailabilityZones: cdk.listMapper(cdk.stringToCloudFormation)(property.availabilityZones),
  };
}

/**
 * Render the BootstrapActionProperty as JSON
 */
export function BootstrapActionConfigToJson(property: EmrCreateCluster.BootstrapActionConfigProperty) {
  return {
    Name: cdk.stringToCloudFormation(property.name),
    ScriptBootstrapAction: {
      Path: cdk.stringToCloudFormation(property.scriptBootstrapAction.path),
      Args: cdk.listMapper(cdk.stringToCloudFormation)(property.scriptBootstrapAction.args),
    },
  };
}

/**
 * Render the InstanceGroupModifyConfigProperty to JSON
 */
export function InstanceGroupModifyConfigPropertyToJson(property: EmrModifyInstanceGroupByName.InstanceGroupModifyConfigProperty) {
  return {
    Configurations: cdk.listMapper(ConfigurationPropertyToJson)(property.configurations),
    EC2InstanceIdsToTerminate: cdk.listMapper(cdk.stringToCloudFormation)(property.eC2InstanceIdsToTerminate),
    InstanceCount: cdk.numberToCloudFormation(property.instanceCount),
    ShrinkPolicy: property.shrinkPolicy === undefined ? property.shrinkPolicy : ShrinkPolicyPropertyToJson(property.shrinkPolicy),
  };
}

/**
 * Render the ShrinkPolicyProperty to JSON
 */
function ShrinkPolicyPropertyToJson(property: EmrModifyInstanceGroupByName.ShrinkPolicyProperty) {
  return {
    DecommissionTimeout: cdk.numberToCloudFormation(property.decommissionTimeout?.toSeconds()),
    InstanceResizePolicy: property.instanceResizePolicy ? InstanceResizePolicyPropertyToJson(property.instanceResizePolicy) : undefined,
  };
}

/**
 * Render the InstanceResizePolicyProperty to JSON
 */
function InstanceResizePolicyPropertyToJson(property: EmrModifyInstanceGroupByName.InstanceResizePolicyProperty) {
  return {
    InstancesToProtect: cdk.listMapper(cdk.stringToCloudFormation)(property.instancesToProtect),
    InstancesToTerminate: cdk.listMapper(cdk.stringToCloudFormation)(property.instancesToTerminate),
    InstanceTerminationTimeout: cdk.numberToCloudFormation(property.instanceTerminationTimeout?.toSeconds()),
  };
}

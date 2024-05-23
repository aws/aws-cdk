import { Construct } from 'constructs';
import { Annotations } from '../../../core';
import { CfnInstance, CfnLaunchTemplate } from '../ec2.generated';
import { BlockDevice, EbsDeviceVolumeType } from '../volume';

export function instanceBlockDeviceMappings(construct: Construct, blockDevices: BlockDevice[]): CfnInstance.BlockDeviceMappingProperty[] {
  return synthesizeBlockDeviceMappings<CfnInstance.BlockDeviceMappingProperty, object>(construct, blockDevices, {});
}

export function launchTemplateBlockDeviceMappings(construct: Construct, blockDevices: BlockDevice[]): CfnLaunchTemplate.BlockDeviceMappingProperty[] {
  return synthesizeBlockDeviceMappings<CfnLaunchTemplate.BlockDeviceMappingProperty, string>(construct, blockDevices, '');
}

/**
 * Synthesize an array of block device mappings from a list of block device
 *
 * @param construct the instance/asg construct, used to host any warning
 * @param blockDevices list of block devices
 */
function synthesizeBlockDeviceMappings<RT, NDT>(construct: Construct, blockDevices: BlockDevice[], noDeviceValue: NDT): RT[] {
  return blockDevices.map<RT>(({ deviceName, volume, mappingEnabled }): RT => {
    const { virtualName, ebsDevice: ebs } = volume;

    let finalEbs: CfnLaunchTemplate.EbsProperty | CfnInstance.EbsProperty | undefined;

    if (ebs) {

      const { iops, throughput, volumeType, kmsKey, ...rest } = ebs;

      if (throughput) {
        const throughputRange = { Min: 125, Max: 1000 };
        const { Min, Max } = throughputRange;

        if (volumeType != EbsDeviceVolumeType.GP3) {
          throw new Error('throughput property requires volumeType: EbsDeviceVolumeType.GP3');
        }

        if (throughput < Min || throughput > Max) {
          throw new Error(
            `throughput property takes a minimum of ${Min} and a maximum of ${Max}`,
          );
        }

        const maximumThroughputRatio = 0.25;
        if (iops) {
          const iopsRatio = (throughput / iops);
          if (iopsRatio > maximumThroughputRatio) {
            throw new Error(`Throughput (MiBps) to iops ratio of ${iopsRatio} is too high; maximum is ${maximumThroughputRatio} MiBps per iops`);
          }
        }
      }

      if (!iops) {
        if (volumeType === EbsDeviceVolumeType.IO1 || volumeType === EbsDeviceVolumeType.IO2) {
          throw new Error('iops property is required with volumeType: EbsDeviceVolumeType.IO1 and EbsDeviceVolumeType.IO2');
        }
      } else if (volumeType !== EbsDeviceVolumeType.IO1 && volumeType !== EbsDeviceVolumeType.IO2 && volumeType !== EbsDeviceVolumeType.GP3) {
        Annotations.of(construct).addWarningV2('@aws-cdk/aws-ec2:iopsIgnored', 'iops will be ignored without volumeType: IO1, IO2, or GP3');
      }

      /**
       * Because the Ebs properties of the L2 Constructs do not match the Ebs properties of the Cfn Constructs,
       * we have to do some transformation and handle all destructed properties
       */

      finalEbs = {
        ...rest,
        iops,
        throughput,
        volumeType,
        kmsKeyId: kmsKey?.keyArn,
      };

    } else {
      finalEbs = undefined;
    }

    const noDevice = mappingEnabled === false ? noDeviceValue : undefined;
    return { deviceName, ebs: finalEbs, virtualName, noDevice } as any;
  });
}

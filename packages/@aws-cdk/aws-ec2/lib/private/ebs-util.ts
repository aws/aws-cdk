import { Construct } from '@aws-cdk/core';
import { CfnInstance, CfnLaunchTemplate } from '../ec2.generated';
import { BlockDevice, EbsDeviceVolumeType } from '../volume';

// tslint:disable-next-line: max-line-length
export function instanceBlockDeviceMappings(construct: Construct, blockDevices?: BlockDevice[]): CfnInstance.BlockDeviceMappingProperty[] | undefined {
  return synthesizeBlockDeviceMappings(construct, blockDevices, {});
}

// tslint:disable-next-line: max-line-length
export function launchTemplateBlockDeviceMappings(construct: Construct, blockDevices?: BlockDevice[]): CfnLaunchTemplate.BlockDeviceMappingProperty[] | undefined {
  return synthesizeBlockDeviceMappings(construct, blockDevices, '');
}

/**
 * Synthesize an array of block device mappings from a list of block device
 *
 * @param construct the instance/asg construct, used to host any warning
 * @param blockDevices list of block devices
 */
function synthesizeBlockDeviceMappings<A>(construct: Construct, blockDevices: BlockDevice[] | undefined, noDeviceValue: A) {
  if (!blockDevices) { return undefined; }

  return blockDevices.map(({ deviceName, volume, mappingEnabled }) => {
    const { virtualName, ebsDevice: ebs } = volume;

    if (ebs) {
      const { iops, volumeType } = ebs;

      if (!iops) {
        if (volumeType === EbsDeviceVolumeType.IO1) {
          throw new Error('iops property is required with volumeType: EbsDeviceVolumeType.IO1');
        }
      } else if (volumeType !== EbsDeviceVolumeType.IO1) {
        construct.node.addWarning('iops will be ignored without volumeType: EbsDeviceVolumeType.IO1');
      }
    }

    const noDevice = mappingEnabled === false ? noDeviceValue : undefined;
    return { deviceName, ebs, virtualName, noDevice };
  });
}
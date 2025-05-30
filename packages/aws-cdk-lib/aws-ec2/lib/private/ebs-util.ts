import { Construct } from 'constructs';
import { Annotations, ValidationError } from '../../../core';
import { CfnInstance, CfnLaunchTemplate } from '../ec2.generated';
import { BlockDevice, EbsDeviceVolumeType } from '../volume';

export function instanceBlockDeviceMappings(construct: Construct, blockDevices: BlockDevice[]): CfnInstance.BlockDeviceMappingProperty[] {
  for (const blockDevice of blockDevices) {
    if (blockDevice.volume.ebsDevice?.throughput !== undefined) {
      Annotations.of(construct).addWarningV2('@aws-cdk/aws-ec2:throughputNotSupported',
        'The throughput property is not supported on EC2 instances. Use a Launch Template instead. ' +
          'See https://github.com/aws/aws-cdk/issues/34033 for more information.',
      );
    }
  }
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
        if (volumeType !== EbsDeviceVolumeType.GP3) {
          throw new ValidationError(`'throughput' requires 'volumeType': ${EbsDeviceVolumeType.GP3}, got: ${volumeType}.`, construct);
        }

        if (!Number.isInteger(throughput)) {
          throw new ValidationError(`'throughput' must be an integer, got: ${throughput}.`, construct);
        }

        if (throughput < 125 || throughput > 1000) {
          throw new ValidationError(`'throughput' must be between 125 and 1000, got ${throughput}.`, construct);
        }

        const maximumThroughputRatio = 0.25;
        if (iops) {
          const iopsRatio = (throughput / iops);
          if (iopsRatio > maximumThroughputRatio) {
            throw new ValidationError(`Throughput (MiBps) to iops ratio of ${iopsRatio} is too high; maximum is ${maximumThroughputRatio} MiBps per iops`, construct);
          }
        }
      }

      if (!iops) {
        if (volumeType === EbsDeviceVolumeType.IO1 || volumeType === EbsDeviceVolumeType.IO2) {
          throw new ValidationError('iops property is required with volumeType: EbsDeviceVolumeType.IO1 and EbsDeviceVolumeType.IO2', construct);
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

import { Construct } from 'constructs';
import { CfnInstance, CfnLaunchTemplate } from '../ec2.generated';
import { BlockDevice } from '../volume';
export declare function instanceBlockDeviceMappings(construct: Construct, blockDevices: BlockDevice[]): CfnInstance.BlockDeviceMappingProperty[];
export declare function launchTemplateBlockDeviceMappings(construct: Construct, blockDevices: BlockDevice[]): CfnLaunchTemplate.BlockDeviceMappingProperty[];

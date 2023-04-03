"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.launchTemplateBlockDeviceMappings = exports.instanceBlockDeviceMappings = void 0;
const core_1 = require("@aws-cdk/core");
const volume_1 = require("../volume");
function instanceBlockDeviceMappings(construct, blockDevices) {
    return synthesizeBlockDeviceMappings(construct, blockDevices, {});
}
exports.instanceBlockDeviceMappings = instanceBlockDeviceMappings;
function launchTemplateBlockDeviceMappings(construct, blockDevices) {
    return synthesizeBlockDeviceMappings(construct, blockDevices, '');
}
exports.launchTemplateBlockDeviceMappings = launchTemplateBlockDeviceMappings;
/**
 * Synthesize an array of block device mappings from a list of block device
 *
 * @param construct the instance/asg construct, used to host any warning
 * @param blockDevices list of block devices
 */
function synthesizeBlockDeviceMappings(construct, blockDevices, noDeviceValue) {
    return blockDevices.map(({ deviceName, volume, mappingEnabled }) => {
        const { virtualName, ebsDevice: ebs } = volume;
        let finalEbs;
        if (ebs) {
            const { iops, volumeType, kmsKey, ...rest } = ebs;
            if (!iops) {
                if (volumeType === volume_1.EbsDeviceVolumeType.IO1 || volumeType === volume_1.EbsDeviceVolumeType.IO2) {
                    throw new Error('iops property is required with volumeType: EbsDeviceVolumeType.IO1 and EbsDeviceVolumeType.IO2');
                }
            }
            else if (volumeType !== volume_1.EbsDeviceVolumeType.IO1 && volumeType !== volume_1.EbsDeviceVolumeType.IO2 && volumeType !== volume_1.EbsDeviceVolumeType.GP3) {
                core_1.Annotations.of(construct).addWarning('iops will be ignored without volumeType: IO1, IO2, or GP3');
            }
            /**
             * Because the Ebs properties of the L2 Constructs do not match the Ebs properties of the Cfn Constructs,
             * we have to do some transformation and handle all destructed properties
             */
            finalEbs = {
                ...rest,
                iops,
                volumeType,
                kmsKeyId: kmsKey?.keyArn,
            };
        }
        else {
            finalEbs = undefined;
        }
        const noDevice = mappingEnabled === false ? noDeviceValue : undefined;
        return { deviceName, ebs: finalEbs, virtualName, noDevice };
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWJzLXV0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlYnMtdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx3Q0FBNEM7QUFHNUMsc0NBQTZEO0FBRTdELFNBQWdCLDJCQUEyQixDQUFDLFNBQW9CLEVBQUUsWUFBMkI7SUFDM0YsT0FBTyw2QkFBNkIsQ0FBaUQsU0FBUyxFQUFFLFlBQVksRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNwSCxDQUFDO0FBRkQsa0VBRUM7QUFFRCxTQUFnQixpQ0FBaUMsQ0FBQyxTQUFvQixFQUFFLFlBQTJCO0lBQ2pHLE9BQU8sNkJBQTZCLENBQXVELFNBQVMsRUFBRSxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDMUgsQ0FBQztBQUZELDhFQUVDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFTLDZCQUE2QixDQUFVLFNBQW9CLEVBQUUsWUFBMkIsRUFBRSxhQUFrQjtJQUNuSCxPQUFPLFlBQVksQ0FBQyxHQUFHLENBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFLEVBQU0sRUFBRTtRQUN6RSxNQUFNLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsR0FBRyxNQUFNLENBQUM7UUFFL0MsSUFBSSxRQUE2RSxDQUFDO1FBRWxGLElBQUksR0FBRyxFQUFFO1lBRVAsTUFBTSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDO1lBRWxELElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQ1QsSUFBSSxVQUFVLEtBQUssNEJBQW1CLENBQUMsR0FBRyxJQUFJLFVBQVUsS0FBSyw0QkFBbUIsQ0FBQyxHQUFHLEVBQUU7b0JBQ3BGLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0dBQWdHLENBQUMsQ0FBQztpQkFDbkg7YUFDRjtpQkFBTSxJQUFJLFVBQVUsS0FBSyw0QkFBbUIsQ0FBQyxHQUFHLElBQUksVUFBVSxLQUFLLDRCQUFtQixDQUFDLEdBQUcsSUFBSSxVQUFVLEtBQUssNEJBQW1CLENBQUMsR0FBRyxFQUFFO2dCQUNySSxrQkFBVyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxVQUFVLENBQUMsMkRBQTJELENBQUMsQ0FBQzthQUNuRztZQUVEOzs7ZUFHRztZQUVILFFBQVEsR0FBRztnQkFDVCxHQUFHLElBQUk7Z0JBQ1AsSUFBSTtnQkFDSixVQUFVO2dCQUNWLFFBQVEsRUFBRSxNQUFNLEVBQUUsTUFBTTthQUN6QixDQUFDO1NBRUg7YUFBTTtZQUNMLFFBQVEsR0FBRyxTQUFTLENBQUM7U0FDdEI7UUFHRCxNQUFNLFFBQVEsR0FBRyxjQUFjLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUN0RSxPQUFPLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBUyxDQUFDO0lBQ3JFLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFubm90YXRpb25zIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENmbkluc3RhbmNlLCBDZm5MYXVuY2hUZW1wbGF0ZSB9IGZyb20gJy4uL2VjMi5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgQmxvY2tEZXZpY2UsIEVic0RldmljZVZvbHVtZVR5cGUgfSBmcm9tICcuLi92b2x1bWUnO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5zdGFuY2VCbG9ja0RldmljZU1hcHBpbmdzKGNvbnN0cnVjdDogQ29uc3RydWN0LCBibG9ja0RldmljZXM6IEJsb2NrRGV2aWNlW10pOiBDZm5JbnN0YW5jZS5CbG9ja0RldmljZU1hcHBpbmdQcm9wZXJ0eVtdIHtcbiAgcmV0dXJuIHN5bnRoZXNpemVCbG9ja0RldmljZU1hcHBpbmdzPENmbkluc3RhbmNlLkJsb2NrRGV2aWNlTWFwcGluZ1Byb3BlcnR5LCBvYmplY3Q+KGNvbnN0cnVjdCwgYmxvY2tEZXZpY2VzLCB7fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsYXVuY2hUZW1wbGF0ZUJsb2NrRGV2aWNlTWFwcGluZ3MoY29uc3RydWN0OiBDb25zdHJ1Y3QsIGJsb2NrRGV2aWNlczogQmxvY2tEZXZpY2VbXSk6IENmbkxhdW5jaFRlbXBsYXRlLkJsb2NrRGV2aWNlTWFwcGluZ1Byb3BlcnR5W10ge1xuICByZXR1cm4gc3ludGhlc2l6ZUJsb2NrRGV2aWNlTWFwcGluZ3M8Q2ZuTGF1bmNoVGVtcGxhdGUuQmxvY2tEZXZpY2VNYXBwaW5nUHJvcGVydHksIHN0cmluZz4oY29uc3RydWN0LCBibG9ja0RldmljZXMsICcnKTtcbn1cblxuLyoqXG4gKiBTeW50aGVzaXplIGFuIGFycmF5IG9mIGJsb2NrIGRldmljZSBtYXBwaW5ncyBmcm9tIGEgbGlzdCBvZiBibG9jayBkZXZpY2VcbiAqXG4gKiBAcGFyYW0gY29uc3RydWN0IHRoZSBpbnN0YW5jZS9hc2cgY29uc3RydWN0LCB1c2VkIHRvIGhvc3QgYW55IHdhcm5pbmdcbiAqIEBwYXJhbSBibG9ja0RldmljZXMgbGlzdCBvZiBibG9jayBkZXZpY2VzXG4gKi9cbmZ1bmN0aW9uIHN5bnRoZXNpemVCbG9ja0RldmljZU1hcHBpbmdzPFJULCBORFQ+KGNvbnN0cnVjdDogQ29uc3RydWN0LCBibG9ja0RldmljZXM6IEJsb2NrRGV2aWNlW10sIG5vRGV2aWNlVmFsdWU6IE5EVCk6IFJUW10ge1xuICByZXR1cm4gYmxvY2tEZXZpY2VzLm1hcDxSVD4oKHsgZGV2aWNlTmFtZSwgdm9sdW1lLCBtYXBwaW5nRW5hYmxlZCB9KTogUlQgPT4ge1xuICAgIGNvbnN0IHsgdmlydHVhbE5hbWUsIGVic0RldmljZTogZWJzIH0gPSB2b2x1bWU7XG5cbiAgICBsZXQgZmluYWxFYnM6IENmbkxhdW5jaFRlbXBsYXRlLkVic1Byb3BlcnR5IHwgQ2ZuSW5zdGFuY2UuRWJzUHJvcGVydHkgfCB1bmRlZmluZWQ7XG5cbiAgICBpZiAoZWJzKSB7XG5cbiAgICAgIGNvbnN0IHsgaW9wcywgdm9sdW1lVHlwZSwga21zS2V5LCAuLi5yZXN0IH0gPSBlYnM7XG5cbiAgICAgIGlmICghaW9wcykge1xuICAgICAgICBpZiAodm9sdW1lVHlwZSA9PT0gRWJzRGV2aWNlVm9sdW1lVHlwZS5JTzEgfHwgdm9sdW1lVHlwZSA9PT0gRWJzRGV2aWNlVm9sdW1lVHlwZS5JTzIpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2lvcHMgcHJvcGVydHkgaXMgcmVxdWlyZWQgd2l0aCB2b2x1bWVUeXBlOiBFYnNEZXZpY2VWb2x1bWVUeXBlLklPMSBhbmQgRWJzRGV2aWNlVm9sdW1lVHlwZS5JTzInKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh2b2x1bWVUeXBlICE9PSBFYnNEZXZpY2VWb2x1bWVUeXBlLklPMSAmJiB2b2x1bWVUeXBlICE9PSBFYnNEZXZpY2VWb2x1bWVUeXBlLklPMiAmJiB2b2x1bWVUeXBlICE9PSBFYnNEZXZpY2VWb2x1bWVUeXBlLkdQMykge1xuICAgICAgICBBbm5vdGF0aW9ucy5vZihjb25zdHJ1Y3QpLmFkZFdhcm5pbmcoJ2lvcHMgd2lsbCBiZSBpZ25vcmVkIHdpdGhvdXQgdm9sdW1lVHlwZTogSU8xLCBJTzIsIG9yIEdQMycpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEJlY2F1c2UgdGhlIEVicyBwcm9wZXJ0aWVzIG9mIHRoZSBMMiBDb25zdHJ1Y3RzIGRvIG5vdCBtYXRjaCB0aGUgRWJzIHByb3BlcnRpZXMgb2YgdGhlIENmbiBDb25zdHJ1Y3RzLFxuICAgICAgICogd2UgaGF2ZSB0byBkbyBzb21lIHRyYW5zZm9ybWF0aW9uIGFuZCBoYW5kbGUgYWxsIGRlc3RydWN0ZWQgcHJvcGVydGllc1xuICAgICAgICovXG5cbiAgICAgIGZpbmFsRWJzID0ge1xuICAgICAgICAuLi5yZXN0LFxuICAgICAgICBpb3BzLFxuICAgICAgICB2b2x1bWVUeXBlLFxuICAgICAgICBrbXNLZXlJZDoga21zS2V5Py5rZXlBcm4sXG4gICAgICB9O1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIGZpbmFsRWJzID0gdW5kZWZpbmVkO1xuICAgIH1cblxuXG4gICAgY29uc3Qgbm9EZXZpY2UgPSBtYXBwaW5nRW5hYmxlZCA9PT0gZmFsc2UgPyBub0RldmljZVZhbHVlIDogdW5kZWZpbmVkO1xuICAgIHJldHVybiB7IGRldmljZU5hbWUsIGViczogZmluYWxFYnMsIHZpcnR1YWxOYW1lLCBub0RldmljZSB9IGFzIGFueTtcbiAgfSk7XG59XG4iXX0=
"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EbsDeviceVolumeType = exports.BlockDeviceVolume = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
/**
 * Describes a block device mapping for an EC2 instance or Auto Scaling group.
 */
class BlockDeviceVolume {
    /**
     * @param ebsDevice EBS device info
     * @param virtualName Virtual device name
     */
    constructor(ebsDevice, virtualName) {
        this.ebsDevice = ebsDevice;
        this.virtualName = virtualName;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_autoscaling_EbsDeviceProps(ebsDevice);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, BlockDeviceVolume);
            }
            throw error;
        }
    }
    /**
     * Creates a new Elastic Block Storage device
     *
     * @param volumeSize The volume size, in Gibibytes (GiB)
     * @param options additional device options
     */
    static ebs(volumeSize, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_autoscaling_EbsDeviceOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.ebs);
            }
            throw error;
        }
        return new this({ ...options, volumeSize });
    }
    /**
     * Creates a new Elastic Block Storage device from an existing snapshot
     *
     * @param snapshotId The snapshot ID of the volume to use
     * @param options additional device options
     */
    static ebsFromSnapshot(snapshotId, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_autoscaling_EbsDeviceSnapshotOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.ebsFromSnapshot);
            }
            throw error;
        }
        return new this({ ...options, snapshotId });
    }
    /**
     * Creates a virtual, ephemeral device.
     * The name will be in the form ephemeral{volumeIndex}.
     *
     * @param volumeIndex the volume index. Must be equal or greater than 0
     */
    static ephemeral(volumeIndex) {
        if (volumeIndex < 0) {
            throw new Error(`volumeIndex must be a number starting from 0, got "${volumeIndex}"`);
        }
        return new this(undefined, `ephemeral${volumeIndex}`);
    }
    /**
     * Supresses a volume mapping
     */
    static noDevice() {
        return this._NO_DEVICE;
    }
}
exports.BlockDeviceVolume = BlockDeviceVolume;
_a = JSII_RTTI_SYMBOL_1;
BlockDeviceVolume[_a] = { fqn: "@aws-cdk/aws-autoscaling.BlockDeviceVolume", version: "0.0.0" };
/**
 * @internal
 */
BlockDeviceVolume._NO_DEVICE = new BlockDeviceVolume();
/**
 * Supported EBS volume types for blockDevices
 */
var EbsDeviceVolumeType;
(function (EbsDeviceVolumeType) {
    /**
     * Magnetic
     */
    EbsDeviceVolumeType["STANDARD"] = "standard";
    /**
     *  Provisioned IOPS SSD - IO1
     */
    EbsDeviceVolumeType["IO1"] = "io1";
    /**
     * General Purpose SSD - GP2
     */
    EbsDeviceVolumeType["GP2"] = "gp2";
    /**
     * General Purpose SSD - GP3
     */
    EbsDeviceVolumeType["GP3"] = "gp3";
    /**
     * Throughput Optimized HDD
     */
    EbsDeviceVolumeType["ST1"] = "st1";
    /**
     * Cold HDD
     */
    EbsDeviceVolumeType["SC1"] = "sc1";
})(EbsDeviceVolumeType = exports.EbsDeviceVolumeType || (exports.EbsDeviceVolumeType = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidm9sdW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidm9sdW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQXVIQTs7R0FFRztBQUNILE1BQWEsaUJBQWlCO0lBK0M1Qjs7O09BR0c7SUFDSCxZQUFzQyxTQUEwQixFQUFrQixXQUFvQjtRQUFoRSxjQUFTLEdBQVQsU0FBUyxDQUFpQjtRQUFrQixnQkFBVyxHQUFYLFdBQVcsQ0FBUzs7Ozs7OytDQW5EM0YsaUJBQWlCOzs7O0tBb0QzQjtJQTlDRDs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBa0IsRUFBRSxVQUE0QixFQUFFOzs7Ozs7Ozs7O1FBQ2xFLE9BQU8sSUFBSSxJQUFJLENBQUMsRUFBRSxHQUFHLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO0tBQzdDO0lBRUQ7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsZUFBZSxDQUFDLFVBQWtCLEVBQUUsVUFBb0MsRUFBRTs7Ozs7Ozs7OztRQUN0RixPQUFPLElBQUksSUFBSSxDQUFDLEVBQUUsR0FBRyxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztLQUM3QztJQUVEOzs7OztPQUtHO0lBQ0ksTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFtQjtRQUN6QyxJQUFJLFdBQVcsR0FBRyxDQUFDLEVBQUU7WUFDbkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxzREFBc0QsV0FBVyxHQUFHLENBQUMsQ0FBQztTQUN2RjtRQUVELE9BQU8sSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLFlBQVksV0FBVyxFQUFFLENBQUMsQ0FBQztLQUN2RDtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLFFBQVE7UUFDcEIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0tBQ3hCOztBQTdDSCw4Q0FxREM7OztBQXBEQzs7R0FFRztBQUNXLDRCQUFVLEdBQUcsSUFBSSxpQkFBaUIsRUFBRSxDQUFDO0FBbURyRDs7R0FFRztBQUNILElBQVksbUJBOEJYO0FBOUJELFdBQVksbUJBQW1CO0lBQzdCOztPQUVHO0lBQ0gsNENBQXFCLENBQUE7SUFFckI7O09BRUc7SUFDSCxrQ0FBVyxDQUFBO0lBRVg7O09BRUc7SUFDSCxrQ0FBVyxDQUFBO0lBRVg7O09BRUc7SUFDSCxrQ0FBVyxDQUFBO0lBRVg7O09BRUc7SUFDSCxrQ0FBVyxDQUFBO0lBRVg7O09BRUc7SUFDSCxrQ0FBVyxDQUFBO0FBQ2IsQ0FBQyxFQTlCVyxtQkFBbUIsR0FBbkIsMkJBQW1CLEtBQW5CLDJCQUFtQixRQThCOUIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBVbmZvcnR1bmF0ZWx5IGEgbW9zdGx5LWxpdGVyYWwgY29weSBmcm9tIGVjMi92b2x1bWUudHMgYmVjYXVzZSB0aGlzIGZlYXR1cmVcbi8vIGV4aXN0ZWQgZmlyc3QgaW4gdGhlIFwiYXV0b3NjYWxpbmdcIiBtb2R1bGUgYmVmb3JlIGl0IGV4aXN0ZWQgaW4gdGhlIFwiZWMyXCJcbi8vIG1vZHVsZSBzbyB3ZSBjb3VsZG4ndCBzdGFuZGFyZGl6ZSB0aGUgc3RydWN0cyBpbiB0aGUgcmlnaHQgd2F5LlxuXG4vKipcbiAqIEJsb2NrIGRldmljZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEJsb2NrRGV2aWNlIHtcbiAgLyoqXG4gICAqIFRoZSBkZXZpY2UgbmFtZSBleHBvc2VkIHRvIHRoZSBFQzIgaW5zdGFuY2VcbiAgICpcbiAgICogU3VwcGx5IGEgdmFsdWUgbGlrZSBgL2Rldi9zZGhgLCBgeHZkaGAuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0VDMi9sYXRlc3QvVXNlckd1aWRlL2RldmljZV9uYW1pbmcuaHRtbFxuICAgKi9cbiAgcmVhZG9ubHkgZGV2aWNlTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBEZWZpbmVzIHRoZSBibG9jayBkZXZpY2Ugdm9sdW1lLCB0byBiZSBlaXRoZXIgYW4gQW1hem9uIEVCUyB2b2x1bWUgb3IgYW4gZXBoZW1lcmFsIGluc3RhbmNlIHN0b3JlIHZvbHVtZVxuICAgKlxuICAgKiBTdXBwbHkgYSB2YWx1ZSBsaWtlIGBCbG9ja0RldmljZVZvbHVtZS5lYnMoMTUpYCwgYEJsb2NrRGV2aWNlVm9sdW1lLmVwaGVtZXJhbCgwKWAuXG4gICAqL1xuICByZWFkb25seSB2b2x1bWU6IEJsb2NrRGV2aWNlVm9sdW1lO1xuXG4gIC8qKlxuICAgKiBJZiBmYWxzZSwgdGhlIGRldmljZSBtYXBwaW5nIHdpbGwgYmUgc3VwcHJlc3NlZC5cbiAgICogSWYgc2V0IHRvIGZhbHNlIGZvciB0aGUgcm9vdCBkZXZpY2UsIHRoZSBpbnN0YW5jZSBtaWdodCBmYWlsIHRoZSBBbWF6b24gRUMyIGhlYWx0aCBjaGVjay5cbiAgICogQW1hem9uIEVDMiBBdXRvIFNjYWxpbmcgbGF1bmNoZXMgYSByZXBsYWNlbWVudCBpbnN0YW5jZSBpZiB0aGUgaW5zdGFuY2UgZmFpbHMgdGhlIGhlYWx0aCBjaGVjay5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZSAtIGRldmljZSBtYXBwaW5nIGlzIGxlZnQgdW50b3VjaGVkXG4gICAqIEBkZXByZWNhdGVkIHVzZSBgQmxvY2tEZXZpY2VWb2x1bWUubm9EZXZpY2UoKWAgYXMgdGhlIHZvbHVtZSB0byBzdXByZXNzIGEgbWFwcGluZy5cbiAgICpcbiAgICovXG4gIHJlYWRvbmx5IG1hcHBpbmdFbmFibGVkPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBCYXNlIGJsb2NrIGRldmljZSBvcHRpb25zIGZvciBhbiBFQlMgdm9sdW1lXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRWJzRGV2aWNlT3B0aW9uc0Jhc2Uge1xuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgdG8gZGVsZXRlIHRoZSB2b2x1bWUgd2hlbiB0aGUgaW5zdGFuY2UgaXMgdGVybWluYXRlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSB0cnVlIGZvciBBbWF6b24gRUMyIEF1dG8gU2NhbGluZywgZmFsc2Ugb3RoZXJ3aXNlIChlLmcuIEVCUylcbiAgICovXG4gIHJlYWRvbmx5IGRlbGV0ZU9uVGVybWluYXRpb24/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIEkvTyBvcGVyYXRpb25zIHBlciBzZWNvbmQgKElPUFMpIHRvIHByb3Zpc2lvbiBmb3IgdGhlIHZvbHVtZS5cbiAgICpcbiAgICogTXVzdCBvbmx5IGJlIHNldCBmb3IgYHZvbHVtZVR5cGVgOiBgRWJzRGV2aWNlVm9sdW1lVHlwZS5JTzFgXG4gICAqXG4gICAqIFRoZSBtYXhpbXVtIHJhdGlvIG9mIElPUFMgdG8gdm9sdW1lIHNpemUgKGluIEdpQikgaXMgNTA6MSwgc28gZm9yIDUsMDAwIHByb3Zpc2lvbmVkIElPUFMsXG4gICAqIHlvdSBuZWVkIGF0IGxlYXN0IDEwMCBHaUIgc3RvcmFnZSBvbiB0aGUgdm9sdW1lLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NFQzIvbGF0ZXN0L1VzZXJHdWlkZS9FQlNWb2x1bWVUeXBlcy5odG1sXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm9uZSwgcmVxdWlyZWQgZm9yIGBFYnNEZXZpY2VWb2x1bWVUeXBlLklPMWBcbiAgICovXG4gIHJlYWRvbmx5IGlvcHM/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBFQlMgdm9sdW1lIHR5cGVcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTRUMyL2xhdGVzdC9Vc2VyR3VpZGUvRUJTVm9sdW1lVHlwZXMuaHRtbFxuICAgKlxuICAgKiBAZGVmYXVsdCBgRWJzRGV2aWNlVm9sdW1lVHlwZS5HUDJgXG4gICAqL1xuICByZWFkb25seSB2b2x1bWVUeXBlPzogRWJzRGV2aWNlVm9sdW1lVHlwZTtcblxuICAvKipcbiAgICogVGhlIHRocm91Z2hwdXQgdGhhdCB0aGUgdm9sdW1lIHN1cHBvcnRzLCBpbiBNaUIvc1xuICAgKiBUYWtlcyBhIG1pbmltdW0gb2YgMTI1IGFuZCBtYXhpbXVtIG9mIDEwMDAuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0VDMi9sYXRlc3QvVXNlckd1aWRlL0VCU1ZvbHVtZVR5cGVzLmh0bWxcbiAgICogQGRlZmF1bHQgLSAxMjUgTWlCL3MuIE9ubHkgdmFsaWQgb24gZ3AzIHZvbHVtZXMuXG4gICAqL1xuICByZWFkb25seSB0aHJvdWdocHV0PzogbnVtYmVyO1xufVxuXG4vKipcbiAqIEJsb2NrIGRldmljZSBvcHRpb25zIGZvciBhbiBFQlMgdm9sdW1lXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRWJzRGV2aWNlT3B0aW9ucyBleHRlbmRzIEVic0RldmljZU9wdGlvbnNCYXNlIHtcbiAgLyoqXG4gICAqIFNwZWNpZmllcyB3aGV0aGVyIHRoZSBFQlMgdm9sdW1lIGlzIGVuY3J5cHRlZC5cbiAgICogRW5jcnlwdGVkIEVCUyB2b2x1bWVzIGNhbiBvbmx5IGJlIGF0dGFjaGVkIHRvIGluc3RhbmNlcyB0aGF0IHN1cHBvcnQgQW1hem9uIEVCUyBlbmNyeXB0aW9uXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0VDMi9sYXRlc3QvVXNlckd1aWRlL0VCU0VuY3J5cHRpb24uaHRtbCNFQlNFbmNyeXB0aW9uX3N1cHBvcnRlZF9pbnN0YW5jZXNcbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGVuY3J5cHRlZD86IGJvb2xlYW47XG59XG5cbi8qKlxuICogQmxvY2sgZGV2aWNlIG9wdGlvbnMgZm9yIGFuIEVCUyB2b2x1bWUgY3JlYXRlZCBmcm9tIGEgc25hcHNob3RcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFYnNEZXZpY2VTbmFwc2hvdE9wdGlvbnMgZXh0ZW5kcyBFYnNEZXZpY2VPcHRpb25zQmFzZSB7XG4gIC8qKlxuICAgKiBUaGUgdm9sdW1lIHNpemUsIGluIEdpYmlieXRlcyAoR2lCKVxuICAgKlxuICAgKiBJZiB5b3Ugc3BlY2lmeSB2b2x1bWVTaXplLCBpdCBtdXN0IGJlIGVxdWFsIG9yIGdyZWF0ZXIgdGhhbiB0aGUgc2l6ZSBvZiB0aGUgc25hcHNob3QuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gVGhlIHNuYXBzaG90IHNpemVcbiAgICovXG4gIHJlYWRvbmx5IHZvbHVtZVNpemU/OiBudW1iZXI7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBvZiBhbiBFQlMgYmxvY2sgZGV2aWNlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRWJzRGV2aWNlUHJvcHMgZXh0ZW5kcyBFYnNEZXZpY2VTbmFwc2hvdE9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHNuYXBzaG90IElEIG9mIHRoZSB2b2x1bWUgdG8gdXNlXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gc25hcHNob3Qgd2lsbCBiZSB1c2VkXG4gICAqL1xuICByZWFkb25seSBzbmFwc2hvdElkPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIERlc2NyaWJlcyBhIGJsb2NrIGRldmljZSBtYXBwaW5nIGZvciBhbiBFQzIgaW5zdGFuY2Ugb3IgQXV0byBTY2FsaW5nIGdyb3VwLlxuICovXG5leHBvcnQgY2xhc3MgQmxvY2tEZXZpY2VWb2x1bWUge1xuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIF9OT19ERVZJQ0UgPSBuZXcgQmxvY2tEZXZpY2VWb2x1bWUoKTtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBFbGFzdGljIEJsb2NrIFN0b3JhZ2UgZGV2aWNlXG4gICAqXG4gICAqIEBwYXJhbSB2b2x1bWVTaXplIFRoZSB2b2x1bWUgc2l6ZSwgaW4gR2liaWJ5dGVzIChHaUIpXG4gICAqIEBwYXJhbSBvcHRpb25zIGFkZGl0aW9uYWwgZGV2aWNlIG9wdGlvbnNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZWJzKHZvbHVtZVNpemU6IG51bWJlciwgb3B0aW9uczogRWJzRGV2aWNlT3B0aW9ucyA9IHt9KTogQmxvY2tEZXZpY2VWb2x1bWUge1xuICAgIHJldHVybiBuZXcgdGhpcyh7IC4uLm9wdGlvbnMsIHZvbHVtZVNpemUgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBFbGFzdGljIEJsb2NrIFN0b3JhZ2UgZGV2aWNlIGZyb20gYW4gZXhpc3Rpbmcgc25hcHNob3RcbiAgICpcbiAgICogQHBhcmFtIHNuYXBzaG90SWQgVGhlIHNuYXBzaG90IElEIG9mIHRoZSB2b2x1bWUgdG8gdXNlXG4gICAqIEBwYXJhbSBvcHRpb25zIGFkZGl0aW9uYWwgZGV2aWNlIG9wdGlvbnNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZWJzRnJvbVNuYXBzaG90KHNuYXBzaG90SWQ6IHN0cmluZywgb3B0aW9uczogRWJzRGV2aWNlU25hcHNob3RPcHRpb25zID0ge30pOiBCbG9ja0RldmljZVZvbHVtZSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzKHsgLi4ub3B0aW9ucywgc25hcHNob3RJZCB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgdmlydHVhbCwgZXBoZW1lcmFsIGRldmljZS5cbiAgICogVGhlIG5hbWUgd2lsbCBiZSBpbiB0aGUgZm9ybSBlcGhlbWVyYWx7dm9sdW1lSW5kZXh9LlxuICAgKlxuICAgKiBAcGFyYW0gdm9sdW1lSW5kZXggdGhlIHZvbHVtZSBpbmRleC4gTXVzdCBiZSBlcXVhbCBvciBncmVhdGVyIHRoYW4gMFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBlcGhlbWVyYWwodm9sdW1lSW5kZXg6IG51bWJlcikge1xuICAgIGlmICh2b2x1bWVJbmRleCA8IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdm9sdW1lSW5kZXggbXVzdCBiZSBhIG51bWJlciBzdGFydGluZyBmcm9tIDAsIGdvdCBcIiR7dm9sdW1lSW5kZXh9XCJgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IHRoaXModW5kZWZpbmVkLCBgZXBoZW1lcmFsJHt2b2x1bWVJbmRleH1gKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdXByZXNzZXMgYSB2b2x1bWUgbWFwcGluZ1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBub0RldmljZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fTk9fREVWSUNFO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBlYnNEZXZpY2UgRUJTIGRldmljZSBpbmZvXG4gICAqIEBwYXJhbSB2aXJ0dWFsTmFtZSBWaXJ0dWFsIGRldmljZSBuYW1lXG4gICAqL1xuICBwcm90ZWN0ZWQgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IGVic0RldmljZT86IEVic0RldmljZVByb3BzLCBwdWJsaWMgcmVhZG9ubHkgdmlydHVhbE5hbWU/OiBzdHJpbmcpIHtcbiAgfVxufVxuXG4vKipcbiAqIFN1cHBvcnRlZCBFQlMgdm9sdW1lIHR5cGVzIGZvciBibG9ja0RldmljZXNcbiAqL1xuZXhwb3J0IGVudW0gRWJzRGV2aWNlVm9sdW1lVHlwZSB7XG4gIC8qKlxuICAgKiBNYWduZXRpY1xuICAgKi9cbiAgU1RBTkRBUkQgPSAnc3RhbmRhcmQnLFxuXG4gIC8qKlxuICAgKiAgUHJvdmlzaW9uZWQgSU9QUyBTU0QgLSBJTzFcbiAgICovXG4gIElPMSA9ICdpbzEnLFxuXG4gIC8qKlxuICAgKiBHZW5lcmFsIFB1cnBvc2UgU1NEIC0gR1AyXG4gICAqL1xuICBHUDIgPSAnZ3AyJyxcblxuICAvKipcbiAgICogR2VuZXJhbCBQdXJwb3NlIFNTRCAtIEdQM1xuICAgKi9cbiAgR1AzID0gJ2dwMycsXG5cbiAgLyoqXG4gICAqIFRocm91Z2hwdXQgT3B0aW1pemVkIEhERFxuICAgKi9cbiAgU1QxID0gJ3N0MScsXG5cbiAgLyoqXG4gICAqIENvbGQgSEREXG4gICAqL1xuICBTQzEgPSAnc2MxJyxcbn1cbiJdfQ==
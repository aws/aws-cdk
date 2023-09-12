"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TmpfsMountOption = exports.DevicePermission = exports.LinuxParameters = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("aws-cdk-lib/core");
const constructs_1 = require("constructs");
/**
 * Linux-specific options that are applied to the container.
 */
class LinuxParameters extends constructs_1.Construct {
    /**
     * Constructs a new instance of the LinuxParameters class.
     */
    constructor(scope, id, props = {}) {
        super(scope, id);
        /**
         * Device mounts
         */
        this.devices = new Array();
        /**
         * TmpFs mounts
         */
        this.tmpfs = new Array();
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_batch_alpha_LinuxParametersProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, LinuxParameters);
            }
            throw error;
        }
        this.validateProps(props);
        this.sharedMemorySize = props.sharedMemorySize;
        this.initProcessEnabled = props.initProcessEnabled;
        this.maxSwap = props.maxSwap;
        this.swappiness = props.maxSwap ? props.swappiness : undefined;
    }
    validateProps(props) {
        if (!cdk.Token.isUnresolved(props.swappiness) &&
            props.swappiness !== undefined &&
            (!Number.isInteger(props.swappiness) || props.swappiness < 0 || props.swappiness > 100)) {
            throw new Error(`swappiness: Must be an integer between 0 and 100; received ${props.swappiness}.`);
        }
    }
    /**
     * Adds one or more host devices to a container.
     */
    addDevices(...device) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_batch_alpha_Device(device);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addDevices);
            }
            throw error;
        }
        this.devices.push(...device);
    }
    /**
     * Specifies the container path, mount options, and size (in MiB) of the tmpfs mount for a container.
     *
     * Only works with EC2 launch type.
     */
    addTmpfs(...tmpfs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_batch_alpha_Tmpfs(tmpfs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addTmpfs);
            }
            throw error;
        }
        this.tmpfs.push(...tmpfs);
    }
    /**
     * Renders the Linux parameters to the Batch version of this resource,
     * which does not have 'capabilities' and requires tmpfs.containerPath to be defined.
     */
    renderLinuxParameters() {
        return {
            initProcessEnabled: this.initProcessEnabled,
            sharedMemorySize: this.sharedMemorySize?.toMebibytes(),
            maxSwap: this.maxSwap?.toMebibytes(),
            swappiness: this.swappiness,
            devices: cdk.Lazy.any({ produce: () => this.devices.map(renderDevice) }, { omitEmptyArray: true }),
            tmpfs: cdk.Lazy.any({ produce: () => this.tmpfs.map(renderTmpfs) }, { omitEmptyArray: true }),
        };
    }
}
exports.LinuxParameters = LinuxParameters;
_a = JSII_RTTI_SYMBOL_1;
LinuxParameters[_a] = { fqn: "@aws-cdk/aws-batch-alpha.LinuxParameters", version: "0.0.0" };
/**
 * Permissions for device access
 */
var DevicePermission;
(function (DevicePermission) {
    /**
     * Read
     */
    DevicePermission["READ"] = "read";
    /**
     * Write
     */
    DevicePermission["WRITE"] = "write";
    /**
     * Make a node
     */
    DevicePermission["MKNOD"] = "mknod";
})(DevicePermission || (exports.DevicePermission = DevicePermission = {}));
/**
 * The supported options for a tmpfs mount for a container.
 */
var TmpfsMountOption;
(function (TmpfsMountOption) {
    TmpfsMountOption["DEFAULTS"] = "defaults";
    TmpfsMountOption["RO"] = "ro";
    TmpfsMountOption["RW"] = "rw";
    TmpfsMountOption["SUID"] = "suid";
    TmpfsMountOption["NOSUID"] = "nosuid";
    TmpfsMountOption["DEV"] = "dev";
    TmpfsMountOption["NODEV"] = "nodev";
    TmpfsMountOption["EXEC"] = "exec";
    TmpfsMountOption["NOEXEC"] = "noexec";
    TmpfsMountOption["SYNC"] = "sync";
    TmpfsMountOption["ASYNC"] = "async";
    TmpfsMountOption["DIRSYNC"] = "dirsync";
    TmpfsMountOption["REMOUNT"] = "remount";
    TmpfsMountOption["MAND"] = "mand";
    TmpfsMountOption["NOMAND"] = "nomand";
    TmpfsMountOption["ATIME"] = "atime";
    TmpfsMountOption["NOATIME"] = "noatime";
    TmpfsMountOption["DIRATIME"] = "diratime";
    TmpfsMountOption["NODIRATIME"] = "nodiratime";
    TmpfsMountOption["BIND"] = "bind";
    TmpfsMountOption["RBIND"] = "rbind";
    TmpfsMountOption["UNBINDABLE"] = "unbindable";
    TmpfsMountOption["RUNBINDABLE"] = "runbindable";
    TmpfsMountOption["PRIVATE"] = "private";
    TmpfsMountOption["RPRIVATE"] = "rprivate";
    TmpfsMountOption["SHARED"] = "shared";
    TmpfsMountOption["RSHARED"] = "rshared";
    TmpfsMountOption["SLAVE"] = "slave";
    TmpfsMountOption["RSLAVE"] = "rslave";
    TmpfsMountOption["RELATIME"] = "relatime";
    TmpfsMountOption["NORELATIME"] = "norelatime";
    TmpfsMountOption["STRICTATIME"] = "strictatime";
    TmpfsMountOption["NOSTRICTATIME"] = "nostrictatime";
    TmpfsMountOption["MODE"] = "mode";
    TmpfsMountOption["UID"] = "uid";
    TmpfsMountOption["GID"] = "gid";
    TmpfsMountOption["NR_INODES"] = "nr_inodes";
    TmpfsMountOption["NR_BLOCKS"] = "nr_blocks";
    TmpfsMountOption["MPOL"] = "mpol";
})(TmpfsMountOption || (exports.TmpfsMountOption = TmpfsMountOption = {}));
function renderTmpfs(tmpfs) {
    return {
        containerPath: tmpfs.containerPath,
        size: tmpfs.size.toMebibytes(),
        mountOptions: tmpfs.mountOptions,
    };
}
function renderDevice(device) {
    return {
        containerPath: device.containerPath,
        hostPath: device.hostPath,
        permissions: device.permissions,
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGludXgtcGFyYW1ldGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpbnV4LXBhcmFtZXRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQXdDO0FBQ3hDLDJDQUF1QztBQWdEdkM7O0dBRUc7QUFDSCxNQUFhLGVBQWdCLFNBQVEsc0JBQVM7SUErQjVDOztPQUVHO0lBQ0gsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxRQUE4QixFQUFFO1FBQ3hFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFkbkI7O1dBRUc7UUFDZ0IsWUFBTyxHQUFHLElBQUksS0FBSyxFQUFVLENBQUM7UUFFakQ7O1dBRUc7UUFDZ0IsVUFBSyxHQUFHLElBQUksS0FBSyxFQUFTLENBQUM7Ozs7OzsrQ0E3Qm5DLGVBQWU7Ozs7UUFxQ3hCLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFMUIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQztRQUMvQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFDO1FBQ25ELElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUM3QixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztLQUNoRTtJQUVPLGFBQWEsQ0FBQyxLQUEyQjtRQUMvQyxJQUNFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztZQUN6QyxLQUFLLENBQUMsVUFBVSxLQUFLLFNBQVM7WUFDOUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxVQUFVLEdBQUcsQ0FBQyxJQUFJLEtB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QVMsV0FBVyxDQUFDLEtBQVk7SUFDL0IsT0FBTztRQUNMLGFBQWEsRUFBRSxLQUFLLENBQUMsYUFBYTtRQUNsQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7UUFDOUIsWUFBWSxFQUFFLEtBQUssQ0FBQyxZQUFZO0tBQ2pDLENBQUM7QUFDSixDQUFDO0FBRUQsU0FBUyxZQUFZLENBQUMsTUFBYztJQUNsQyxPQUFPO1FBQ0wsYUFBYSxFQUFFLE1BQU0sQ0FBQyxhQUFhO1FBQ25DLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUTtRQUN6QixXQUFXLEVBQUUsTUFBTSxDQUFDLFdBQVc7S0FDaEMsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWIvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENmbkpvYkRlZmluaXRpb24gfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYmF0Y2gnO1xuXG4vKipcbiAqIFRoZSBwcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBMaW51eC1zcGVjaWZpYyBvcHRpb25zIHRoYXQgYXJlIGFwcGxpZWQgdG8gdGhlIGNvbnRhaW5lci5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMaW51eFBhcmFtZXRlcnNQcm9wcyB7XG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgd2hldGhlciB0byBydW4gYW4gaW5pdCBwcm9jZXNzIGluc2lkZSB0aGUgY29udGFpbmVyIHRoYXQgZm9yd2FyZHMgc2lnbmFscyBhbmQgcmVhcHMgcHJvY2Vzc2VzLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgaW5pdFByb2Nlc3NFbmFibGVkPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIHZhbHVlIGZvciB0aGUgc2l6ZSBvZiB0aGUgL2Rldi9zaG0gdm9sdW1lLlxuICAgKlxuICAgKiBAZGVmYXVsdCBObyBzaGFyZWQgbWVtb3J5LlxuICAgKi9cbiAgcmVhZG9ubHkgc2hhcmVkTWVtb3J5U2l6ZT86IGNkay5TaXplO1xuXG4gIC8qKlxuICAgKiBUaGUgdG90YWwgYW1vdW50IG9mIHN3YXAgbWVtb3J5IGEgY29udGFpbmVyIGNhbiB1c2UuIFRoaXMgcGFyYW1ldGVyXG4gICAqIHdpbGwgYmUgdHJhbnNsYXRlZCB0byB0aGUgLS1tZW1vcnktc3dhcCBvcHRpb24gdG8gZG9ja2VyIHJ1bi5cbiAgICpcbiAgICogVGhpcyBwYXJhbWV0ZXIgaXMgb25seSBzdXBwb3J0ZWQgd2hlbiB5b3UgYXJlIHVzaW5nIHRoZSBFQzIgbGF1bmNoIHR5cGUuXG4gICAqIEFjY2VwdGVkIHZhbHVlcyBhcmUgcG9zaXRpdmUgaW50ZWdlcnMuXG4gICAqXG4gICAqIEBkZWZhdWx0IE5vIHN3YXAuXG4gICAqL1xuICByZWFkb25seSBtYXhTd2FwPzogY2RrLlNpemU7XG5cbiAgLyoqXG4gICAgKiBUaGlzIGFsbG93cyB5b3UgdG8gdHVuZSBhIGNvbnRhaW5lcidzIG1lbW9yeSBzd2FwcGluZXNzIGJlaGF2aW9yLiBUaGlzIHBhcmFtZXRlclxuICAgICogbWFwcyB0byB0aGUgLS1tZW1vcnktc3dhcHBpbmVzcyBvcHRpb24gdG8gZG9ja2VyIHJ1bi4gVGhlIHN3YXBwaW5lc3MgcmVsYXRlc1xuICAgICogdG8gdGhlIGtlcm5lbCdzIHRlbmRlbmN5IHRvIHN3YXAgbWVtb3J5LiBBIHZhbHVlIG9mIDAgd2lsbCBjYXVzZSBzd2FwcGluZyB0b1xuICAgICogbm90IGhhcHBlbiB1bmxlc3MgYWJzb2x1dGVseSBuZWNlc3NhcnkuIEEgdmFsdWUgb2YgMTAwIHdpbGwgY2F1c2UgcGFnZXMgdG9cbiAgICAqIGJlIHN3YXBwZWQgdmVyeSBhZ2dyZXNzaXZlbHkuXG4gICAgKlxuICAgICogVGhpcyBwYXJhbWV0ZXIgaXMgb25seSBzdXBwb3J0ZWQgd2hlbiB5b3UgYXJlIHVzaW5nIHRoZSBFQzIgbGF1bmNoIHR5cGUuXG4gICAgKiBBY2NlcHRlZCB2YWx1ZXMgYXJlIHdob2xlIG51bWJlcnMgYmV0d2VlbiAwIGFuZCAxMDAuIElmIGEgdmFsdWUgaXMgbm90XG4gICAgKiBzcGVjaWZpZWQgZm9yIG1heFN3YXAgdGhlbiB0aGlzIHBhcmFtZXRlciBpcyBpZ25vcmVkLlxuICAgICpcbiAgICAqIEBkZWZhdWx0IDYwXG4gICAgKi9cbiAgcmVhZG9ubHkgc3dhcHBpbmVzcz86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBMaW51eC1zcGVjaWZpYyBvcHRpb25zIHRoYXQgYXJlIGFwcGxpZWQgdG8gdGhlIGNvbnRhaW5lci5cbiAqL1xuZXhwb3J0IGNsYXNzIExpbnV4UGFyYW1ldGVycyBleHRlbmRzIENvbnN0cnVjdCB7XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBpbml0IHByb2Nlc3MgaXMgZW5hYmxlZFxuICAgKi9cbiAgcHJvdGVjdGVkIHJlYWRvbmx5IGluaXRQcm9jZXNzRW5hYmxlZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBzaGFyZWQgbWVtb3J5IHNpemUgKGluIE1pQikuIE5vdCB2YWxpZCBmb3IgRmFyZ2F0ZSBsYXVuY2ggdHlwZVxuICAgKi9cbiAgcHJvdGVjdGVkIHJlYWRvbmx5IHNoYXJlZE1lbW9yeVNpemU/OiBjZGsuU2l6ZTtcblxuICAvKipcbiAgICogVGhlIG1heCBzd2FwIG1lbW9yeVxuICAgKi9cbiAgcHJvdGVjdGVkIHJlYWRvbmx5IG1heFN3YXA/OiBjZGsuU2l6ZTtcblxuICAvKipcbiAgICogVGhlIHN3YXBwaW5lc3MgYmVoYXZpb3JcbiAgICovXG4gIHByb3RlY3RlZCByZWFkb25seSBzd2FwcGluZXNzPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBEZXZpY2UgbW91bnRzXG4gICAqL1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgZGV2aWNlcyA9IG5ldyBBcnJheTxEZXZpY2U+KCk7XG5cbiAgLyoqXG4gICAqIFRtcEZzIG1vdW50c1xuICAgKi9cbiAgcHJvdGVjdGVkIHJlYWRvbmx5IHRtcGZzID0gbmV3IEFycmF5PFRtcGZzPigpO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBMaW51eFBhcmFtZXRlcnMgY2xhc3MuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogTGludXhQYXJhbWV0ZXJzUHJvcHMgPSB7fSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICB0aGlzLnZhbGlkYXRlUHJvcHMocHJvcHMpO1xuXG4gICAgdGhpcy5zaGFyZWRNZW1vcnlTaXplID0gcHJvcHMuc2hhcmVkTWVtb3J5U2l6ZTtcbiAgICB0aGlzLmluaXRQcm9jZXNzRW5hYmxlZCA9IHByb3BzLmluaXRQcm9jZXNzRW5hYmxlZDtcbiAgICB0aGlzLm1heFN3YXAgPSBwcm9wcy5tYXhTd2FwO1xuICAgIHRoaXMuc3dhcHBpbmVzcyA9IHByb3BzLm1heFN3YXAgPyBwcm9wcy5zd2FwcGluZXNzIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgcHJpdmF0ZSB2YWxpZGF0ZVByb3BzKHByb3BzOiBMaW51eFBhcmFtZXRlcnNQcm9wcykge1xuICAgIGlmIChcbiAgICAgICFjZGsuVG9rZW4uaXNVbnJlc29sdmVkKHByb3BzLnN3YXBwaW5lc3MpICYmXG4gICAgICBwcm9wcy5zd2FwcGluZXNzICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICghTnVtYmVyLmlzSW50ZWdlcihwcm9wcy5zd2FwcGluZXNzKSB8fCBwcm9wcy5zd2FwcGluZXNzIDwgMCB8fCBwcm9wcy5zd2FwcGluZXNzID4gMTAwKVxuICAgICkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBzd2FwcGluZXNzOiBNdXN0IGJlIGFuIGludGVnZXIgYmV0d2VlbiAwIGFuZCAxMDA7IHJlY2VpdmVkICR7cHJvcHMuc3dhcHBpbmVzc30uYCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgb25lIG9yIG1vcmUgaG9zdCBkZXZpY2VzIHRvIGEgY29udGFpbmVyLlxuICAgKi9cbiAgcHVibGljIGFkZERldmljZXMoLi4uZGV2aWNlOiBEZXZpY2VbXSkge1xuICAgIHRoaXMuZGV2aWNlcy5wdXNoKC4uLmRldmljZSk7XG4gIH1cblxuICAvKipcbiAgICogU3BlY2lmaWVzIHRoZSBjb250YWluZXIgcGF0aCwgbW91bnQgb3B0aW9ucywgYW5kIHNpemUgKGluIE1pQikgb2YgdGhlIHRtcGZzIG1vdW50IGZvciBhIGNvbnRhaW5lci5cbiAgICpcbiAgICogT25seSB3b3JrcyB3aXRoIEVDMiBsYXVuY2ggdHlwZS5cbiAgICovXG4gIHB1YmxpYyBhZGRUbXBmcyguLi50bXBmczogVG1wZnNbXSkge1xuICAgIHRoaXMudG1wZnMucHVzaCguLi50bXBmcyk7XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVycyB0aGUgTGludXggcGFyYW1ldGVycyB0byB0aGUgQmF0Y2ggdmVyc2lvbiBvZiB0aGlzIHJlc291cmNlLFxuICAgKiB3aGljaCBkb2VzIG5vdCBoYXZlICdjYXBhYmlsaXRpZXMnIGFuZCByZXF1aXJlcyB0bXBmcy5jb250YWluZXJQYXRoIHRvIGJlIGRlZmluZWQuXG4gICAqL1xuICBwdWJsaWMgcmVuZGVyTGludXhQYXJhbWV0ZXJzKCk6IENmbkpvYkRlZmluaXRpb24uTGludXhQYXJhbWV0ZXJzUHJvcGVydHkge1xuICAgIHJldHVybiB7XG4gICAgICBpbml0UHJvY2Vzc0VuYWJsZWQ6IHRoaXMuaW5pdFByb2Nlc3NFbmFibGVkLFxuICAgICAgc2hhcmVkTWVtb3J5U2l6ZTogdGhpcy5zaGFyZWRNZW1vcnlTaXplPy50b01lYmlieXRlcygpLFxuICAgICAgbWF4U3dhcDogdGhpcy5tYXhTd2FwPy50b01lYmlieXRlcygpLFxuICAgICAgc3dhcHBpbmVzczogdGhpcy5zd2FwcGluZXNzLFxuICAgICAgZGV2aWNlczogY2RrLkxhenkuYW55KHsgcHJvZHVjZTogKCkgPT4gdGhpcy5kZXZpY2VzLm1hcChyZW5kZXJEZXZpY2UpIH0sIHsgb21pdEVtcHR5QXJyYXk6IHRydWUgfSksXG4gICAgICB0bXBmczogY2RrLkxhenkuYW55KHsgcHJvZHVjZTogKCkgPT4gdGhpcy50bXBmcy5tYXAocmVuZGVyVG1wZnMpIH0sIHsgb21pdEVtcHR5QXJyYXk6IHRydWUgfSksXG4gICAgfTtcbiAgfVxufVxuXG4vKipcbiAqIEEgY29udGFpbmVyIGluc3RhbmNlIGhvc3QgZGV2aWNlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIERldmljZSB7XG4gIC8qKlxuICAgKiBUaGUgcGF0aCBpbnNpZGUgdGhlIGNvbnRhaW5lciBhdCB3aGljaCB0byBleHBvc2UgdGhlIGhvc3QgZGV2aWNlLlxuICAgKlxuICAgKiBAZGVmYXVsdCBTYW1lIHBhdGggYXMgdGhlIGhvc3RcbiAgICovXG4gIHJlYWRvbmx5IGNvbnRhaW5lclBhdGg/OiBzdHJpbmcsXG5cbiAgLyoqXG4gICAqIFRoZSBwYXRoIGZvciB0aGUgZGV2aWNlIG9uIHRoZSBob3N0IGNvbnRhaW5lciBpbnN0YW5jZS5cbiAgICovXG4gIHJlYWRvbmx5IGhvc3RQYXRoOiBzdHJpbmcsXG5cbiAgLyoqXG4gICAqIFRoZSBleHBsaWNpdCBwZXJtaXNzaW9ucyB0byBwcm92aWRlIHRvIHRoZSBjb250YWluZXIgZm9yIHRoZSBkZXZpY2UuXG4gICAqIEJ5IGRlZmF1bHQsIHRoZSBjb250YWluZXIgaGFzIHBlcm1pc3Npb25zIGZvciByZWFkLCB3cml0ZSwgYW5kIG1rbm9kIGZvciB0aGUgZGV2aWNlLlxuICAgKlxuICAgKiBAZGVmYXVsdCBSZWFkb25seVxuICAgKi9cbiAgcmVhZG9ubHkgcGVybWlzc2lvbnM/OiBEZXZpY2VQZXJtaXNzaW9uW11cbn1cblxuLyoqXG4gKiBUaGUgZGV0YWlscyBvZiBhIHRtcGZzIG1vdW50IGZvciBhIGNvbnRhaW5lci5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUbXBmcyB7XG4gIC8qKlxuICAgKiBUaGUgYWJzb2x1dGUgZmlsZSBwYXRoIHdoZXJlIHRoZSB0bXBmcyB2b2x1bWUgaXMgdG8gYmUgbW91bnRlZC5cbiAgICovXG4gIHJlYWRvbmx5IGNvbnRhaW5lclBhdGg6IHN0cmluZyxcblxuICAvKipcbiAgICogVGhlIHNpemUgKGluIE1pQikgb2YgdGhlIHRtcGZzIHZvbHVtZS5cbiAgICovXG4gIHJlYWRvbmx5IHNpemU6IGNkay5TaXplLFxuXG4gIC8qKlxuICAgKiBUaGUgbGlzdCBvZiB0bXBmcyB2b2x1bWUgbW91bnQgb3B0aW9ucy4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZVxuICAgKiBbVG1wZnNNb3VudE9wdGlvbnNdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25FQ1MvbGF0ZXN0L0FQSVJlZmVyZW5jZS9BUElfVG1wZnMuaHRtbCkuXG4gICAqXG4gICAqIEBkZWZhdWx0IG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IG1vdW50T3B0aW9ucz86IFRtcGZzTW91bnRPcHRpb25bXSxcbn1cblxuLyoqXG4gKiBQZXJtaXNzaW9ucyBmb3IgZGV2aWNlIGFjY2Vzc1xuICovXG5leHBvcnQgZW51bSBEZXZpY2VQZXJtaXNzaW9uIHtcbiAgLyoqXG4gICAqIFJlYWRcbiAgICovXG4gIFJFQUQgPSAncmVhZCcsXG5cbiAgLyoqXG4gICAqIFdyaXRlXG4gICAqL1xuICBXUklURSA9ICd3cml0ZScsXG5cbiAgLyoqXG4gICAqIE1ha2UgYSBub2RlXG4gICAqL1xuICBNS05PRCA9ICdta25vZCcsXG59XG5cbi8qKlxuICogVGhlIHN1cHBvcnRlZCBvcHRpb25zIGZvciBhIHRtcGZzIG1vdW50IGZvciBhIGNvbnRhaW5lci5cbiAqL1xuZXhwb3J0IGVudW0gVG1wZnNNb3VudE9wdGlvbiB7XG4gIERFRkFVTFRTID0gJ2RlZmF1bHRzJyxcbiAgUk8gPSAncm8nLFxuICBSVyA9ICdydycsXG4gIFNVSUQgPSAnc3VpZCcsXG4gIE5PU1VJRCA9ICdub3N1aWQnLFxuICBERVYgPSAnZGV2JyxcbiAgTk9ERVYgPSAnbm9kZXYnLFxuICBFWEVDID0gJ2V4ZWMnLFxuICBOT0VYRUMgPSAnbm9leGVjJyxcbiAgU1lOQyA9ICdzeW5jJyxcbiAgQVNZTkMgPSAnYXN5bmMnLFxuICBESVJTWU5DID0gJ2RpcnN5bmMnLFxuICBSRU1PVU5UID0gJ3JlbW91bnQnLFxuICBNQU5EID0gJ21hbmQnLFxuICBOT01BTkQgPSAnbm9tYW5kJyxcbiAgQVRJTUUgPSAnYXRpbWUnLFxuICBOT0FUSU1FID0gJ25vYXRpbWUnLFxuICBESVJBVElNRSA9ICdkaXJhdGltZScsXG4gIE5PRElSQVRJTUUgPSAnbm9kaXJhdGltZScsXG4gIEJJTkQgPSAnYmluZCcsXG4gIFJCSU5EID0gJ3JiaW5kJyxcbiAgVU5CSU5EQUJMRSA9ICd1bmJpbmRhYmxlJyxcbiAgUlVOQklOREFCTEUgPSAncnVuYmluZGFibGUnLFxuICBQUklWQVRFID0gJ3ByaXZhdGUnLFxuICBSUFJJVkFURSA9ICdycHJpdmF0ZScsXG4gIFNIQVJFRCA9ICdzaGFyZWQnLFxuICBSU0hBUkVEID0gJ3JzaGFyZWQnLFxuICBTTEFWRSA9ICdzbGF2ZScsXG4gIFJTTEFWRSA9ICdyc2xhdmUnLFxuICBSRUxBVElNRSA9ICdyZWxhdGltZScsXG4gIE5PUkVMQVRJTUUgPSAnbm9yZWxhdGltZScsXG4gIFNUUklDVEFUSU1FID0gJ3N0cmljdGF0aW1lJyxcbiAgTk9TVFJJQ1RBVElNRSA9ICdub3N0cmljdGF0aW1lJyxcbiAgTU9ERSA9ICdtb2RlJyxcbiAgVUlEID0gJ3VpZCcsXG4gIEdJRCA9ICdnaWQnLFxuICBOUl9JTk9ERVMgPSAnbnJfaW5vZGVzJyxcbiAgTlJfQkxPQ0tTID0gJ25yX2Jsb2NrcycsXG4gIE1QT0wgPSAnbXBvbCdcbn1cblxuZnVuY3Rpb24gcmVuZGVyVG1wZnModG1wZnM6IFRtcGZzKTogQ2ZuSm9iRGVmaW5pdGlvbi5UbXBmc1Byb3BlcnR5IHtcbiAgcmV0dXJuIHtcbiAgICBjb250YWluZXJQYXRoOiB0bXBmcy5jb250YWluZXJQYXRoLFxuICAgIHNpemU6IHRtcGZzLnNpemUudG9NZWJpYnl0ZXMoKSxcbiAgICBtb3VudE9wdGlvbnM6IHRtcGZzLm1vdW50T3B0aW9ucyxcbiAgfTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyRGV2aWNlKGRldmljZTogRGV2aWNlKTogQ2ZuSm9iRGVmaW5pdGlvbi5EZXZpY2VQcm9wZXJ0eSB7XG4gIHJldHVybiB7XG4gICAgY29udGFpbmVyUGF0aDogZGV2aWNlLmNvbnRhaW5lclBhdGgsXG4gICAgaG9zdFBhdGg6IGRldmljZS5ob3N0UGF0aCxcbiAgICBwZXJtaXNzaW9uczogZGV2aWNlLnBlcm1pc3Npb25zLFxuICB9O1xufVxuIl19
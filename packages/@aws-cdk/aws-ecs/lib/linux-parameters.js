"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TmpfsMountOption = exports.DevicePermission = exports.Capability = exports.LinuxParameters = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("@aws-cdk/core");
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
         * Capabilities to be added
         */
        this.capAdd = new Array();
        /**
         * Capabilities to be dropped
         */
        this.capDrop = new Array();
        /**
         * Device mounts
         */
        this.devices = new Array();
        /**
         * TmpFs mounts
         */
        this.tmpfs = new Array();
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_LinuxParametersProps(props);
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
        if (!cdk.Token.isUnresolved(props.sharedMemorySize) &&
            props.sharedMemorySize !== undefined &&
            (!Number.isInteger(props.sharedMemorySize) || props.sharedMemorySize < 0)) {
            throw new Error(`sharedMemorySize: Must be an integer greater than 0; received ${props.sharedMemorySize}.`);
        }
        if (!cdk.Token.isUnresolved(props.swappiness) &&
            props.swappiness !== undefined &&
            (!Number.isInteger(props.swappiness) || props.swappiness < 0 || props.swappiness > 100)) {
            throw new Error(`swappiness: Must be an integer between 0 and 100; received ${props.swappiness}.`);
        }
    }
    /**
     * Adds one or more Linux capabilities to the Docker configuration of a container.
     *
     * Tasks launched on Fargate only support adding the 'SYS_PTRACE' kernel capability.
     */
    addCapabilities(...cap) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_Capability(cap);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addCapabilities);
            }
            throw error;
        }
        this.capAdd.push(...cap);
    }
    /**
     * Removes one or more Linux capabilities to the Docker configuration of a container.
     */
    dropCapabilities(...cap) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_Capability(cap);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.dropCapabilities);
            }
            throw error;
        }
        this.capDrop.push(...cap);
    }
    /**
     * Adds one or more host devices to a container.
     */
    addDevices(...device) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_Device(device);
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
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_Tmpfs(tmpfs);
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
     * Renders the Linux parameters to a CloudFormation object.
     */
    renderLinuxParameters() {
        return {
            initProcessEnabled: this.initProcessEnabled,
            sharedMemorySize: this.sharedMemorySize,
            maxSwap: this.maxSwap?.toMebibytes(),
            swappiness: this.swappiness,
            capabilities: {
                add: cdk.Lazy.list({ produce: () => this.capAdd }, { omitEmpty: true }),
                drop: cdk.Lazy.list({ produce: () => this.capDrop }, { omitEmpty: true }),
            },
            devices: cdk.Lazy.any({ produce: () => this.devices.map(renderDevice) }, { omitEmptyArray: true }),
            tmpfs: cdk.Lazy.any({ produce: () => this.tmpfs.map(renderTmpfs) }, { omitEmptyArray: true }),
        };
    }
}
exports.LinuxParameters = LinuxParameters;
_a = JSII_RTTI_SYMBOL_1;
LinuxParameters[_a] = { fqn: "@aws-cdk/aws-ecs.LinuxParameters", version: "0.0.0" };
function renderDevice(device) {
    return {
        containerPath: device.containerPath,
        hostPath: device.hostPath,
        permissions: device.permissions,
    };
}
function renderTmpfs(tmpfs) {
    return {
        containerPath: tmpfs.containerPath,
        size: tmpfs.size,
        mountOptions: tmpfs.mountOptions,
    };
}
/**
 * A Linux capability
 */
var Capability;
(function (Capability) {
    Capability["ALL"] = "ALL";
    Capability["AUDIT_CONTROL"] = "AUDIT_CONTROL";
    Capability["AUDIT_WRITE"] = "AUDIT_WRITE";
    Capability["BLOCK_SUSPEND"] = "BLOCK_SUSPEND";
    Capability["CHOWN"] = "CHOWN";
    Capability["DAC_OVERRIDE"] = "DAC_OVERRIDE";
    Capability["DAC_READ_SEARCH"] = "DAC_READ_SEARCH";
    Capability["FOWNER"] = "FOWNER";
    Capability["FSETID"] = "FSETID";
    Capability["IPC_LOCK"] = "IPC_LOCK";
    Capability["IPC_OWNER"] = "IPC_OWNER";
    Capability["KILL"] = "KILL";
    Capability["LEASE"] = "LEASE";
    Capability["LINUX_IMMUTABLE"] = "LINUX_IMMUTABLE";
    Capability["MAC_ADMIN"] = "MAC_ADMIN";
    Capability["MAC_OVERRIDE"] = "MAC_OVERRIDE";
    Capability["MKNOD"] = "MKNOD";
    Capability["NET_ADMIN"] = "NET_ADMIN";
    Capability["NET_BIND_SERVICE"] = "NET_BIND_SERVICE";
    Capability["NET_BROADCAST"] = "NET_BROADCAST";
    Capability["NET_RAW"] = "NET_RAW";
    Capability["SETFCAP"] = "SETFCAP";
    Capability["SETGID"] = "SETGID";
    Capability["SETPCAP"] = "SETPCAP";
    Capability["SETUID"] = "SETUID";
    Capability["SYS_ADMIN"] = "SYS_ADMIN";
    Capability["SYS_BOOT"] = "SYS_BOOT";
    Capability["SYS_CHROOT"] = "SYS_CHROOT";
    Capability["SYS_MODULE"] = "SYS_MODULE";
    Capability["SYS_NICE"] = "SYS_NICE";
    Capability["SYS_PACCT"] = "SYS_PACCT";
    Capability["SYS_PTRACE"] = "SYS_PTRACE";
    Capability["SYS_RAWIO"] = "SYS_RAWIO";
    Capability["SYS_RESOURCE"] = "SYS_RESOURCE";
    Capability["SYS_TIME"] = "SYS_TIME";
    Capability["SYS_TTY_CONFIG"] = "SYS_TTY_CONFIG";
    Capability["SYSLOG"] = "SYSLOG";
    Capability["WAKE_ALARM"] = "WAKE_ALARM";
})(Capability = exports.Capability || (exports.Capability = {}));
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
})(DevicePermission = exports.DevicePermission || (exports.DevicePermission = {}));
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
})(TmpfsMountOption = exports.TmpfsMountOption || (exports.TmpfsMountOption = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGludXgtcGFyYW1ldGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpbnV4LXBhcmFtZXRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEscUNBQXFDO0FBQ3JDLDJDQUF1QztBQWdEdkM7O0dBRUc7QUFDSCxNQUFhLGVBQWdCLFNBQVEsc0JBQVM7SUF5QzVDOztPQUVHO0lBQ0gsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxRQUE4QixFQUFFO1FBQ3hFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUF4Qm5COztXQUVHO1FBQ2MsV0FBTSxHQUFHLElBQUksS0FBSyxFQUFjLENBQUM7UUFFbEQ7O1dBRUc7UUFDYyxZQUFPLEdBQUcsSUFBSSxLQUFLLEVBQWMsQ0FBQztRQUVuRDs7V0FFRztRQUNjLFlBQU8sR0FBRyxJQUFJLEtBQUssRUFBVSxDQUFDO1FBRS9DOztXQUVHO1FBQ2MsVUFBSyxHQUFHLElBQUksS0FBSyxFQUFTLENBQUM7Ozs7OzsrQ0F2Q2pDLGVBQWU7Ozs7UUErQ3hCLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFMUIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQztRQUMvQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFDO1FBQ25ELElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUM3QixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztLQUNoRTtJQUVPLGFBQWEsQ0FBQyxLQUEyQjtRQUMvQyxJQUNFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDO1lBQy9DLEtBQUssQ0FBQyxnQkFBZ0IsS0FBSyxT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LCtCQUFXLENBQUE7SUFDWCwrQkFBVyxDQUFBO0lBQ1gsMkNBQXVCLENBQUE7SUFDdkIsMkNBQXVCLENBQUE7SUFDdkIsaUNBQWEsQ0FBQTtBQUNmLENBQUMsRUF4Q1csZ0JBQWdCLEdBQWhCLHdCQUFnQixLQUFoQix3QkFBZ0IsUUF3QzNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDZm5UYXNrRGVmaW5pdGlvbiB9IGZyb20gJy4vZWNzLmdlbmVyYXRlZCc7XG5cbi8qKlxuICogVGhlIHByb3BlcnRpZXMgZm9yIGRlZmluaW5nIExpbnV4LXNwZWNpZmljIG9wdGlvbnMgdGhhdCBhcmUgYXBwbGllZCB0byB0aGUgY29udGFpbmVyLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIExpbnV4UGFyYW1ldGVyc1Byb3BzIHtcbiAgLyoqXG4gICAqIFNwZWNpZmllcyB3aGV0aGVyIHRvIHJ1biBhbiBpbml0IHByb2Nlc3MgaW5zaWRlIHRoZSBjb250YWluZXIgdGhhdCBmb3J3YXJkcyBzaWduYWxzIGFuZCByZWFwcyBwcm9jZXNzZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBpbml0UHJvY2Vzc0VuYWJsZWQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgdmFsdWUgZm9yIHRoZSBzaXplIG9mIHRoZSAvZGV2L3NobSB2b2x1bWUuXG4gICAqXG4gICAqIEBkZWZhdWx0IE5vIHNoYXJlZCBtZW1vcnkuXG4gICAqL1xuICByZWFkb25seSBzaGFyZWRNZW1vcnlTaXplPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgdG90YWwgYW1vdW50IG9mIHN3YXAgbWVtb3J5IGEgY29udGFpbmVyIGNhbiB1c2UuIFRoaXMgcGFyYW1ldGVyXG4gICAqIHdpbGwgYmUgdHJhbnNsYXRlZCB0byB0aGUgLS1tZW1vcnktc3dhcCBvcHRpb24gdG8gZG9ja2VyIHJ1bi5cbiAgICpcbiAgICogVGhpcyBwYXJhbWV0ZXIgaXMgb25seSBzdXBwb3J0ZWQgd2hlbiB5b3UgYXJlIHVzaW5nIHRoZSBFQzIgbGF1bmNoIHR5cGUuXG4gICAqIEFjY2VwdGVkIHZhbHVlcyBhcmUgcG9zaXRpdmUgaW50ZWdlcnMuXG4gICAqXG4gICAqIEBkZWZhdWx0IE5vIHN3YXAuXG4gICAqL1xuICByZWFkb25seSBtYXhTd2FwPzogY2RrLlNpemU7XG5cbiAgLyoqXG4gICAgKiBUaGlzIGFsbG93cyB5b3UgdG8gdHVuZSBhIGNvbnRhaW5lcidzIG1lbW9yeSBzd2FwcGluZXNzIGJlaGF2aW9yLiBUaGlzIHBhcmFtZXRlclxuICAgICogbWFwcyB0byB0aGUgLS1tZW1vcnktc3dhcHBpbmVzcyBvcHRpb24gdG8gZG9ja2VyIHJ1bi4gVGhlIHN3YXBwaW5lc3MgcmVsYXRlc1xuICAgICogdG8gdGhlIGtlcm5lbCdzIHRlbmRlbmN5IHRvIHN3YXAgbWVtb3J5LiBBIHZhbHVlIG9mIDAgd2lsbCBjYXVzZSBzd2FwcGluZyB0b1xuICAgICogbm90IGhhcHBlbiB1bmxlc3MgYWJzb2x1dGVseSBuZWNlc3NhcnkuIEEgdmFsdWUgb2YgMTAwIHdpbGwgY2F1c2UgcGFnZXMgdG9cbiAgICAqIGJlIHN3YXBwZWQgdmVyeSBhZ2dyZXNzaXZlbHkuXG4gICAgKlxuICAgICogVGhpcyBwYXJhbWV0ZXIgaXMgb25seSBzdXBwb3J0ZWQgd2hlbiB5b3UgYXJlIHVzaW5nIHRoZSBFQzIgbGF1bmNoIHR5cGUuXG4gICAgKiBBY2NlcHRlZCB2YWx1ZXMgYXJlIHdob2xlIG51bWJlcnMgYmV0d2VlbiAwIGFuZCAxMDAuIElmIGEgdmFsdWUgaXMgbm90XG4gICAgKiBzcGVjaWZpZWQgZm9yIG1heFN3YXAgdGhlbiB0aGlzIHBhcmFtZXRlciBpcyBpZ25vcmVkLlxuICAgICpcbiAgICAqIEBkZWZhdWx0IDYwXG4gICAgKi9cbiAgcmVhZG9ubHkgc3dhcHBpbmVzcz86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBMaW51eC1zcGVjaWZpYyBvcHRpb25zIHRoYXQgYXJlIGFwcGxpZWQgdG8gdGhlIGNvbnRhaW5lci5cbiAqL1xuZXhwb3J0IGNsYXNzIExpbnV4UGFyYW1ldGVycyBleHRlbmRzIENvbnN0cnVjdCB7XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBpbml0IHByb2Nlc3MgaXMgZW5hYmxlZFxuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBpbml0UHJvY2Vzc0VuYWJsZWQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgc2hhcmVkIG1lbW9yeSBzaXplIChpbiBNaUIpLiBOb3QgdmFsaWQgZm9yIEZhcmdhdGUgbGF1bmNoIHR5cGVcbiAgICovXG4gIHByaXZhdGUgcmVhZG9ubHkgc2hhcmVkTWVtb3J5U2l6ZT86IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIG1heCBzd2FwIG1lbW9yeVxuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBtYXhTd2FwPzogY2RrLlNpemU7XG5cbiAgLyoqXG4gICAqIFRoZSBzd2FwcGluZXNzIGJlaGF2aW9yXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IHN3YXBwaW5lc3M/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIENhcGFiaWxpdGllcyB0byBiZSBhZGRlZFxuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBjYXBBZGQgPSBuZXcgQXJyYXk8Q2FwYWJpbGl0eT4oKTtcblxuICAvKipcbiAgICogQ2FwYWJpbGl0aWVzIHRvIGJlIGRyb3BwZWRcbiAgICovXG4gIHByaXZhdGUgcmVhZG9ubHkgY2FwRHJvcCA9IG5ldyBBcnJheTxDYXBhYmlsaXR5PigpO1xuXG4gIC8qKlxuICAgKiBEZXZpY2UgbW91bnRzXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IGRldmljZXMgPSBuZXcgQXJyYXk8RGV2aWNlPigpO1xuXG4gIC8qKlxuICAgKiBUbXBGcyBtb3VudHNcbiAgICovXG4gIHByaXZhdGUgcmVhZG9ubHkgdG1wZnMgPSBuZXcgQXJyYXk8VG1wZnM+KCk7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIExpbnV4UGFyYW1ldGVycyBjbGFzcy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBMaW51eFBhcmFtZXRlcnNQcm9wcyA9IHt9KSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIHRoaXMudmFsaWRhdGVQcm9wcyhwcm9wcyk7XG5cbiAgICB0aGlzLnNoYXJlZE1lbW9yeVNpemUgPSBwcm9wcy5zaGFyZWRNZW1vcnlTaXplO1xuICAgIHRoaXMuaW5pdFByb2Nlc3NFbmFibGVkID0gcHJvcHMuaW5pdFByb2Nlc3NFbmFibGVkO1xuICAgIHRoaXMubWF4U3dhcCA9IHByb3BzLm1heFN3YXA7XG4gICAgdGhpcy5zd2FwcGluZXNzID0gcHJvcHMubWF4U3dhcCA/IHByb3BzLnN3YXBwaW5lc3MgOiB1bmRlZmluZWQ7XG4gIH1cblxuICBwcml2YXRlIHZhbGlkYXRlUHJvcHMocHJvcHM6IExpbnV4UGFyYW1ldGVyc1Byb3BzKSB7XG4gICAgaWYgKFxuICAgICAgIWNkay5Ub2tlbi5pc1VucmVzb2x2ZWQocHJvcHMuc2hhcmVkTWVtb3J5U2l6ZSkgJiZcbiAgICAgIHByb3BzLnNoYXJlZE1lbW9yeVNpemUgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgKCFOdW1iZXIuaXNJbnRlZ2VyKHByb3BzLnNoYXJlZE1lbW9yeVNpemUpIHx8IHByb3BzLnNoYXJlZE1lbW9yeVNpemUgPCAwKVxuICAgICkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBzaGFyZWRNZW1vcnlTaXplOiBNdXN0IGJlIGFuIGludGVnZXIgZ3JlYXRlciB0aGFuIDA7IHJlY2VpdmVkICR7cHJvcHMuc2hhcmVkTWVtb3J5U2l6ZX0uYCk7XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgIWNkay5Ub2tlbi5pc1VucmVzb2x2ZWQocHJvcHMuc3dhcHBpbmVzcykgJiZcbiAgICAgIHByb3BzLnN3YXBwaW5lc3MgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgKCFOdW1iZXIuaXNJbnRlZ2VyKHByb3BzLnN3YXBwaW5lc3MpIHx8IHByb3BzLnN3YXBwaW5lc3MgPCAwIHx8IHByb3BzLnN3YXBwaW5lc3MgPiAxMDApXG4gICAgKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHN3YXBwaW5lc3M6IE11c3QgYmUgYW4gaW50ZWdlciBiZXR3ZWVuIDAgYW5kIDEwMDsgcmVjZWl2ZWQgJHtwcm9wcy5zd2FwcGluZXNzfS5gKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBvbmUgb3IgbW9yZSBMaW51eCBjYXBhYmlsaXRpZXMgdG8gdGhlIERvY2tlciBjb25maWd1cmF0aW9uIG9mIGEgY29udGFpbmVyLlxuICAgKlxuICAgKiBUYXNrcyBsYXVuY2hlZCBvbiBGYXJnYXRlIG9ubHkgc3VwcG9ydCBhZGRpbmcgdGhlICdTWVNfUFRSQUNFJyBrZXJuZWwgY2FwYWJpbGl0eS5cbiAgICovXG4gIHB1YmxpYyBhZGRDYXBhYmlsaXRpZXMoLi4uY2FwOiBDYXBhYmlsaXR5W10pIHtcbiAgICB0aGlzLmNhcEFkZC5wdXNoKC4uLmNhcCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBvbmUgb3IgbW9yZSBMaW51eCBjYXBhYmlsaXRpZXMgdG8gdGhlIERvY2tlciBjb25maWd1cmF0aW9uIG9mIGEgY29udGFpbmVyLlxuICAgKi9cbiAgcHVibGljIGRyb3BDYXBhYmlsaXRpZXMoLi4uY2FwOiBDYXBhYmlsaXR5W10pIHtcbiAgICB0aGlzLmNhcERyb3AucHVzaCguLi5jYXApO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgb25lIG9yIG1vcmUgaG9zdCBkZXZpY2VzIHRvIGEgY29udGFpbmVyLlxuICAgKi9cbiAgcHVibGljIGFkZERldmljZXMoLi4uZGV2aWNlOiBEZXZpY2VbXSkge1xuICAgIHRoaXMuZGV2aWNlcy5wdXNoKC4uLmRldmljZSk7XG4gIH1cblxuICAvKipcbiAgICogU3BlY2lmaWVzIHRoZSBjb250YWluZXIgcGF0aCwgbW91bnQgb3B0aW9ucywgYW5kIHNpemUgKGluIE1pQikgb2YgdGhlIHRtcGZzIG1vdW50IGZvciBhIGNvbnRhaW5lci5cbiAgICpcbiAgICogT25seSB3b3JrcyB3aXRoIEVDMiBsYXVuY2ggdHlwZS5cbiAgICovXG4gIHB1YmxpYyBhZGRUbXBmcyguLi50bXBmczogVG1wZnNbXSkge1xuICAgIHRoaXMudG1wZnMucHVzaCguLi50bXBmcyk7XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVycyB0aGUgTGludXggcGFyYW1ldGVycyB0byBhIENsb3VkRm9ybWF0aW9uIG9iamVjdC5cbiAgICovXG4gIHB1YmxpYyByZW5kZXJMaW51eFBhcmFtZXRlcnMoKTogQ2ZuVGFza0RlZmluaXRpb24uTGludXhQYXJhbWV0ZXJzUHJvcGVydHkge1xuICAgIHJldHVybiB7XG4gICAgICBpbml0UHJvY2Vzc0VuYWJsZWQ6IHRoaXMuaW5pdFByb2Nlc3NFbmFibGVkLFxuICAgICAgc2hhcmVkTWVtb3J5U2l6ZTogdGhpcy5zaGFyZWRNZW1vcnlTaXplLFxuICAgICAgbWF4U3dhcDogdGhpcy5tYXhTd2FwPy50b01lYmlieXRlcygpLFxuICAgICAgc3dhcHBpbmVzczogdGhpcy5zd2FwcGluZXNzLFxuICAgICAgY2FwYWJpbGl0aWVzOiB7XG4gICAgICAgIGFkZDogY2RrLkxhenkubGlzdCh7IHByb2R1Y2U6ICgpID0+IHRoaXMuY2FwQWRkIH0sIHsgb21pdEVtcHR5OiB0cnVlIH0pLFxuICAgICAgICBkcm9wOiBjZGsuTGF6eS5saXN0KHsgcHJvZHVjZTogKCkgPT4gdGhpcy5jYXBEcm9wIH0sIHsgb21pdEVtcHR5OiB0cnVlIH0pLFxuICAgICAgfSxcbiAgICAgIGRldmljZXM6IGNkay5MYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+IHRoaXMuZGV2aWNlcy5tYXAocmVuZGVyRGV2aWNlKSB9LCB7IG9taXRFbXB0eUFycmF5OiB0cnVlIH0pLFxuICAgICAgdG1wZnM6IGNkay5MYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+IHRoaXMudG1wZnMubWFwKHJlbmRlclRtcGZzKSB9LCB7IG9taXRFbXB0eUFycmF5OiB0cnVlIH0pLFxuICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiBBIGNvbnRhaW5lciBpbnN0YW5jZSBob3N0IGRldmljZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBEZXZpY2Uge1xuICAvKipcbiAgICogVGhlIHBhdGggaW5zaWRlIHRoZSBjb250YWluZXIgYXQgd2hpY2ggdG8gZXhwb3NlIHRoZSBob3N0IGRldmljZS5cbiAgICpcbiAgICogQGRlZmF1bHQgU2FtZSBwYXRoIGFzIHRoZSBob3N0XG4gICAqL1xuICByZWFkb25seSBjb250YWluZXJQYXRoPzogc3RyaW5nLFxuXG4gIC8qKlxuICAgKiBUaGUgcGF0aCBmb3IgdGhlIGRldmljZSBvbiB0aGUgaG9zdCBjb250YWluZXIgaW5zdGFuY2UuXG4gICAqL1xuICByZWFkb25seSBob3N0UGF0aDogc3RyaW5nLFxuXG4gIC8qKlxuICAgKiBUaGUgZXhwbGljaXQgcGVybWlzc2lvbnMgdG8gcHJvdmlkZSB0byB0aGUgY29udGFpbmVyIGZvciB0aGUgZGV2aWNlLlxuICAgKiBCeSBkZWZhdWx0LCB0aGUgY29udGFpbmVyIGhhcyBwZXJtaXNzaW9ucyBmb3IgcmVhZCwgd3JpdGUsIGFuZCBta25vZCBmb3IgdGhlIGRldmljZS5cbiAgICpcbiAgICogQGRlZmF1bHQgUmVhZG9ubHlcbiAgICovXG4gIHJlYWRvbmx5IHBlcm1pc3Npb25zPzogRGV2aWNlUGVybWlzc2lvbltdXG59XG5cbmZ1bmN0aW9uIHJlbmRlckRldmljZShkZXZpY2U6IERldmljZSk6IENmblRhc2tEZWZpbml0aW9uLkRldmljZVByb3BlcnR5IHtcbiAgcmV0dXJuIHtcbiAgICBjb250YWluZXJQYXRoOiBkZXZpY2UuY29udGFpbmVyUGF0aCxcbiAgICBob3N0UGF0aDogZGV2aWNlLmhvc3RQYXRoLFxuICAgIHBlcm1pc3Npb25zOiBkZXZpY2UucGVybWlzc2lvbnMsXG4gIH07XG59XG5cbi8qKlxuICogVGhlIGRldGFpbHMgb2YgYSB0bXBmcyBtb3VudCBmb3IgYSBjb250YWluZXIuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVG1wZnMge1xuICAvKipcbiAgICogVGhlIGFic29sdXRlIGZpbGUgcGF0aCB3aGVyZSB0aGUgdG1wZnMgdm9sdW1lIGlzIHRvIGJlIG1vdW50ZWQuXG4gICAqL1xuICByZWFkb25seSBjb250YWluZXJQYXRoOiBzdHJpbmcsXG5cbiAgLyoqXG4gICAqIFRoZSBzaXplIChpbiBNaUIpIG9mIHRoZSB0bXBmcyB2b2x1bWUuXG4gICAqL1xuICByZWFkb25seSBzaXplOiBudW1iZXIsXG5cbiAgLyoqXG4gICAqIFRoZSBsaXN0IG9mIHRtcGZzIHZvbHVtZSBtb3VudCBvcHRpb25zLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlXG4gICAqIFtUbXBmc01vdW50T3B0aW9uc10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkVDUy9sYXRlc3QvQVBJUmVmZXJlbmNlL0FQSV9UbXBmcy5odG1sKS5cbiAgICovXG4gIHJlYWRvbmx5IG1vdW50T3B0aW9ucz86IFRtcGZzTW91bnRPcHRpb25bXSxcbn1cblxuZnVuY3Rpb24gcmVuZGVyVG1wZnModG1wZnM6IFRtcGZzKTogQ2ZuVGFza0RlZmluaXRpb24uVG1wZnNQcm9wZXJ0eSB7XG4gIHJldHVybiB7XG4gICAgY29udGFpbmVyUGF0aDogdG1wZnMuY29udGFpbmVyUGF0aCxcbiAgICBzaXplOiB0bXBmcy5zaXplLFxuICAgIG1vdW50T3B0aW9uczogdG1wZnMubW91bnRPcHRpb25zLFxuICB9O1xufVxuXG4vKipcbiAqIEEgTGludXggY2FwYWJpbGl0eVxuICovXG5leHBvcnQgZW51bSBDYXBhYmlsaXR5IHtcbiAgQUxMID0gJ0FMTCcsXG4gIEFVRElUX0NPTlRST0wgPSAnQVVESVRfQ09OVFJPTCcsXG4gIEFVRElUX1dSSVRFID0gJ0FVRElUX1dSSVRFJyxcbiAgQkxPQ0tfU1VTUEVORCA9ICdCTE9DS19TVVNQRU5EJyxcbiAgQ0hPV04gPSAnQ0hPV04nLFxuICBEQUNfT1ZFUlJJREUgPSAnREFDX09WRVJSSURFJyxcbiAgREFDX1JFQURfU0VBUkNIID0gJ0RBQ19SRUFEX1NFQVJDSCcsXG4gIEZPV05FUiA9ICdGT1dORVInLFxuICBGU0VUSUQgPSAnRlNFVElEJyxcbiAgSVBDX0xPQ0sgPSAnSVBDX0xPQ0snLFxuICBJUENfT1dORVIgPSAnSVBDX09XTkVSJyxcbiAgS0lMTCA9ICdLSUxMJyxcbiAgTEVBU0UgPSAnTEVBU0UnLFxuICBMSU5VWF9JTU1VVEFCTEUgPSAnTElOVVhfSU1NVVRBQkxFJyxcbiAgTUFDX0FETUlOID0gJ01BQ19BRE1JTicsXG4gIE1BQ19PVkVSUklERSA9ICdNQUNfT1ZFUlJJREUnLFxuICBNS05PRCA9ICdNS05PRCcsXG4gIE5FVF9BRE1JTiA9ICdORVRfQURNSU4nLFxuICBORVRfQklORF9TRVJWSUNFID0gJ05FVF9CSU5EX1NFUlZJQ0UnLFxuICBORVRfQlJPQURDQVNUID0gJ05FVF9CUk9BRENBU1QnLFxuICBORVRfUkFXID0gJ05FVF9SQVcnLFxuICBTRVRGQ0FQID0gJ1NFVEZDQVAnLFxuICBTRVRHSUQgPSAnU0VUR0lEJyxcbiAgU0VUUENBUCA9ICdTRVRQQ0FQJyxcbiAgU0VUVUlEID0gJ1NFVFVJRCcsXG4gIFNZU19BRE1JTiA9ICdTWVNfQURNSU4nLFxuICBTWVNfQk9PVCA9ICdTWVNfQk9PVCcsXG4gIFNZU19DSFJPT1QgPSAnU1lTX0NIUk9PVCcsXG4gIFNZU19NT0RVTEUgPSAnU1lTX01PRFVMRScsXG4gIFNZU19OSUNFID0gJ1NZU19OSUNFJyxcbiAgU1lTX1BBQ0NUID0gJ1NZU19QQUNDVCcsXG4gIFNZU19QVFJBQ0UgPSAnU1lTX1BUUkFDRScsXG4gIFNZU19SQVdJTyA9ICdTWVNfUkFXSU8nLFxuICBTWVNfUkVTT1VSQ0UgPSAnU1lTX1JFU09VUkNFJyxcbiAgU1lTX1RJTUUgPSAnU1lTX1RJTUUnLFxuICBTWVNfVFRZX0NPTkZJRyA9ICdTWVNfVFRZX0NPTkZJRycsXG4gIFNZU0xPRyA9ICdTWVNMT0cnLFxuICBXQUtFX0FMQVJNID0gJ1dBS0VfQUxBUk0nXG59XG5cbi8qKlxuICogUGVybWlzc2lvbnMgZm9yIGRldmljZSBhY2Nlc3NcbiAqL1xuZXhwb3J0IGVudW0gRGV2aWNlUGVybWlzc2lvbiB7XG4gIC8qKlxuICAgKiBSZWFkXG4gICAqL1xuICBSRUFEID0gJ3JlYWQnLFxuXG4gIC8qKlxuICAgKiBXcml0ZVxuICAgKi9cbiAgV1JJVEUgPSAnd3JpdGUnLFxuXG4gIC8qKlxuICAgKiBNYWtlIGEgbm9kZVxuICAgKi9cbiAgTUtOT0QgPSAnbWtub2QnLFxufVxuXG4vKipcbiAqIFRoZSBzdXBwb3J0ZWQgb3B0aW9ucyBmb3IgYSB0bXBmcyBtb3VudCBmb3IgYSBjb250YWluZXIuXG4gKi9cbmV4cG9ydCBlbnVtIFRtcGZzTW91bnRPcHRpb24ge1xuICBERUZBVUxUUyA9ICdkZWZhdWx0cycsXG4gIFJPID0gJ3JvJyxcbiAgUlcgPSAncncnLFxuICBTVUlEID0gJ3N1aWQnLFxuICBOT1NVSUQgPSAnbm9zdWlkJyxcbiAgREVWID0gJ2RldicsXG4gIE5PREVWID0gJ25vZGV2JyxcbiAgRVhFQyA9ICdleGVjJyxcbiAgTk9FWEVDID0gJ25vZXhlYycsXG4gIFNZTkMgPSAnc3luYycsXG4gIEFTWU5DID0gJ2FzeW5jJyxcbiAgRElSU1lOQyA9ICdkaXJzeW5jJyxcbiAgUkVNT1VOVCA9ICdyZW1vdW50JyxcbiAgTUFORCA9ICdtYW5kJyxcbiAgTk9NQU5EID0gJ25vbWFuZCcsXG4gIEFUSU1FID0gJ2F0aW1lJyxcbiAgTk9BVElNRSA9ICdub2F0aW1lJyxcbiAgRElSQVRJTUUgPSAnZGlyYXRpbWUnLFxuICBOT0RJUkFUSU1FID0gJ25vZGlyYXRpbWUnLFxuICBCSU5EID0gJ2JpbmQnLFxuICBSQklORCA9ICdyYmluZCcsXG4gIFVOQklOREFCTEUgPSAndW5iaW5kYWJsZScsXG4gIFJVTkJJTkRBQkxFID0gJ3J1bmJpbmRhYmxlJyxcbiAgUFJJVkFURSA9ICdwcml2YXRlJyxcbiAgUlBSSVZBVEUgPSAncnByaXZhdGUnLFxuICBTSEFSRUQgPSAnc2hhcmVkJyxcbiAgUlNIQVJFRCA9ICdyc2hhcmVkJyxcbiAgU0xBVkUgPSAnc2xhdmUnLFxuICBSU0xBVkUgPSAncnNsYXZlJyxcbiAgUkVMQVRJTUUgPSAncmVsYXRpbWUnLFxuICBOT1JFTEFUSU1FID0gJ25vcmVsYXRpbWUnLFxuICBTVFJJQ1RBVElNRSA9ICdzdHJpY3RhdGltZScsXG4gIE5PU1RSSUNUQVRJTUUgPSAnbm9zdHJpY3RhdGltZScsXG4gIE1PREUgPSAnbW9kZScsXG4gIFVJRCA9ICd1aWQnLFxuICBHSUQgPSAnZ2lkJyxcbiAgTlJfSU5PREVTID0gJ25yX2lub2RlcycsXG4gIE5SX0JMT0NLUyA9ICducl9ibG9ja3MnLFxuICBNUE9MID0gJ21wb2wnXG59XG4iXX0=
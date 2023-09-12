"use strict";
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretPathVolume = exports.HostPathVolume = exports.EmptyDirVolume = exports.EmptyDirMediumType = exports.EksVolume = exports.EksContainerDefinition = exports.ImagePullPolicy = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("aws-cdk-lib/core");
const constructs_1 = require("constructs");
const EMPTY_DIR_VOLUME_SYMBOL = Symbol.for('aws-cdk-lib/aws-batch/lib/eks-container-definition.EmptyDirVolume');
const HOST_PATH_VOLUME_SYMBOL = Symbol.for('aws-cdk-lib/aws-batch/lib/eks-container-definition.HostPathVolume');
const SECRET_PATH_VOLUME_SYMBOL = Symbol.for('aws-cdk-lib/aws-batch/lib/eks-container-definition.SecretVolume');
/**
 * Determines when the image is pulled from the registry to launch a container
 */
var ImagePullPolicy;
(function (ImagePullPolicy) {
    /**
     * Every time the kubelet launches a container,
     * the kubelet queries the container image registry to resolve the name to an image digest.
     * If the kubelet has a container image with that exact digest cached locally,
     * the kubelet uses its cached image; otherwise, the kubelet pulls the image with the resolved digest,
     * and uses that image to launch the container.
     *
     * @see https://docs.docker.com/engine/reference/commandline/pull/#pull-an-image-by-digest-immutable-identifier
     */
    ImagePullPolicy["ALWAYS"] = "Always";
    /**
     * The image is pulled only if it is not already present locally
     */
    ImagePullPolicy["IF_NOT_PRESENT"] = "IfNotPresent";
    /**
     * The kubelet does not try fetching the image.
     * If the image is somehow already present locally,
     * the kubelet attempts to start the container; otherwise, startup fails.
     * See pre-pulled images for more details.
     *
     * @see https://kubernetes.io/docs/concepts/containers/images/#pre-pulled-images
     */
    ImagePullPolicy["NEVER"] = "Never";
})(ImagePullPolicy || (exports.ImagePullPolicy = ImagePullPolicy = {}));
/**
 * A container that can be run with EKS orchestration on EC2 resources
 */
class EksContainerDefinition extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_batch_alpha_EksContainerDefinitionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, EksContainerDefinition);
            }
            throw error;
        }
        this.image = props.image;
        this.args = props.args;
        this.command = props.command;
        this.env = props.env;
        this.imagePullPolicy = props.imagePullPolicy;
        this.name = props.name;
        this.memoryLimit = props.memoryLimit;
        this.memoryReservation = props.memoryReservation;
        this.cpuLimit = props.cpuLimit;
        this.cpuReservation = props.cpuReservation;
        this.gpuLimit = props.gpuLimit;
        this.gpuReservation = props.gpuReservation;
        this.privileged = props.privileged;
        this.readonlyRootFilesystem = props.readonlyRootFilesystem;
        this.runAsGroup = props.runAsGroup;
        this.runAsRoot = props.runAsRoot;
        this.runAsUser = props.runAsUser;
        this.volumes = props.volumes ?? [];
        this.imageConfig = props.image.bind(this, this);
    }
    addVolume(volume) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_batch_alpha_EksVolume(volume);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addVolume);
            }
            throw error;
        }
        this.volumes.push(volume);
    }
    /**
     *
     * @internal
     */
    _renderContainerDefinition() {
        return {
            image: this.imageConfig.imageName,
            command: this.command,
            args: this.args,
            env: Object.keys(this.env ?? {}).map((key) => {
                return {
                    name: key,
                    value: this.env[key],
                };
            }),
            name: this.name,
            imagePullPolicy: this.imagePullPolicy,
            resources: {
                limits: {
                    'cpu': this.cpuLimit,
                    'memory': this.memoryLimit ? this.memoryLimit.toMebibytes() + 'Mi' : undefined,
                    'nvidia.com/gpu': this.gpuLimit,
                },
                requests: {
                    'cpu': this.cpuReservation,
                    'memory': this.memoryReservation ? this.memoryReservation.toMebibytes() + 'Mi' : undefined,
                    'nvidia.com/gpu': this.gpuReservation,
                },
            },
            securityContext: {
                privileged: this.privileged,
                readOnlyRootFilesystem: this.readonlyRootFilesystem,
                runAsGroup: this.runAsGroup,
                runAsNonRoot: !this.runAsRoot,
                runAsUser: this.runAsUser,
            },
            volumeMounts: core_1.Lazy.any({
                produce: () => {
                    if (this.volumes.length === 0) {
                        return undefined;
                    }
                    return this.volumes.map((volume) => {
                        return {
                            name: volume.name,
                            mountPath: volume.containerPath,
                            readOnly: volume.readonly,
                        };
                    });
                },
            }),
        };
    }
    ;
}
exports.EksContainerDefinition = EksContainerDefinition;
_a = JSII_RTTI_SYMBOL_1;
EksContainerDefinition[_a] = { fqn: "@aws-cdk/aws-batch-alpha.EksContainerDefinition", version: "0.0.0" };
/**
 * A Volume that can be mounted to a container supported by EKS
 */
class EksVolume {
    /**
     * Creates a Kubernetes EmptyDir volume
     *
     * @see https://kubernetes.io/docs/concepts/storage/volumes/#emptydir
     */
    static emptyDir(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_batch_alpha_EmptyDirVolumeOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.emptyDir);
            }
            throw error;
        }
        return new EmptyDirVolume(options);
    }
    /**
     * Creates a Kubernetes HostPath volume
     *
     * @see https://kubernetes.io/docs/concepts/storage/volumes/#hostpath
     */
    static hostPath(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_batch_alpha_HostPathVolumeOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.hostPath);
            }
            throw error;
        }
        return new HostPathVolume(options);
    }
    /**
     * Creates a Kubernetes Secret volume
     *
     * @see https://kubernetes.io/docs/concepts/storage/volumes/#secret
     */
    static secret(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_batch_alpha_SecretPathVolumeOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.secret);
            }
            throw error;
        }
        return new SecretPathVolume(options);
    }
    constructor(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_batch_alpha_EksVolumeOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, EksVolume);
            }
            throw error;
        }
        this.name = options.name;
        this.containerPath = options.mountPath;
        this.readonly = options.readonly;
    }
}
exports.EksVolume = EksVolume;
_b = JSII_RTTI_SYMBOL_1;
EksVolume[_b] = { fqn: "@aws-cdk/aws-batch-alpha.EksVolume", version: "0.0.0" };
/**
 * What medium the volume will live in
 */
var EmptyDirMediumType;
(function (EmptyDirMediumType) {
    /**
     * Use the disk storage of the node.
     * Items written here will survive node reboots.
     */
    EmptyDirMediumType["DISK"] = "";
    /**
     * Use the `tmpfs` volume that is backed by RAM of the node.
     * Items written here will *not* survive node reboots.
     */
    EmptyDirMediumType["MEMORY"] = "Memory";
})(EmptyDirMediumType || (exports.EmptyDirMediumType = EmptyDirMediumType = {}));
/**
 * A Kubernetes EmptyDir volume
 *
 * @see https://kubernetes.io/docs/concepts/storage/volumes/#emptydir
 */
class EmptyDirVolume extends EksVolume {
    /**
     * Returns `true` if `x` is an EmptyDirVolume, `false` otherwise
     */
    static isEmptyDirVolume(x) {
        return x !== null && typeof (x) === 'object' && EMPTY_DIR_VOLUME_SYMBOL in x;
    }
    constructor(options) {
        super(options);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_batch_alpha_EmptyDirVolumeOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, EmptyDirVolume);
            }
            throw error;
        }
        this.medium = options.medium;
        this.sizeLimit = options.sizeLimit;
    }
}
exports.EmptyDirVolume = EmptyDirVolume;
_c = JSII_RTTI_SYMBOL_1;
EmptyDirVolume[_c] = { fqn: "@aws-cdk/aws-batch-alpha.EmptyDirVolume", version: "0.0.0" };
Object.defineProperty(EmptyDirVolume.prototype, EMPTY_DIR_VOLUME_SYMBOL, {
    value: true,
    enumerable: false,
    writable: false,
});
/**
 * A Kubernetes HostPath volume
 *
 * @see https://kubernetes.io/docs/concepts/storage/volumes/#hostpath
 */
class HostPathVolume extends EksVolume {
    /**
     * returns `true` if `x` is a HostPathVolume, `false` otherwise
     */
    static isHostPathVolume(x) {
        return x !== null && typeof (x) === 'object' && HOST_PATH_VOLUME_SYMBOL in x;
    }
    constructor(options) {
        super(options);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_batch_alpha_HostPathVolumeOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, HostPathVolume);
            }
            throw error;
        }
        this.path = options.hostPath;
    }
}
exports.HostPathVolume = HostPathVolume;
_d = JSII_RTTI_SYMBOL_1;
HostPathVolume[_d] = { fqn: "@aws-cdk/aws-batch-alpha.HostPathVolume", version: "0.0.0" };
Object.defineProperty(HostPathVolume.prototype, HOST_PATH_VOLUME_SYMBOL, {
    value: true,
    enumerable: false,
    writable: false,
});
/**
 * Specifies the configuration of a Kubernetes secret volume
 *
 * @see https://kubernetes.io/docs/concepts/storage/volumes/#secret
 */
class SecretPathVolume extends EksVolume {
    /**
     * returns `true` if `x` is a `SecretPathVolume` and `false` otherwise
     */
    static isSecretPathVolume(x) {
        return x !== null && typeof (x) === 'object' && SECRET_PATH_VOLUME_SYMBOL in x;
    }
    constructor(options) {
        super(options);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_batch_alpha_SecretPathVolumeOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, SecretPathVolume);
            }
            throw error;
        }
        this.secretName = options.secretName;
        this.optional = options.optional ?? true;
    }
}
exports.SecretPathVolume = SecretPathVolume;
_e = JSII_RTTI_SYMBOL_1;
SecretPathVolume[_e] = { fqn: "@aws-cdk/aws-batch-alpha.SecretPathVolume", version: "0.0.0" };
Object.defineProperty(SecretPathVolume.prototype, SECRET_PATH_VOLUME_SYMBOL, {
    value: true,
    enumerable: false,
    writable: false,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWtzLWNvbnRhaW5lci1kZWZpbml0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZWtzLWNvbnRhaW5lci1kZWZpbml0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLDJDQUE4QztBQUM5QywyQ0FBbUQ7QUFHbkQsTUFBTSx1QkFBdUIsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLG1FQUFtRSxDQUFDLENBQUM7QUFDaEgsTUFBTSx1QkFBdUIsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLG1FQUFtRSxDQUFDLENBQUM7QUFDaEgsTUFBTSx5QkFBeUIsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLGlFQUFpRSxDQUFDLENBQUM7QUFxUGhIOztHQUVHO0FBQ0gsSUFBWSxlQTBCWDtBQTFCRCxXQUFZLGVBQWU7SUFDekI7Ozs7Ozs7O09BUUc7SUFDSCxvQ0FBaUIsQ0FBQTtJQUVqQjs7T0FFRztJQUNILGtEQUErQixDQUFBO0lBRS9COzs7Ozs7O09BT0c7SUFDSCxrQ0FBZSxDQUFBO0FBQ2pCLENBQUMsRUExQlcsZUFBZSwrQkFBZixlQUFlLFFBMEIxQjtBQXdQRDs7R0FFRztBQUNILE1BQWEsc0JBQXVCLFNBQVEsc0JBQVM7SUFzQm5ELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0M7UUFDMUUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs7Ozs7OytDQXZCUixzQkFBc0I7Ozs7UUF5Qi9CLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUN6QixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQzdCLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQztRQUNyQixJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUM7UUFD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QWxCTixjQUFjOzs7O1FBbUJ2QixJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7S0FDOUI7O0FBcEJILHdDQXFCQzs7O0FBRUQsTUFBTSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLHVCQUF1QixFQUFFO0lBQ3ZFLEtBQUssRUFBRSxJQUFJO0lBQ1gsVUFBVSxFQUFFLEtBQUs7SUFDakIsUUFBUSxFQUFFLEtBQUs7Q0FDaEIsQ0FBQyxDQUFDO0FBd0JIOzs7O0dBSUc7QUFDSCxNQUFhLGdCQUFpQixTQUFRLFNBQVM7SUFDN0M7O09BRUc7SUFDSSxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBTTtRQUNyQyxPQUFPLENBQUMsS0FBSyxJQUFJLElBQUksT0FBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsSUFBSSx5QkFBeUIsSUFBSSxDQUFDLENBQUM7S0FDL0U7SUFpQkQsWUFBWSxPQUFnQztRQUMxQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7Ozs7OzsrQ0F4Qk4sZ0JBQWdCOzs7O1FBeUJ6QixJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7UUFDckMsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQztLQUMxQzs7QUEzQkgsNENBNEJDOzs7QUFFRCxNQUFNLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSx5QkFBeUIsRUFBRTtJQUMzRSxLQUFLLEVBQUUsSUFBSTtJQUNYLFVBQVUsRUFBRSxLQUFLO0lBQ2pCLFFBQVEsRUFBRSxLQUFLO0NBQ2hCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGVjcyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNzJztcbmltcG9ydCB7IExhenksIFNpemUgfSBmcm9tICdhd3MtY2RrLWxpYi9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCwgSUNvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2ZuSm9iRGVmaW5pdGlvbiB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1iYXRjaCc7XG5cbmNvbnN0IEVNUFRZX0RJUl9WT0xVTUVfU1lNQk9MID0gU3ltYm9sLmZvcignYXdzLWNkay1saWIvYXdzLWJhdGNoL2xpYi9la3MtY29udGFpbmVyLWRlZmluaXRpb24uRW1wdHlEaXJWb2x1bWUnKTtcbmNvbnN0IEhPU1RfUEFUSF9WT0xVTUVfU1lNQk9MID0gU3ltYm9sLmZvcignYXdzLWNkay1saWIvYXdzLWJhdGNoL2xpYi9la3MtY29udGFpbmVyLWRlZmluaXRpb24uSG9zdFBhdGhWb2x1bWUnKTtcbmNvbnN0IFNFQ1JFVF9QQVRIX1ZPTFVNRV9TWU1CT0wgPSBTeW1ib2wuZm9yKCdhd3MtY2RrLWxpYi9hd3MtYmF0Y2gvbGliL2Vrcy1jb250YWluZXItZGVmaW5pdGlvbi5TZWNyZXRWb2x1bWUnKTtcblxuLyoqXG4gKiBBIGNvbnRhaW5lciB0aGF0IGNhbiBiZSBydW4gd2l0aCBFS1Mgb3JjaGVzdHJhdGlvbiBvbiBFQzIgcmVzb3VyY2VzXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUVrc0NvbnRhaW5lckRlZmluaXRpb24gZXh0ZW5kcyBJQ29uc3RydWN0IHtcbiAgLyoqXG4gICAqIFRoZSBpbWFnZSB0aGF0IHRoaXMgY29udGFpbmVyIHdpbGwgcnVuXG4gICAqL1xuICByZWFkb25seSBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlO1xuXG4gIC8qKlxuICAgKiBBbiBhcnJheSBvZiBhcmd1bWVudHMgdG8gdGhlIGVudHJ5cG9pbnQuXG4gICAqIElmIHRoaXMgaXNuJ3Qgc3BlY2lmaWVkLCB0aGUgQ01EIG9mIHRoZSBjb250YWluZXIgaW1hZ2UgaXMgdXNlZC5cbiAgICogVGhpcyBjb3JyZXNwb25kcyB0byB0aGUgYXJncyBtZW1iZXIgaW4gdGhlIEVudHJ5cG9pbnQgcG9ydGlvbiBvZiB0aGUgUG9kIGluIEt1YmVybmV0ZXMuXG4gICAqIEVudmlyb25tZW50IHZhcmlhYmxlIHJlZmVyZW5jZXMgYXJlIGV4cGFuZGVkIHVzaW5nIHRoZSBjb250YWluZXIncyBlbnZpcm9ubWVudC5cbiAgICogSWYgdGhlIHJlZmVyZW5jZWQgZW52aXJvbm1lbnQgdmFyaWFibGUgZG9lc24ndCBleGlzdCwgdGhlIHJlZmVyZW5jZSBpbiB0aGUgY29tbWFuZCBpc24ndCBjaGFuZ2VkLlxuICAgKiBGb3IgZXhhbXBsZSwgaWYgdGhlIHJlZmVyZW5jZSBpcyB0byBcIiQoTkFNRTEpXCIgYW5kIHRoZSBOQU1FMSBlbnZpcm9ubWVudCB2YXJpYWJsZSBkb2Vzbid0IGV4aXN0LFxuICAgKiB0aGUgY29tbWFuZCBzdHJpbmcgd2lsbCByZW1haW4gXCIkKE5BTUUxKS5cIiAkJCBpcyByZXBsYWNlZCB3aXRoICQsIGFuZCB0aGUgcmVzdWx0aW5nIHN0cmluZyBpc24ndCBleHBhbmRlZC5cbiAgICogb3IgZXhhbXBsZSwgJCQoVkFSX05BTUUpIGlzIHBhc3NlZCBhcyAkKFZBUl9OQU1FKSB3aGV0aGVyIG9yIG5vdCB0aGUgVkFSX05BTUUgZW52aXJvbm1lbnQgdmFyaWFibGUgZXhpc3RzLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5kb2NrZXIuY29tL2VuZ2luZS9yZWZlcmVuY2UvYnVpbGRlci8jY21kXG4gICAqIEBzZWUgaHR0cHM6Ly9rdWJlcm5ldGVzLmlvL2RvY3MvdGFza3MvaW5qZWN0LWRhdGEtYXBwbGljYXRpb24vZGVmaW5lLWNvbW1hbmQtYXJndW1lbnQtY29udGFpbmVyL1xuICAgKi9cbiAgcmVhZG9ubHkgYXJncz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBUaGUgZW50cnlwb2ludCBmb3IgdGhlIGNvbnRhaW5lci4gVGhpcyBpc24ndCBydW4gd2l0aGluIGEgc2hlbGwuXG4gICAqIElmIHRoaXMgaXNuJ3Qgc3BlY2lmaWVkLCB0aGUgYEVOVFJZUE9JTlRgIG9mIHRoZSBjb250YWluZXIgaW1hZ2UgaXMgdXNlZC5cbiAgICogRW52aXJvbm1lbnQgdmFyaWFibGUgcmVmZXJlbmNlcyBhcmUgZXhwYW5kZWQgdXNpbmcgdGhlIGNvbnRhaW5lcidzIGVudmlyb25tZW50LlxuICAgKiBJZiB0aGUgcmVmZXJlbmNlZCBlbnZpcm9ubWVudCB2YXJpYWJsZSBkb2Vzbid0IGV4aXN0LCB0aGUgcmVmZXJlbmNlIGluIHRoZSBjb21tYW5kIGlzbid0IGNoYW5nZWQuXG4gICAqIEZvciBleGFtcGxlLCBpZiB0aGUgcmVmZXJlbmNlIGlzIHRvIGBcIiQoTkFNRTEpXCJgIGFuZCB0aGUgYE5BTUUxYCBlbnZpcm9ubWVudCB2YXJpYWJsZSBkb2Vzbid0IGV4aXN0LFxuICAgKiB0aGUgY29tbWFuZCBzdHJpbmcgd2lsbCByZW1haW4gYFwiJChOQU1FMSkuXCJgIGAkJGAgaXMgcmVwbGFjZWQgd2l0aCBgJGAgYW5kIHRoZSByZXN1bHRpbmcgc3RyaW5nIGlzbid0IGV4cGFuZGVkLlxuICAgKiBGb3IgZXhhbXBsZSwgYCQkKFZBUl9OQU1FKWAgd2lsbCBiZSBwYXNzZWQgYXMgYCQoVkFSX05BTUUpYCB3aGV0aGVyIG9yIG5vdCB0aGUgYFZBUl9OQU1FYCBlbnZpcm9ubWVudCB2YXJpYWJsZSBleGlzdHMuXG5cbiAgICogVGhlIGVudHJ5cG9pbnQgY2FuJ3QgYmUgdXBkYXRlZC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuZG9ja2VyLmNvbS9lbmdpbmUvcmVmZXJlbmNlL2J1aWxkZXIvI2VudHJ5cG9pbnRcbiAgICogQHNlZSBodHRwczovL2t1YmVybmV0ZXMuaW8vZG9jcy90YXNrcy9pbmplY3QtZGF0YS1hcHBsaWNhdGlvbi9kZWZpbmUtY29tbWFuZC1hcmd1bWVudC1jb250YWluZXIvXG4gICAqIEBzZWUgaHR0cHM6Ly9rdWJlcm5ldGVzLmlvL2RvY3MvcmVmZXJlbmNlL2t1YmVybmV0ZXMtYXBpL3dvcmtsb2FkLXJlc291cmNlcy9wb2QtdjEvI2VudHJ5cG9pbnRcbiAgICovXG4gIHJlYWRvbmx5IGNvbW1hbmQ/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogVGhlIGVudmlyb25tZW50IHZhcmlhYmxlcyB0byBwYXNzIHRvIHRoaXMgY29udGFpbmVyLlxuICAgKlxuICAgKiAqTm90ZSo6IEVudmlyb25tZW50IHZhcmlhYmxlcyBjYW5ub3Qgc3RhcnQgd2l0aCBcIkFXU19CQVRDSFwiLlxuICAgKiBUaGlzIG5hbWluZyBjb252ZW50aW9uIGlzIHJlc2VydmVkIGZvciB2YXJpYWJsZXMgdGhhdCBBV1MgQmF0Y2ggc2V0cy5cbiAgICovXG4gIHJlYWRvbmx5IGVudj86IHsgW2tleTpzdHJpbmddOiBzdHJpbmcgfTtcblxuICAvKipcbiAgICogVGhlIGltYWdlIHB1bGwgcG9saWN5IGZvciB0aGlzIGNvbnRhaW5lclxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8va3ViZXJuZXRlcy5pby9kb2NzL2NvbmNlcHRzL2NvbnRhaW5lcnMvaW1hZ2VzLyN1cGRhdGluZy1pbWFnZXNcbiAgICpcbiAgICogQGRlZmF1bHQgLSBgQUxXQVlTYCBpZiB0aGUgYDpsYXRlc3RgIHRhZyBpcyBzcGVjaWZpZWQsIGBJRl9OT1RfUFJFU0VOVGAgb3RoZXJ3aXNlXG4gICAqL1xuICByZWFkb25seSBpbWFnZVB1bGxQb2xpY3k/OiBJbWFnZVB1bGxQb2xpY3k7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoaXMgY29udGFpbmVyXG4gICAqXG4gICAqIEBkZWZhdWx0OiBgJ0RlZmF1bHQnYFxuICAgKi9cbiAgcmVhZG9ubHkgbmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGFtb3VudCAoaW4gTWlCKSBvZiBtZW1vcnkgdG8gcHJlc2VudCB0byB0aGUgY29udGFpbmVyLlxuICAgKiBJZiB5b3VyIGNvbnRhaW5lciBhdHRlbXB0cyB0byBleGNlZWQgdGhlIGFsbG9jYXRlZCBtZW1vcnksIGl0IHdpbGwgYmUgdGVybWluYXRlZC5cbiAgICpcbiAgICogTXVzdCBiZSBsYXJnZXIgdGhhdCA0IE1pQlxuICAgKlxuICAgKiBBdCBsZWFzdCBvbmUgb2YgYG1lbW9yeUxpbWl0YCBhbmQgYG1lbW9yeVJlc2VydmF0aW9uYCBpcyByZXF1aXJlZFxuICAgKlxuICAgKiAqTm90ZSo6IFRvIG1heGltaXplIHlvdXIgcmVzb3VyY2UgdXRpbGl6YXRpb24sIHByb3ZpZGUgeW91ciBqb2JzIHdpdGggYXMgbXVjaCBtZW1vcnkgYXMgcG9zc2libGVcbiAgICogZm9yIHRoZSBzcGVjaWZpYyBpbnN0YW5jZSB0eXBlIHRoYXQgeW91IGFyZSB1c2luZy5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2t1YmVybmV0ZXMuaW8vZG9jcy9jb25jZXB0cy9jb25maWd1cmF0aW9uL21hbmFnZS1yZXNvdXJjZXMtY29udGFpbmVycy9cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vYmF0Y2gvbGF0ZXN0L3VzZXJndWlkZS9tZW1vcnktbWFuYWdlbWVudC5odG1sXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gbWVtb3J5IGxpbWl0XG4gICAqL1xuICByZWFkb25seSBtZW1vcnlMaW1pdD86IFNpemU7XG5cbiAgLyoqXG4gICAqIFRoZSBzb2Z0IGxpbWl0IChpbiBNaUIpIG9mIG1lbW9yeSB0byByZXNlcnZlIGZvciB0aGUgY29udGFpbmVyLlxuICAgKiBZb3VyIGNvbnRhaW5lciB3aWxsIGJlIGdpdmVuIGF0IGxlYXN0IHRoaXMgbXVjaCBtZW1vcnksIGJ1dCBtYXkgY29uc3VtZSBtb3JlLlxuICAgKlxuICAgKiBNdXN0IGJlIGxhcmdlciB0aGF0IDQgTWlCXG4gICAqXG4gICAqIFdoZW4gc3lzdGVtIG1lbW9yeSBpcyB1bmRlciBoZWF2eSBjb250ZW50aW9uLCBEb2NrZXIgYXR0ZW1wdHMgdG8ga2VlcCB0aGVcbiAgICogY29udGFpbmVyIG1lbW9yeSB0byB0aGlzIHNvZnQgbGltaXQuIEhvd2V2ZXIsIHlvdXIgY29udGFpbmVyIGNhbiBjb25zdW1lIG1vcmVcbiAgICogbWVtb3J5IHdoZW4gaXQgbmVlZHMgdG8sIHVwIHRvIGVpdGhlciB0aGUgaGFyZCBsaW1pdCBzcGVjaWZpZWQgd2l0aCB0aGUgbWVtb3J5XG4gICAqIHBhcmFtZXRlciAoaWYgYXBwbGljYWJsZSksIG9yIGFsbCBvZiB0aGUgYXZhaWxhYmxlIG1lbW9yeSBvbiB0aGUgY29udGFpbmVyXG4gICAqIGluc3RhbmNlLCB3aGljaGV2ZXIgY29tZXMgZmlyc3QuXG4gICAqXG4gICAqIEF0IGxlYXN0IG9uZSBvZiBgbWVtb3J5TGltaXRgIGFuZCBgbWVtb3J5UmVzZXJ2YXRpb25gIGlzIHJlcXVpcmVkLlxuICAgKiBJZiBib3RoIGFyZSBzcGVjaWZpZWQsIHRoZW4gYG1lbW9yeUxpbWl0YCBtdXN0IGJlIGVxdWFsIHRvIGBtZW1vcnlSZXNlcnZhdGlvbmBcbiAgICpcbiAgICogKk5vdGUqOiBUbyBtYXhpbWl6ZSB5b3VyIHJlc291cmNlIHV0aWxpemF0aW9uLCBwcm92aWRlIHlvdXIgam9icyB3aXRoIGFzIG11Y2ggbWVtb3J5IGFzIHBvc3NpYmxlXG4gICAqIGZvciB0aGUgc3BlY2lmaWMgaW5zdGFuY2UgdHlwZSB0aGF0IHlvdSBhcmUgdXNpbmcuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9rdWJlcm5ldGVzLmlvL2RvY3MvY29uY2VwdHMvY29uZmlndXJhdGlvbi9tYW5hZ2UtcmVzb3VyY2VzLWNvbnRhaW5lcnMvXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2JhdGNoL2xhdGVzdC91c2VyZ3VpZGUvbWVtb3J5LW1hbmFnZW1lbnQuaHRtbFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIG1lbW9yeSByZXNlcnZlZFxuICAgKi9cbiAgcmVhZG9ubHkgbWVtb3J5UmVzZXJ2YXRpb24/OiBTaXplO1xuXG4gIC8qKlxuICAgKiBUaGUgaGFyZCBsaW1pdCBvZiBDUFVzIHRvIHByZXNlbnQgdG8gdGhpcyBjb250YWluZXIuXG4gICAqIE11c3QgYmUgYW4gZXZlbiBtdWx0aXBsZSBvZiAwLjI1XG4gICAqXG4gICAqIElmIHlvdXIgY29udGFpbmVyIGF0dGVtcHRzIHRvIGV4Y2VlZCB0aGlzIGxpbWl0LCBpdCB3aWxsIGJlIHRlcm1pbmF0ZWQuXG4gICAqXG4gICAqIEF0IGxlYXN0IG9uZSBvZiBgY3B1UmVzZXJ2YXRpb25gIGFuZCBgY3B1TGltaXRgIGlzIHJlcXVpcmVkLlxuICAgKiBJZiBib3RoIGFyZSBzcGVjaWZpZWQsIHRoZW4gYGNwdUxpbWl0YCBtdXN0IGJlIGF0IGxlYXN0IGFzIGxhcmdlIGFzIGBjcHVSZXNlcnZhdGlvbmAuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9rdWJlcm5ldGVzLmlvL2RvY3MvY29uY2VwdHMvY29uZmlndXJhdGlvbi9tYW5hZ2UtcmVzb3VyY2VzLWNvbnRhaW5lcnMvXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gQ1BVIGxpbWl0XG4gICAqL1xuICByZWFkb25seSBjcHVMaW1pdD86IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIHNvZnQgbGltaXQgb2YgQ1BVcyB0byByZXNlcnZlIGZvciB0aGUgY29udGFpbmVyXG4gICAqIE11c3QgYmUgYW4gZXZlbiBtdWx0aXBsZSBvZiAwLjI1XG4gICAqXG4gICAqIFRoZSBjb250YWluZXIgd2lsbCBnaXZlbiBhdCBsZWFzdCB0aGlzIG1hbnkgQ1BVcywgYnV0IG1heSBjb25zdW1lIG1vcmUuXG4gICAqXG4gICAqIEF0IGxlYXN0IG9uZSBvZiBgY3B1UmVzZXJ2YXRpb25gIGFuZCBgY3B1TGltaXRgIGlzIHJlcXVpcmVkLlxuICAgKiBJZiBib3RoIGFyZSBzcGVjaWZpZWQsIHRoZW4gYGNwdUxpbWl0YCBtdXN0IGJlIGF0IGxlYXN0IGFzIGxhcmdlIGFzIGBjcHVSZXNlcnZhdGlvbmAuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9rdWJlcm5ldGVzLmlvL2RvY3MvY29uY2VwdHMvY29uZmlndXJhdGlvbi9tYW5hZ2UtcmVzb3VyY2VzLWNvbnRhaW5lcnMvXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gQ1BVcyByZXNlcnZlZFxuICAgKi9cbiAgcmVhZG9ubHkgY3B1UmVzZXJ2YXRpb24/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBoYXJkIGxpbWl0IG9mIEdQVXMgdG8gcHJlc2VudCB0byB0aGlzIGNvbnRhaW5lci5cbiAgICpcbiAgICogSWYgeW91ciBjb250YWluZXIgYXR0ZW1wdHMgdG8gZXhjZWVkIHRoaXMgbGltaXQsIGl0IHdpbGwgYmUgdGVybWluYXRlZC5cbiAgICpcbiAgICogSWYgYm90aCBgZ3B1UmVzZXJ2YXRpb25gIGFuZCBgZ3B1TGltaXRgIGFyZSBzcGVjaWZpZWQsIHRoZW4gYGdwdUxpbWl0YCBtdXN0IGJlIGVxdWFsIHRvIGBncHVSZXNlcnZhdGlvbmAuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9rdWJlcm5ldGVzLmlvL2RvY3MvY29uY2VwdHMvY29uZmlndXJhdGlvbi9tYW5hZ2UtcmVzb3VyY2VzLWNvbnRhaW5lcnMvXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gR1BVIGxpbWl0XG4gICAqL1xuICByZWFkb25seSBncHVMaW1pdD86IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIHNvZnQgbGltaXQgb2YgQ1BVcyB0byByZXNlcnZlIGZvciB0aGUgY29udGFpbmVyXG4gICAqIE11c3QgYmUgYW4gZXZlbiBtdWx0aXBsZSBvZiAwLjI1XG4gICAqXG4gICAqIFRoZSBjb250YWluZXIgd2lsbCBnaXZlbiBhdCBsZWFzdCB0aGlzIG1hbnkgQ1BVcywgYnV0IG1heSBjb25zdW1lIG1vcmUuXG4gICAqXG4gICAqIElmIGJvdGggYGdwdVJlc2VydmF0aW9uYCBhbmQgYGdwdUxpbWl0YCBhcmUgc3BlY2lmaWVkLCB0aGVuIGBncHVMaW1pdGAgbXVzdCBiZSBlcXVhbCB0byBgZ3B1UmVzZXJ2YXRpb25gLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8va3ViZXJuZXRlcy5pby9kb2NzL2NvbmNlcHRzL2NvbmZpZ3VyYXRpb24vbWFuYWdlLXJlc291cmNlcy1jb250YWluZXJzL1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIEdQVXMgcmVzZXJ2ZWRcbiAgICovXG4gIHJlYWRvbmx5IGdwdVJlc2VydmF0aW9uPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBJZiBzcGVjaWZpZWQsIGdpdmVzIHRoaXMgY29udGFpbmVyIGVsZXZhdGVkIHBlcm1pc3Npb25zIG9uIHRoZSBob3N0IGNvbnRhaW5lciBpbnN0YW5jZS5cbiAgICogVGhlIGxldmVsIG9mIHBlcm1pc3Npb25zIGFyZSBzaW1pbGFyIHRvIHRoZSByb290IHVzZXIgcGVybWlzc2lvbnMuXG4gICAqXG4gICAqIFRoaXMgcGFyYW1ldGVyIG1hcHMgdG8gYHByaXZpbGVnZWRgIHBvbGljeSBpbiB0aGUgUHJpdmlsZWdlZCBwb2Qgc2VjdXJpdHkgcG9saWNpZXMgaW4gdGhlIEt1YmVybmV0ZXMgZG9jdW1lbnRhdGlvbi5cbiAgICpcbiAgICogKk5vdGUqOiB0aGlzIGlzIG9ubHkgY29tcGF0aWJsZSB3aXRoIEt1YmVybmV0ZXMgPCB2MS4yNVxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8va3ViZXJuZXRlcy5pby9kb2NzL2NvbmNlcHRzL3NlY3VyaXR5L3BvZC1zZWN1cml0eS1wb2xpY3kvI3ZvbHVtZXMtYW5kLWZpbGUtc3lzdGVtc1xuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgcHJpdmlsZWdlZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIElmIHNwZWNpZmllZCwgZ2l2ZXMgdGhpcyBjb250YWluZXIgcmVhZG9ubHkgYWNjZXNzIHRvIGl0cyByb290IGZpbGUgc3lzdGVtLlxuICAgKlxuICAgKiBUaGlzIHBhcmFtZXRlciBtYXBzIHRvIGBSZWFkT25seVJvb3RGaWxlc3lzdGVtYCBwb2xpY3kgaW4gdGhlIFZvbHVtZXMgYW5kIGZpbGUgc3lzdGVtcyBwb2Qgc2VjdXJpdHkgcG9saWNpZXMgaW4gdGhlIEt1YmVybmV0ZXMgZG9jdW1lbnRhdGlvbi5cbiAgICpcbiAgICogKk5vdGUqOiB0aGlzIGlzIG9ubHkgY29tcGF0aWJsZSB3aXRoIEt1YmVybmV0ZXMgPCB2MS4yNVxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8va3ViZXJuZXRlcy5pby9kb2NzL2NvbmNlcHRzL3NlY3VyaXR5L3BvZC1zZWN1cml0eS1wb2xpY3kvI3ZvbHVtZXMtYW5kLWZpbGUtc3lzdGVtc1xuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgcmVhZG9ubHlSb290RmlsZXN5c3RlbT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIElmIHNwZWNpZmllZCwgdGhlIGNvbnRhaW5lciBpcyBydW4gYXMgdGhlIHNwZWNpZmllZCBncm91cCBJRCAoYGdpZGApLlxuICAgKiBJZiB0aGlzIHBhcmFtZXRlciBpc24ndCBzcGVjaWZpZWQsIHRoZSBkZWZhdWx0IGlzIHRoZSBncm91cCB0aGF0J3Mgc3BlY2lmaWVkIGluIHRoZSBpbWFnZSBtZXRhZGF0YS5cbiAgICogVGhpcyBwYXJhbWV0ZXIgbWFwcyB0byBgUnVuQXNHcm91cGAgYW5kIGBNdXN0UnVuQXNgIHBvbGljeSBpbiB0aGUgVXNlcnMgYW5kIGdyb3VwcyBwb2Qgc2VjdXJpdHkgcG9saWNpZXMgaW4gdGhlIEt1YmVybmV0ZXMgZG9jdW1lbnRhdGlvbi5cbiAgICpcbiAgICogKk5vdGUqOiB0aGlzIGlzIG9ubHkgY29tcGF0aWJsZSB3aXRoIEt1YmVybmV0ZXMgPCB2MS4yNVxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8va3ViZXJuZXRlcy5pby9kb2NzL2NvbmNlcHRzL3NlY3VyaXR5L3BvZC1zZWN1cml0eS1wb2xpY3kvI3VzZXJzLWFuZC1ncm91cHNcbiAgICpcbiAgICogQGRlZmF1bHQgbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgcnVuQXNHcm91cD86IG51bWJlcjtcblxuICAvKipcbiAgICogSWYgc3BlY2lmaWVkLCB0aGUgY29udGFpbmVyIGlzIHJ1biBhcyBhIHVzZXIgd2l0aCBhIGB1aWRgIG90aGVyIHRoYW4gMC4gT3RoZXJ3aXNlLCBubyBzdWNoIHJ1bGUgaXMgZW5mb3JjZWQuXG4gICAqIFRoaXMgcGFyYW1ldGVyIG1hcHMgdG8gYFJ1bkFzVXNlcmAgYW5kIGBNdXN0UnVuQXNOb25Sb290YCBwb2xpY3kgaW4gdGhlIFVzZXJzIGFuZCBncm91cHMgcG9kIHNlY3VyaXR5IHBvbGljaWVzIGluIHRoZSBLdWJlcm5ldGVzIGRvY3VtZW50YXRpb24uXG4gICAqXG4gICAqICpOb3RlKjogdGhpcyBpcyBvbmx5IGNvbXBhdGlibGUgd2l0aCBLdWJlcm5ldGVzIDwgdjEuMjVcbiAgICpcbiAgICogQHNlZSBodHRwczovL2t1YmVybmV0ZXMuaW8vZG9jcy9jb25jZXB0cy9zZWN1cml0eS9wb2Qtc2VjdXJpdHktcG9saWN5LyN1c2Vycy1hbmQtZ3JvdXBzXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdGhlIGNvbnRhaW5lciBpcyAqbm90KiByZXF1aXJlZCB0byBydW4gYXMgYSBub24tcm9vdCB1c2VyXG4gICAqL1xuICByZWFkb25seSBydW5Bc1Jvb3Q/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBJZiBzcGVjaWZpZWQsIHRoaXMgY29udGFpbmVyIGlzIHJ1biBhcyB0aGUgc3BlY2lmaWVkIHVzZXIgSUQgKGB1aWRgKS5cbiAgICogVGhpcyBwYXJhbWV0ZXIgbWFwcyB0byBgUnVuQXNVc2VyYCBhbmQgYE11c3RSdW5Bc2AgcG9saWN5IGluIHRoZSBVc2VycyBhbmQgZ3JvdXBzIHBvZCBzZWN1cml0eSBwb2xpY2llcyBpbiB0aGUgS3ViZXJuZXRlcyBkb2N1bWVudGF0aW9uLlxuICAgKlxuICAgKiAqTm90ZSo6IHRoaXMgaXMgb25seSBjb21wYXRpYmxlIHdpdGggS3ViZXJuZXRlcyA8IHYxLjI1XG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9rdWJlcm5ldGVzLmlvL2RvY3MvY29uY2VwdHMvc2VjdXJpdHkvcG9kLXNlY3VyaXR5LXBvbGljeS8jdXNlcnMtYW5kLWdyb3Vwc1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIHRoZSB1c2VyIHRoYXQgaXMgc3BlY2lmaWVkIGluIHRoZSBpbWFnZSBtZXRhZGF0YS5cbiAgICovXG4gIHJlYWRvbmx5IHJ1bkFzVXNlcj86IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIFZvbHVtZXMgdG8gbW91bnQgdG8gdGhpcyBjb250YWluZXIuXG4gICAqIEF1dG9tYXRpY2FsbHkgYWRkZWQgdG8gdGhlIFBvZC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2t1YmVybmV0ZXMuaW8vZG9jcy9jb25jZXB0cy9zdG9yYWdlL3ZvbHVtZXMvXG4gICAqL1xuICByZWFkb25seSB2b2x1bWVzOiBFa3NWb2x1bWVbXTtcblxuICAvKipcbiAgICogTW91bnQgYSBWb2x1bWUgdG8gdGhpcyBjb250YWluZXIuIEF1dG9tYXRpY2FsbHkgYWRkZWQgdG8gdGhlIFBvZC5cbiAgICovXG4gIGFkZFZvbHVtZSh2b2x1bWU6IEVrc1ZvbHVtZSk6IHZvaWQ7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGVuIHRoZSBpbWFnZSBpcyBwdWxsZWQgZnJvbSB0aGUgcmVnaXN0cnkgdG8gbGF1bmNoIGEgY29udGFpbmVyXG4gKi9cbmV4cG9ydCBlbnVtIEltYWdlUHVsbFBvbGljeSB7XG4gIC8qKlxuICAgKiBFdmVyeSB0aW1lIHRoZSBrdWJlbGV0IGxhdW5jaGVzIGEgY29udGFpbmVyLFxuICAgKiB0aGUga3ViZWxldCBxdWVyaWVzIHRoZSBjb250YWluZXIgaW1hZ2UgcmVnaXN0cnkgdG8gcmVzb2x2ZSB0aGUgbmFtZSB0byBhbiBpbWFnZSBkaWdlc3QuXG4gICAqIElmIHRoZSBrdWJlbGV0IGhhcyBhIGNvbnRhaW5lciBpbWFnZSB3aXRoIHRoYXQgZXhhY3QgZGlnZXN0IGNhY2hlZCBsb2NhbGx5LFxuICAgKiB0aGUga3ViZWxldCB1c2VzIGl0cyBjYWNoZWQgaW1hZ2U7IG90aGVyd2lzZSwgdGhlIGt1YmVsZXQgcHVsbHMgdGhlIGltYWdlIHdpdGggdGhlIHJlc29sdmVkIGRpZ2VzdCxcbiAgICogYW5kIHVzZXMgdGhhdCBpbWFnZSB0byBsYXVuY2ggdGhlIGNvbnRhaW5lci5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuZG9ja2VyLmNvbS9lbmdpbmUvcmVmZXJlbmNlL2NvbW1hbmRsaW5lL3B1bGwvI3B1bGwtYW4taW1hZ2UtYnktZGlnZXN0LWltbXV0YWJsZS1pZGVudGlmaWVyXG4gICAqL1xuICBBTFdBWVMgPSAnQWx3YXlzJyxcblxuICAvKipcbiAgICogVGhlIGltYWdlIGlzIHB1bGxlZCBvbmx5IGlmIGl0IGlzIG5vdCBhbHJlYWR5IHByZXNlbnQgbG9jYWxseVxuICAgKi9cbiAgSUZfTk9UX1BSRVNFTlQgPSAnSWZOb3RQcmVzZW50JyxcblxuICAvKipcbiAgICogVGhlIGt1YmVsZXQgZG9lcyBub3QgdHJ5IGZldGNoaW5nIHRoZSBpbWFnZS5cbiAgICogSWYgdGhlIGltYWdlIGlzIHNvbWVob3cgYWxyZWFkeSBwcmVzZW50IGxvY2FsbHksXG4gICAqIHRoZSBrdWJlbGV0IGF0dGVtcHRzIHRvIHN0YXJ0IHRoZSBjb250YWluZXI7IG90aGVyd2lzZSwgc3RhcnR1cCBmYWlscy5cbiAgICogU2VlIHByZS1wdWxsZWQgaW1hZ2VzIGZvciBtb3JlIGRldGFpbHMuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9rdWJlcm5ldGVzLmlvL2RvY3MvY29uY2VwdHMvY29udGFpbmVycy9pbWFnZXMvI3ByZS1wdWxsZWQtaW1hZ2VzXG4gICAqL1xuICBORVZFUiA9ICdOZXZlcicsXG59XG5cbi8qKlxuICogUHJvcHMgdG8gY29uZmlndXJlIGFuIEVrc0NvbnRhaW5lckRlZmluaXRpb25cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFa3NDb250YWluZXJEZWZpbml0aW9uUHJvcHMge1xuICAvKipcbiAgICogVGhlIGltYWdlIHRoYXQgdGhpcyBjb250YWluZXIgd2lsbCBydW5cbiAgICovXG4gIHJlYWRvbmx5IGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2U7XG5cbiAgLyoqXG4gICAqIEFuIGFycmF5IG9mIGFyZ3VtZW50cyB0byB0aGUgZW50cnlwb2ludC5cbiAgICogSWYgdGhpcyBpc24ndCBzcGVjaWZpZWQsIHRoZSBDTUQgb2YgdGhlIGNvbnRhaW5lciBpbWFnZSBpcyB1c2VkLlxuICAgKiBUaGlzIGNvcnJlc3BvbmRzIHRvIHRoZSBhcmdzIG1lbWJlciBpbiB0aGUgRW50cnlwb2ludCBwb3J0aW9uIG9mIHRoZSBQb2QgaW4gS3ViZXJuZXRlcy5cbiAgICogRW52aXJvbm1lbnQgdmFyaWFibGUgcmVmZXJlbmNlcyBhcmUgZXhwYW5kZWQgdXNpbmcgdGhlIGNvbnRhaW5lcidzIGVudmlyb25tZW50LlxuICAgKiBJZiB0aGUgcmVmZXJlbmNlZCBlbnZpcm9ubWVudCB2YXJpYWJsZSBkb2Vzbid0IGV4aXN0LCB0aGUgcmVmZXJlbmNlIGluIHRoZSBjb21tYW5kIGlzbid0IGNoYW5nZWQuXG4gICAqIEZvciBleGFtcGxlLCBpZiB0aGUgcmVmZXJlbmNlIGlzIHRvIFwiJChOQU1FMSlcIiBhbmQgdGhlIE5BTUUxIGVudmlyb25tZW50IHZhcmlhYmxlIGRvZXNuJ3QgZXhpc3QsXG4gICAqIHRoZSBjb21tYW5kIHN0cmluZyB3aWxsIHJlbWFpbiBcIiQoTkFNRTEpLlwiICQkIGlzIHJlcGxhY2VkIHdpdGggJCwgYW5kIHRoZSByZXN1bHRpbmcgc3RyaW5nIGlzbid0IGV4cGFuZGVkLlxuICAgKiBvciBleGFtcGxlLCAkJChWQVJfTkFNRSkgaXMgcGFzc2VkIGFzICQoVkFSX05BTUUpIHdoZXRoZXIgb3Igbm90IHRoZSBWQVJfTkFNRSBlbnZpcm9ubWVudCB2YXJpYWJsZSBleGlzdHMuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmRvY2tlci5jb20vZW5naW5lL3JlZmVyZW5jZS9idWlsZGVyLyNjbWRcbiAgICogQHNlZSBodHRwczovL2t1YmVybmV0ZXMuaW8vZG9jcy90YXNrcy9pbmplY3QtZGF0YS1hcHBsaWNhdGlvbi9kZWZpbmUtY29tbWFuZC1hcmd1bWVudC1jb250YWluZXIvXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gYXJnc1xuICAgKi9cbiAgcmVhZG9ubHkgYXJncz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBUaGUgZW50cnlwb2ludCBmb3IgdGhlIGNvbnRhaW5lci4gVGhpcyBpc24ndCBydW4gd2l0aGluIGEgc2hlbGwuXG4gICAqIElmIHRoaXMgaXNuJ3Qgc3BlY2lmaWVkLCB0aGUgYEVOVFJZUE9JTlRgIG9mIHRoZSBjb250YWluZXIgaW1hZ2UgaXMgdXNlZC5cbiAgICogRW52aXJvbm1lbnQgdmFyaWFibGUgcmVmZXJlbmNlcyBhcmUgZXhwYW5kZWQgdXNpbmcgdGhlIGNvbnRhaW5lcidzIGVudmlyb25tZW50LlxuICAgKiBJZiB0aGUgcmVmZXJlbmNlZCBlbnZpcm9ubWVudCB2YXJpYWJsZSBkb2Vzbid0IGV4aXN0LCB0aGUgcmVmZXJlbmNlIGluIHRoZSBjb21tYW5kIGlzbid0IGNoYW5nZWQuXG4gICAqIEZvciBleGFtcGxlLCBpZiB0aGUgcmVmZXJlbmNlIGlzIHRvIGBcIiQoTkFNRTEpXCJgIGFuZCB0aGUgYE5BTUUxYCBlbnZpcm9ubWVudCB2YXJpYWJsZSBkb2Vzbid0IGV4aXN0LFxuICAgKiB0aGUgY29tbWFuZCBzdHJpbmcgd2lsbCByZW1haW4gYFwiJChOQU1FMSkuXCJgIGAkJGAgaXMgcmVwbGFjZWQgd2l0aCBgJGAgYW5kIHRoZSByZXN1bHRpbmcgc3RyaW5nIGlzbid0IGV4cGFuZGVkLlxuICAgKiBGb3IgZXhhbXBsZSwgYCQkKFZBUl9OQU1FKWAgd2lsbCBiZSBwYXNzZWQgYXMgYCQoVkFSX05BTUUpYCB3aGV0aGVyIG9yIG5vdCB0aGUgYFZBUl9OQU1FYCBlbnZpcm9ubWVudCB2YXJpYWJsZSBleGlzdHMuXG5cbiAgICogVGhlIGVudHJ5cG9pbnQgY2FuJ3QgYmUgdXBkYXRlZC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuZG9ja2VyLmNvbS9lbmdpbmUvcmVmZXJlbmNlL2J1aWxkZXIvI2VudHJ5cG9pbnRcbiAgICogQHNlZSBodHRwczovL2t1YmVybmV0ZXMuaW8vZG9jcy90YXNrcy9pbmplY3QtZGF0YS1hcHBsaWNhdGlvbi9kZWZpbmUtY29tbWFuZC1hcmd1bWVudC1jb250YWluZXIvXG4gICAqIEBzZWUgaHR0cHM6Ly9rdWJlcm5ldGVzLmlvL2RvY3MvcmVmZXJlbmNlL2t1YmVybmV0ZXMtYXBpL3dvcmtsb2FkLXJlc291cmNlcy9wb2QtdjEvI2VudHJ5cG9pbnRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBjb21tYW5kXG4gICAqL1xuICByZWFkb25seSBjb21tYW5kPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFRoZSBlbnZpcm9ubWVudCB2YXJpYWJsZXMgdG8gcGFzcyB0byB0aGlzIGNvbnRhaW5lci5cbiAgICpcbiAgICogKk5vdGUqOiBFbnZpcm9ubWVudCB2YXJpYWJsZXMgY2Fubm90IHN0YXJ0IHdpdGggXCJBV1NfQkFUQ0hcIi5cbiAgICogVGhpcyBuYW1pbmcgY29udmVudGlvbiBpcyByZXNlcnZlZCBmb3IgdmFyaWFibGVzIHRoYXQgQVdTIEJhdGNoIHNldHMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gZW52aXJvbm1lbnQgdmFyaWFibGVzXG4gICAqL1xuICByZWFkb25seSBlbnY/OiB7IFtrZXk6c3RyaW5nXTogc3RyaW5nIH07XG5cbiAgLyoqXG4gICAqIFRoZSBpbWFnZSBwdWxsIHBvbGljeSBmb3IgdGhpcyBjb250YWluZXJcbiAgICpcbiAgICogQHNlZSBodHRwczovL2t1YmVybmV0ZXMuaW8vZG9jcy9jb25jZXB0cy9jb250YWluZXJzL2ltYWdlcy8jdXBkYXRpbmctaW1hZ2VzXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gYEFMV0FZU2AgaWYgdGhlIGA6bGF0ZXN0YCB0YWcgaXMgc3BlY2lmaWVkLCBgSUZfTk9UX1BSRVNFTlRgIG90aGVyd2lzZVxuICAgKi9cbiAgcmVhZG9ubHkgaW1hZ2VQdWxsUG9saWN5PzogSW1hZ2VQdWxsUG9saWN5O1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGlzIGNvbnRhaW5lclxuICAgKlxuICAgKiBAZGVmYXVsdDogYCdEZWZhdWx0J2BcbiAgICovXG4gIHJlYWRvbmx5IG5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBhbW91bnQgKGluIE1pQikgb2YgbWVtb3J5IHRvIHByZXNlbnQgdG8gdGhlIGNvbnRhaW5lci5cbiAgICogSWYgeW91ciBjb250YWluZXIgYXR0ZW1wdHMgdG8gZXhjZWVkIHRoZSBhbGxvY2F0ZWQgbWVtb3J5LCBpdCB3aWxsIGJlIHRlcm1pbmF0ZWQuXG4gICAqXG4gICAqIE11c3QgYmUgbGFyZ2VyIHRoYXQgNCBNaUJcbiAgICpcbiAgICogQXQgbGVhc3Qgb25lIG9mIGBtZW1vcnlMaW1pdGAgYW5kIGBtZW1vcnlSZXNlcnZhdGlvbmAgaXMgcmVxdWlyZWRcbiAgICpcbiAgICogKk5vdGUqOiBUbyBtYXhpbWl6ZSB5b3VyIHJlc291cmNlIHV0aWxpemF0aW9uLCBwcm92aWRlIHlvdXIgam9icyB3aXRoIGFzIG11Y2ggbWVtb3J5IGFzIHBvc3NpYmxlXG4gICAqIGZvciB0aGUgc3BlY2lmaWMgaW5zdGFuY2UgdHlwZSB0aGF0IHlvdSBhcmUgdXNpbmcuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9rdWJlcm5ldGVzLmlvL2RvY3MvY29uY2VwdHMvY29uZmlndXJhdGlvbi9tYW5hZ2UtcmVzb3VyY2VzLWNvbnRhaW5lcnMvXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2JhdGNoL2xhdGVzdC91c2VyZ3VpZGUvbWVtb3J5LW1hbmFnZW1lbnQuaHRtbFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIG1lbW9yeSBsaW1pdFxuICAgKi9cbiAgcmVhZG9ubHkgbWVtb3J5TGltaXQ/OiBTaXplO1xuXG4gIC8qKlxuICAgKiBUaGUgc29mdCBsaW1pdCAoaW4gTWlCKSBvZiBtZW1vcnkgdG8gcmVzZXJ2ZSBmb3IgdGhlIGNvbnRhaW5lci5cbiAgICogWW91ciBjb250YWluZXIgd2lsbCBiZSBnaXZlbiBhdCBsZWFzdCB0aGlzIG11Y2ggbWVtb3J5LCBidXQgbWF5IGNvbnN1bWUgbW9yZS5cbiAgICpcbiAgICogTXVzdCBiZSBsYXJnZXIgdGhhdCA0IE1pQlxuICAgKlxuICAgKiBXaGVuIHN5c3RlbSBtZW1vcnkgaXMgdW5kZXIgaGVhdnkgY29udGVudGlvbiwgRG9ja2VyIGF0dGVtcHRzIHRvIGtlZXAgdGhlXG4gICAqIGNvbnRhaW5lciBtZW1vcnkgdG8gdGhpcyBzb2Z0IGxpbWl0LiBIb3dldmVyLCB5b3VyIGNvbnRhaW5lciBjYW4gY29uc3VtZSBtb3JlXG4gICAqIG1lbW9yeSB3aGVuIGl0IG5lZWRzIHRvLCB1cCB0byBlaXRoZXIgdGhlIGhhcmQgbGltaXQgc3BlY2lmaWVkIHdpdGggdGhlIG1lbW9yeVxuICAgKiBwYXJhbWV0ZXIgKGlmIGFwcGxpY2FibGUpLCBvciBhbGwgb2YgdGhlIGF2YWlsYWJsZSBtZW1vcnkgb24gdGhlIGNvbnRhaW5lclxuICAgKiBpbnN0YW5jZSwgd2hpY2hldmVyIGNvbWVzIGZpcnN0LlxuICAgKlxuICAgKiBBdCBsZWFzdCBvbmUgb2YgYG1lbW9yeUxpbWl0YCBhbmQgYG1lbW9yeVJlc2VydmF0aW9uYCBpcyByZXF1aXJlZC5cbiAgICogSWYgYm90aCBhcmUgc3BlY2lmaWVkLCB0aGVuIGBtZW1vcnlMaW1pdGAgbXVzdCBiZSBlcXVhbCB0byBgbWVtb3J5UmVzZXJ2YXRpb25gXG4gICAqXG4gICAqICpOb3RlKjogVG8gbWF4aW1pemUgeW91ciByZXNvdXJjZSB1dGlsaXphdGlvbiwgcHJvdmlkZSB5b3VyIGpvYnMgd2l0aCBhcyBtdWNoIG1lbW9yeSBhcyBwb3NzaWJsZVxuICAgKiBmb3IgdGhlIHNwZWNpZmljIGluc3RhbmNlIHR5cGUgdGhhdCB5b3UgYXJlIHVzaW5nLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8va3ViZXJuZXRlcy5pby9kb2NzL2NvbmNlcHRzL2NvbmZpZ3VyYXRpb24vbWFuYWdlLXJlc291cmNlcy1jb250YWluZXJzL1xuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9iYXRjaC9sYXRlc3QvdXNlcmd1aWRlL21lbW9yeS1tYW5hZ2VtZW50Lmh0bWxcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBtZW1vcnkgcmVzZXJ2ZWRcbiAgICovXG4gIHJlYWRvbmx5IG1lbW9yeVJlc2VydmF0aW9uPzogU2l6ZTtcblxuICAvKipcbiAgICogVGhlIGhhcmQgbGltaXQgb2YgQ1BVcyB0byBwcmVzZW50IHRvIHRoaXMgY29udGFpbmVyLlxuICAgKiBNdXN0IGJlIGFuIGV2ZW4gbXVsdGlwbGUgb2YgMC4yNVxuICAgKlxuICAgKiBJZiB5b3VyIGNvbnRhaW5lciBhdHRlbXB0cyB0byBleGNlZWQgdGhpcyBsaW1pdCwgaXQgd2lsbCBiZSB0ZXJtaW5hdGVkLlxuICAgKlxuICAgKiBBdCBsZWFzdCBvbmUgb2YgYGNwdVJlc2VydmF0aW9uYCBhbmQgYGNwdUxpbWl0YCBpcyByZXF1aXJlZC5cbiAgICogSWYgYm90aCBhcmUgc3BlY2lmaWVkLCB0aGVuIGBjcHVMaW1pdGAgbXVzdCBiZSBhdCBsZWFzdCBhcyBsYXJnZSBhcyBgY3B1UmVzZXJ2YXRpb25gLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8va3ViZXJuZXRlcy5pby9kb2NzL2NvbmNlcHRzL2NvbmZpZ3VyYXRpb24vbWFuYWdlLXJlc291cmNlcy1jb250YWluZXJzL1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIENQVSBsaW1pdFxuICAgKi9cbiAgcmVhZG9ubHkgY3B1TGltaXQ/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBzb2Z0IGxpbWl0IG9mIENQVXMgdG8gcmVzZXJ2ZSBmb3IgdGhlIGNvbnRhaW5lclxuICAgKiBNdXN0IGJlIGFuIGV2ZW4gbXVsdGlwbGUgb2YgMC4yNVxuICAgKlxuICAgKiBUaGUgY29udGFpbmVyIHdpbGwgZ2l2ZW4gYXQgbGVhc3QgdGhpcyBtYW55IENQVXMsIGJ1dCBtYXkgY29uc3VtZSBtb3JlLlxuICAgKlxuICAgKiBBdCBsZWFzdCBvbmUgb2YgYGNwdVJlc2VydmF0aW9uYCBhbmQgYGNwdUxpbWl0YCBpcyByZXF1aXJlZC5cbiAgICogSWYgYm90aCBhcmUgc3BlY2lmaWVkLCB0aGVuIGBjcHVMaW1pdGAgbXVzdCBiZSBhdCBsZWFzdCBhcyBsYXJnZSBhcyBgY3B1UmVzZXJ2YXRpb25gLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8va3ViZXJuZXRlcy5pby9kb2NzL2NvbmNlcHRzL2NvbmZpZ3VyYXRpb24vbWFuYWdlLXJlc291cmNlcy1jb250YWluZXJzL1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIENQVXMgcmVzZXJ2ZWRcbiAgICovXG4gIHJlYWRvbmx5IGNwdVJlc2VydmF0aW9uPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgaGFyZCBsaW1pdCBvZiBHUFVzIHRvIHByZXNlbnQgdG8gdGhpcyBjb250YWluZXIuXG4gICAqXG4gICAqIElmIHlvdXIgY29udGFpbmVyIGF0dGVtcHRzIHRvIGV4Y2VlZCB0aGlzIGxpbWl0LCBpdCB3aWxsIGJlIHRlcm1pbmF0ZWQuXG4gICAqXG4gICAqIElmIGJvdGggYGdwdVJlc2VydmF0aW9uYCBhbmQgYGdwdUxpbWl0YCBhcmUgc3BlY2lmaWVkLCB0aGVuIGBncHVMaW1pdGAgbXVzdCBiZSBlcXVhbCB0byBgZ3B1UmVzZXJ2YXRpb25gLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8va3ViZXJuZXRlcy5pby9kb2NzL2NvbmNlcHRzL2NvbmZpZ3VyYXRpb24vbWFuYWdlLXJlc291cmNlcy1jb250YWluZXJzL1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIEdQVSBsaW1pdFxuICAgKi9cbiAgcmVhZG9ubHkgZ3B1TGltaXQ/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBzb2Z0IGxpbWl0IG9mIENQVXMgdG8gcmVzZXJ2ZSBmb3IgdGhlIGNvbnRhaW5lclxuICAgKiBNdXN0IGJlIGFuIGV2ZW4gbXVsdGlwbGUgb2YgMC4yNVxuICAgKlxuICAgKiBUaGUgY29udGFpbmVyIHdpbGwgZ2l2ZW4gYXQgbGVhc3QgdGhpcyBtYW55IENQVXMsIGJ1dCBtYXkgY29uc3VtZSBtb3JlLlxuICAgKlxuICAgKiBJZiBib3RoIGBncHVSZXNlcnZhdGlvbmAgYW5kIGBncHVMaW1pdGAgYXJlIHNwZWNpZmllZCwgdGhlbiBgZ3B1TGltaXRgIG11c3QgYmUgZXF1YWwgdG8gYGdwdVJlc2VydmF0aW9uYC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2t1YmVybmV0ZXMuaW8vZG9jcy9jb25jZXB0cy9jb25maWd1cmF0aW9uL21hbmFnZS1yZXNvdXJjZXMtY29udGFpbmVycy9cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBHUFVzIHJlc2VydmVkXG4gICAqL1xuICByZWFkb25seSBncHVSZXNlcnZhdGlvbj86IG51bWJlcjtcblxuICAvKipcbiAgICogSWYgc3BlY2lmaWVkLCBnaXZlcyB0aGlzIGNvbnRhaW5lciBlbGV2YXRlZCBwZXJtaXNzaW9ucyBvbiB0aGUgaG9zdCBjb250YWluZXIgaW5zdGFuY2UuXG4gICAqIFRoZSBsZXZlbCBvZiBwZXJtaXNzaW9ucyBhcmUgc2ltaWxhciB0byB0aGUgcm9vdCB1c2VyIHBlcm1pc3Npb25zLlxuICAgKlxuICAgKiBUaGlzIHBhcmFtZXRlciBtYXBzIHRvIGBwcml2aWxlZ2VkYCBwb2xpY3kgaW4gdGhlIFByaXZpbGVnZWQgcG9kIHNlY3VyaXR5IHBvbGljaWVzIGluIHRoZSBLdWJlcm5ldGVzIGRvY3VtZW50YXRpb24uXG4gICAqXG4gICAqICpOb3RlKjogdGhpcyBpcyBvbmx5IGNvbXBhdGlibGUgd2l0aCBLdWJlcm5ldGVzIDwgdjEuMjVcbiAgICpcbiAgICogQHNlZSBodHRwczovL2t1YmVybmV0ZXMuaW8vZG9jcy9jb25jZXB0cy9zZWN1cml0eS9wb2Qtc2VjdXJpdHktcG9saWN5LyN2b2x1bWVzLWFuZC1maWxlLXN5c3RlbXNcbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHByaXZpbGVnZWQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBJZiBzcGVjaWZpZWQsIGdpdmVzIHRoaXMgY29udGFpbmVyIHJlYWRvbmx5IGFjY2VzcyB0byBpdHMgcm9vdCBmaWxlIHN5c3RlbS5cbiAgICpcbiAgICogVGhpcyBwYXJhbWV0ZXIgbWFwcyB0byBgUmVhZE9ubHlSb290RmlsZXN5c3RlbWAgcG9saWN5IGluIHRoZSBWb2x1bWVzIGFuZCBmaWxlIHN5c3RlbXMgcG9kIHNlY3VyaXR5IHBvbGljaWVzIGluIHRoZSBLdWJlcm5ldGVzIGRvY3VtZW50YXRpb24uXG4gICAqXG4gICAqICpOb3RlKjogdGhpcyBpcyBvbmx5IGNvbXBhdGlibGUgd2l0aCBLdWJlcm5ldGVzIDwgdjEuMjVcbiAgICpcbiAgICogQHNlZSBodHRwczovL2t1YmVybmV0ZXMuaW8vZG9jcy9jb25jZXB0cy9zZWN1cml0eS9wb2Qtc2VjdXJpdHktcG9saWN5LyN2b2x1bWVzLWFuZC1maWxlLXN5c3RlbXNcbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHJlYWRvbmx5Um9vdEZpbGVzeXN0ZW0/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBJZiBzcGVjaWZpZWQsIHRoZSBjb250YWluZXIgaXMgcnVuIGFzIHRoZSBzcGVjaWZpZWQgZ3JvdXAgSUQgKGBnaWRgKS5cbiAgICogSWYgdGhpcyBwYXJhbWV0ZXIgaXNuJ3Qgc3BlY2lmaWVkLCB0aGUgZGVmYXVsdCBpcyB0aGUgZ3JvdXAgdGhhdCdzIHNwZWNpZmllZCBpbiB0aGUgaW1hZ2UgbWV0YWRhdGEuXG4gICAqIFRoaXMgcGFyYW1ldGVyIG1hcHMgdG8gYFJ1bkFzR3JvdXBgIGFuZCBgTXVzdFJ1bkFzYCBwb2xpY3kgaW4gdGhlIFVzZXJzIGFuZCBncm91cHMgcG9kIHNlY3VyaXR5IHBvbGljaWVzIGluIHRoZSBLdWJlcm5ldGVzIGRvY3VtZW50YXRpb24uXG4gICAqXG4gICAqICpOb3RlKjogdGhpcyBpcyBvbmx5IGNvbXBhdGlibGUgd2l0aCBLdWJlcm5ldGVzIDwgdjEuMjVcbiAgICpcbiAgICogQHNlZSBodHRwczovL2t1YmVybmV0ZXMuaW8vZG9jcy9jb25jZXB0cy9zZWN1cml0eS9wb2Qtc2VjdXJpdHktcG9saWN5LyN1c2Vycy1hbmQtZ3JvdXBzXG4gICAqXG4gICAqIEBkZWZhdWx0IG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IHJ1bkFzR3JvdXA/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIElmIHNwZWNpZmllZCwgdGhlIGNvbnRhaW5lciBpcyBydW4gYXMgYSB1c2VyIHdpdGggYSBgdWlkYCBvdGhlciB0aGFuIDAuIE90aGVyd2lzZSwgbm8gc3VjaCBydWxlIGlzIGVuZm9yY2VkLlxuICAgKiBUaGlzIHBhcmFtZXRlciBtYXBzIHRvIGBSdW5Bc1VzZXJgIGFuZCBgTXVzdFJ1bkFzTm9uUm9vdGAgcG9saWN5IGluIHRoZSBVc2VycyBhbmQgZ3JvdXBzIHBvZCBzZWN1cml0eSBwb2xpY2llcyBpbiB0aGUgS3ViZXJuZXRlcyBkb2N1bWVudGF0aW9uLlxuICAgKlxuICAgKiAqTm90ZSo6IHRoaXMgaXMgb25seSBjb21wYXRpYmxlIHdpdGggS3ViZXJuZXRlcyA8IHYxLjI1XG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9rdWJlcm5ldGVzLmlvL2RvY3MvY29uY2VwdHMvc2VjdXJpdHkvcG9kLXNlY3VyaXR5LXBvbGljeS8jdXNlcnMtYW5kLWdyb3Vwc1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIHRoZSBjb250YWluZXIgaXMgKm5vdCogcmVxdWlyZWQgdG8gcnVuIGFzIGEgbm9uLXJvb3QgdXNlclxuICAgKi9cbiAgcmVhZG9ubHkgcnVuQXNSb290PzogYm9vbGVhbjtcblxuICAvKipcbiAgICogSWYgc3BlY2lmaWVkLCB0aGlzIGNvbnRhaW5lciBpcyBydW4gYXMgdGhlIHNwZWNpZmllZCB1c2VyIElEIChgdWlkYCkuXG4gICAqIFRoaXMgcGFyYW1ldGVyIG1hcHMgdG8gYFJ1bkFzVXNlcmAgYW5kIGBNdXN0UnVuQXNgIHBvbGljeSBpbiB0aGUgVXNlcnMgYW5kIGdyb3VwcyBwb2Qgc2VjdXJpdHkgcG9saWNpZXMgaW4gdGhlIEt1YmVybmV0ZXMgZG9jdW1lbnRhdGlvbi5cbiAgICpcbiAgICogKk5vdGUqOiB0aGlzIGlzIG9ubHkgY29tcGF0aWJsZSB3aXRoIEt1YmVybmV0ZXMgPCB2MS4yNVxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8va3ViZXJuZXRlcy5pby9kb2NzL2NvbmNlcHRzL3NlY3VyaXR5L3BvZC1zZWN1cml0eS1wb2xpY3kvI3VzZXJzLWFuZC1ncm91cHNcbiAgICpcbiAgICogQGRlZmF1bHQgLSB0aGUgdXNlciB0aGF0IGlzIHNwZWNpZmllZCBpbiB0aGUgaW1hZ2UgbWV0YWRhdGEuXG4gICAqL1xuICByZWFkb25seSBydW5Bc1VzZXI/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBWb2x1bWVzIHRvIG1vdW50IHRvIHRoaXMgY29udGFpbmVyLlxuICAgKiBBdXRvbWF0aWNhbGx5IGFkZGVkIHRvIHRoZSBQb2QuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9rdWJlcm5ldGVzLmlvL2RvY3MvY29uY2VwdHMvc3RvcmFnZS92b2x1bWVzL1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIHZvbHVtZXNcbiAgICovXG4gIHJlYWRvbmx5IHZvbHVtZXM/OiBFa3NWb2x1bWVbXTtcbn1cblxuLyoqXG4gKiBBIGNvbnRhaW5lciB0aGF0IGNhbiBiZSBydW4gd2l0aCBFS1Mgb3JjaGVzdHJhdGlvbiBvbiBFQzIgcmVzb3VyY2VzXG4gKi9cbmV4cG9ydCBjbGFzcyBFa3NDb250YWluZXJEZWZpbml0aW9uIGV4dGVuZHMgQ29uc3RydWN0IGltcGxlbWVudHMgSUVrc0NvbnRhaW5lckRlZmluaXRpb24ge1xuICBwdWJsaWMgcmVhZG9ubHkgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZTtcbiAgcHVibGljIHJlYWRvbmx5IGFyZ3M/OiBzdHJpbmdbXTtcbiAgcHVibGljIHJlYWRvbmx5IGNvbW1hbmQ/OiBzdHJpbmdbXTtcbiAgcHVibGljIHJlYWRvbmx5IGVudj86IHsgW2tleTpzdHJpbmddOiBzdHJpbmcgfTtcbiAgcHVibGljIHJlYWRvbmx5IGltYWdlUHVsbFBvbGljeT86IEltYWdlUHVsbFBvbGljeTtcbiAgcHVibGljIHJlYWRvbmx5IG5hbWU/OiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBtZW1vcnlMaW1pdD86IFNpemU7XG4gIHB1YmxpYyByZWFkb25seSBtZW1vcnlSZXNlcnZhdGlvbj86IFNpemU7XG4gIHB1YmxpYyByZWFkb25seSBjcHVMaW1pdD86IG51bWJlcjtcbiAgcHVibGljIHJlYWRvbmx5IGNwdVJlc2VydmF0aW9uPzogbnVtYmVyO1xuICBwdWJsaWMgcmVhZG9ubHkgZ3B1TGltaXQ/OiBudW1iZXI7XG4gIHB1YmxpYyByZWFkb25seSBncHVSZXNlcnZhdGlvbj86IG51bWJlcjtcbiAgcHVibGljIHJlYWRvbmx5IHByaXZpbGVnZWQ/OiBib29sZWFuO1xuICBwdWJsaWMgcmVhZG9ubHkgcmVhZG9ubHlSb290RmlsZXN5c3RlbT86IGJvb2xlYW47XG4gIHB1YmxpYyByZWFkb25seSBydW5Bc0dyb3VwPzogbnVtYmVyO1xuICBwdWJsaWMgcmVhZG9ubHkgcnVuQXNSb290PzogYm9vbGVhbjtcbiAgcHVibGljIHJlYWRvbmx5IHJ1bkFzVXNlcj86IG51bWJlcjtcbiAgcHVibGljIHJlYWRvbmx5IHZvbHVtZXM6IEVrc1ZvbHVtZVtdO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgaW1hZ2VDb25maWc6IGVjcy5Db250YWluZXJJbWFnZUNvbmZpZztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogRWtzQ29udGFpbmVyRGVmaW5pdGlvblByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIHRoaXMuaW1hZ2UgPSBwcm9wcy5pbWFnZTtcbiAgICB0aGlzLmFyZ3MgPSBwcm9wcy5hcmdzO1xuICAgIHRoaXMuY29tbWFuZCA9IHByb3BzLmNvbW1hbmQ7XG4gICAgdGhpcy5lbnYgPSBwcm9wcy5lbnY7XG4gICAgdGhpcy5pbWFnZVB1bGxQb2xpY3kgPSBwcm9wcy5pbWFnZVB1bGxQb2xpY3k7XG4gICAgdGhpcy5uYW1lID0gcHJvcHMubmFtZTtcbiAgICB0aGlzLm1lbW9yeUxpbWl0ID0gcHJvcHMubWVtb3J5TGltaXQ7XG4gICAgdGhpcy5tZW1vcnlSZXNlcnZhdGlvbiA9IHByb3BzLm1lbW9yeVJlc2VydmF0aW9uO1xuICAgIHRoaXMuY3B1TGltaXQgPSBwcm9wcy5jcHVMaW1pdDtcbiAgICB0aGlzLmNwdVJlc2VydmF0aW9uID0gcHJvcHMuY3B1UmVzZXJ2YXRpb247XG4gICAgdGhpcy5ncHVMaW1pdCA9IHByb3BzLmdwdUxpbWl0O1xuICAgIHRoaXMuZ3B1UmVzZXJ2YXRpb24gPSBwcm9wcy5ncHVSZXNlcnZhdGlvbjtcbiAgICB0aGlzLnByaXZpbGVnZWQgPSBwcm9wcy5wcml2aWxlZ2VkO1xuICAgIHRoaXMucmVhZG9ubHlSb290RmlsZXN5c3RlbSA9IHByb3BzLnJlYWRvbmx5Um9vdEZpbGVzeXN0ZW07XG4gICAgdGhpcy5ydW5Bc0dyb3VwID0gcHJvcHMucnVuQXNHcm91cDtcbiAgICB0aGlzLnJ1bkFzUm9vdCA9IHByb3BzLnJ1bkFzUm9vdDtcbiAgICB0aGlzLnJ1bkFzVXNlciA9IHByb3BzLnJ1bkFzVXNlcjtcbiAgICB0aGlzLnZvbHVtZXMgPSBwcm9wcy52b2x1bWVzID8/IFtdO1xuICAgIHRoaXMuaW1hZ2VDb25maWcgPSBwcm9wcy5pbWFnZS5iaW5kKHRoaXMsIHRoaXMgYXMgYW55KTtcbiAgfVxuXG4gIGFkZFZvbHVtZSh2b2x1bWU6IEVrc1ZvbHVtZSkge1xuICAgIHRoaXMudm9sdW1lcy5wdXNoKHZvbHVtZSk7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgX3JlbmRlckNvbnRhaW5lckRlZmluaXRpb24oKTogQ2ZuSm9iRGVmaW5pdGlvbi5Fa3NDb250YWluZXJQcm9wZXJ0eSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGltYWdlOiB0aGlzLmltYWdlQ29uZmlnLmltYWdlTmFtZSxcbiAgICAgIGNvbW1hbmQ6IHRoaXMuY29tbWFuZCxcbiAgICAgIGFyZ3M6IHRoaXMuYXJncyxcbiAgICAgIGVudjogT2JqZWN0LmtleXModGhpcy5lbnYgPz8ge30pLm1hcCgoa2V5KSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbmFtZToga2V5LFxuICAgICAgICAgIHZhbHVlOiB0aGlzLmVudiFba2V5XSxcbiAgICAgICAgfTtcbiAgICAgIH0pLFxuICAgICAgbmFtZTogdGhpcy5uYW1lLFxuICAgICAgaW1hZ2VQdWxsUG9saWN5OiB0aGlzLmltYWdlUHVsbFBvbGljeSxcbiAgICAgIHJlc291cmNlczoge1xuICAgICAgICBsaW1pdHM6IHtcbiAgICAgICAgICAnY3B1JzogdGhpcy5jcHVMaW1pdCxcbiAgICAgICAgICAnbWVtb3J5JzogdGhpcy5tZW1vcnlMaW1pdCA/IHRoaXMubWVtb3J5TGltaXQudG9NZWJpYnl0ZXMoKSArICdNaScgOiB1bmRlZmluZWQsXG4gICAgICAgICAgJ252aWRpYS5jb20vZ3B1JzogdGhpcy5ncHVMaW1pdCxcbiAgICAgICAgfSxcbiAgICAgICAgcmVxdWVzdHM6IHtcbiAgICAgICAgICAnY3B1JzogdGhpcy5jcHVSZXNlcnZhdGlvbixcbiAgICAgICAgICAnbWVtb3J5JzogdGhpcy5tZW1vcnlSZXNlcnZhdGlvbiA/IHRoaXMubWVtb3J5UmVzZXJ2YXRpb24udG9NZWJpYnl0ZXMoKSArICdNaScgOiB1bmRlZmluZWQsXG4gICAgICAgICAgJ252aWRpYS5jb20vZ3B1JzogdGhpcy5ncHVSZXNlcnZhdGlvbixcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBzZWN1cml0eUNvbnRleHQ6IHtcbiAgICAgICAgcHJpdmlsZWdlZDogdGhpcy5wcml2aWxlZ2VkLFxuICAgICAgICByZWFkT25seVJvb3RGaWxlc3lzdGVtOiB0aGlzLnJlYWRvbmx5Um9vdEZpbGVzeXN0ZW0sXG4gICAgICAgIHJ1bkFzR3JvdXA6IHRoaXMucnVuQXNHcm91cCxcbiAgICAgICAgcnVuQXNOb25Sb290OiAhdGhpcy5ydW5Bc1Jvb3QsXG4gICAgICAgIHJ1bkFzVXNlcjogdGhpcy5ydW5Bc1VzZXIsXG4gICAgICB9LFxuICAgICAgdm9sdW1lTW91bnRzOiBMYXp5LmFueSh7XG4gICAgICAgIHByb2R1Y2U6ICgpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy52b2x1bWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRoaXMudm9sdW1lcy5tYXAoKHZvbHVtZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgbmFtZTogdm9sdW1lLm5hbWUsXG4gICAgICAgICAgICAgIG1vdW50UGF0aDogdm9sdW1lLmNvbnRhaW5lclBhdGgsXG4gICAgICAgICAgICAgIHJlYWRPbmx5OiB2b2x1bWUucmVhZG9ubHksXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfTtcbiAgfTtcbn1cblxuLyoqXG4gKiBPcHRpb25zIHRvIGNvbmZpZ3VyZSBhbiBFa3NWb2x1bWVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFa3NWb2x1bWVPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoaXMgdm9sdW1lLlxuICAgKiBUaGUgbmFtZSBtdXN0IGJlIGEgdmFsaWQgRE5TIHN1YmRvbWFpbiBuYW1lLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8va3ViZXJuZXRlcy5pby9kb2NzL2NvbmNlcHRzL292ZXJ2aWV3L3dvcmtpbmctd2l0aC1vYmplY3RzL25hbWVzLyNkbnMtc3ViZG9tYWluLW5hbWVzXG4gICAqL1xuICByZWFkb25seSBuYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBwYXRoIG9uIHRoZSBjb250YWluZXIgd2hlcmUgdGhlIHZvbHVtZSBpcyBtb3VudGVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHRoZSB2b2x1bWUgaXMgbm90IG1vdW50ZWRcbiAgICovXG4gIHJlYWRvbmx5IG1vdW50UGF0aD86IHN0cmluZztcblxuICAvKipcbiAgICogSWYgc3BlY2lmaWVkLCB0aGUgY29udGFpbmVyIGhhcyByZWFkb25seSBhY2Nlc3MgdG8gdGhlIHZvbHVtZS5cbiAgICogT3RoZXJ3aXNlLCB0aGUgY29udGFpbmVyIGhhcyByZWFkL3dyaXRlIGFjY2Vzcy5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHJlYWRvbmx5PzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBBIFZvbHVtZSB0aGF0IGNhbiBiZSBtb3VudGVkIHRvIGEgY29udGFpbmVyIHN1cHBvcnRlZCBieSBFS1NcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEVrc1ZvbHVtZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgS3ViZXJuZXRlcyBFbXB0eURpciB2b2x1bWVcbiAgICpcbiAgICogQHNlZSBodHRwczovL2t1YmVybmV0ZXMuaW8vZG9jcy9jb25jZXB0cy9zdG9yYWdlL3ZvbHVtZXMvI2VtcHR5ZGlyXG4gICAqL1xuICBzdGF0aWMgZW1wdHlEaXIob3B0aW9uczogRW1wdHlEaXJWb2x1bWVPcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBFbXB0eURpclZvbHVtZShvcHRpb25zKTtcbiAgfVxuICAvKipcbiAgICogQ3JlYXRlcyBhIEt1YmVybmV0ZXMgSG9zdFBhdGggdm9sdW1lXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9rdWJlcm5ldGVzLmlvL2RvY3MvY29uY2VwdHMvc3RvcmFnZS92b2x1bWVzLyNob3N0cGF0aFxuICAgKi9cbiAgc3RhdGljIGhvc3RQYXRoKG9wdGlvbnM6IEhvc3RQYXRoVm9sdW1lT3B0aW9ucykge1xuICAgIHJldHVybiBuZXcgSG9zdFBhdGhWb2x1bWUob3B0aW9ucyk7XG4gIH1cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBLdWJlcm5ldGVzIFNlY3JldCB2b2x1bWVcbiAgICpcbiAgICogQHNlZSBodHRwczovL2t1YmVybmV0ZXMuaW8vZG9jcy9jb25jZXB0cy9zdG9yYWdlL3ZvbHVtZXMvI3NlY3JldFxuICAgKi9cbiAgc3RhdGljIHNlY3JldChvcHRpb25zOiBTZWNyZXRQYXRoVm9sdW1lT3B0aW9ucykge1xuICAgIHJldHVybiBuZXcgU2VjcmV0UGF0aFZvbHVtZShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGlzIHZvbHVtZS5cbiAgICogVGhlIG5hbWUgbXVzdCBiZSBhIHZhbGlkIEROUyBzdWJkb21haW4gbmFtZS5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2t1YmVybmV0ZXMuaW8vZG9jcy9jb25jZXB0cy9vdmVydmlldy93b3JraW5nLXdpdGgtb2JqZWN0cy9uYW1lcy8jZG5zLXN1YmRvbWFpbi1uYW1lc1xuICAgKi9cbiAgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcGF0aCBvbiB0aGUgY29udGFpbmVyIHdoZXJlIHRoZSBjb250YWluZXIgaXMgbW91bnRlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSB0aGUgY29udGFpbmVyIGlzIG5vdCBtb3VudGVkXG4gICAqL1xuICByZWFkb25seSBjb250YWluZXJQYXRoPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJZiBzcGVjaWZpZWQsIHRoZSBjb250YWluZXIgaGFzIHJlYWRvbmx5IGFjY2VzcyB0byB0aGUgdm9sdW1lLlxuICAgKiBPdGhlcndpc2UsIHRoZSBjb250YWluZXIgaGFzIHJlYWQvd3JpdGUgYWNjZXNzLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgcmVhZG9ubHk/OiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IEVrc1ZvbHVtZU9wdGlvbnMpIHtcbiAgICB0aGlzLm5hbWUgPSBvcHRpb25zLm5hbWU7XG4gICAgdGhpcy5jb250YWluZXJQYXRoID0gb3B0aW9ucy5tb3VudFBhdGg7XG4gICAgdGhpcy5yZWFkb25seSA9IG9wdGlvbnMucmVhZG9ubHk7XG4gIH1cbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciBhIEt1YmVybmV0ZXMgRW1wdHlEaXIgdm9sdW1lXG4gKlxuICogQHNlZSBodHRwczovL2t1YmVybmV0ZXMuaW8vZG9jcy9jb25jZXB0cy9zdG9yYWdlL3ZvbHVtZXMvI2VtcHR5ZGlyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRW1wdHlEaXJWb2x1bWVPcHRpb25zIGV4dGVuZHMgRWtzVm9sdW1lT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgc3RvcmFnZSB0eXBlIHRvIHVzZSBmb3IgdGhpcyBWb2x1bWUuXG4gICAqXG4gICAqIEBkZWZhdWx0IGBFbXB0eURpck1lZGl1bVR5cGUuRElTS2BcbiAgICovXG4gIHJlYWRvbmx5IG1lZGl1bT86IEVtcHR5RGlyTWVkaXVtVHlwZTtcblxuICAvKipcbiAgICogVGhlIG1heGltdW0gc2l6ZSBmb3IgdGhpcyBWb2x1bWVcbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBzaXplIGxpbWl0XG4gICAqL1xuICByZWFkb25seSBzaXplTGltaXQ/OiBTaXplXG59XG5cbi8qKlxuICogV2hhdCBtZWRpdW0gdGhlIHZvbHVtZSB3aWxsIGxpdmUgaW5cbiAqL1xuZXhwb3J0IGVudW0gRW1wdHlEaXJNZWRpdW1UeXBlIHtcbiAgLyoqXG4gICAqIFVzZSB0aGUgZGlzayBzdG9yYWdlIG9mIHRoZSBub2RlLlxuICAgKiBJdGVtcyB3cml0dGVuIGhlcmUgd2lsbCBzdXJ2aXZlIG5vZGUgcmVib290cy5cbiAgICovXG4gIERJU0sgPSAnJyxcblxuICAvKipcbiAgICogVXNlIHRoZSBgdG1wZnNgIHZvbHVtZSB0aGF0IGlzIGJhY2tlZCBieSBSQU0gb2YgdGhlIG5vZGUuXG4gICAqIEl0ZW1zIHdyaXR0ZW4gaGVyZSB3aWxsICpub3QqIHN1cnZpdmUgbm9kZSByZWJvb3RzLlxuICAgKi9cbiAgTUVNT1JZID0gJ01lbW9yeScsXG59XG5cbi8qKlxuICogQSBLdWJlcm5ldGVzIEVtcHR5RGlyIHZvbHVtZVxuICpcbiAqIEBzZWUgaHR0cHM6Ly9rdWJlcm5ldGVzLmlvL2RvY3MvY29uY2VwdHMvc3RvcmFnZS92b2x1bWVzLyNlbXB0eWRpclxuICovXG5leHBvcnQgY2xhc3MgRW1wdHlEaXJWb2x1bWUgZXh0ZW5kcyBFa3NWb2x1bWUge1xuICAvKipcbiAgICogUmV0dXJucyBgdHJ1ZWAgaWYgYHhgIGlzIGFuIEVtcHR5RGlyVm9sdW1lLCBgZmFsc2VgIG90aGVyd2lzZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpc0VtcHR5RGlyVm9sdW1lKHg6IGFueSkgOiB4IGlzIEVtcHR5RGlyVm9sdW1lIHtcbiAgICByZXR1cm4geCAhPT0gbnVsbCAmJiB0eXBlb2YoeCkgPT09ICdvYmplY3QnICYmIEVNUFRZX0RJUl9WT0xVTUVfU1lNQk9MIGluIHg7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHN0b3JhZ2UgdHlwZSB0byB1c2UgZm9yIHRoaXMgVm9sdW1lLlxuICAgKlxuICAgKiBAZGVmYXVsdCBgRW1wdHlEaXJNZWRpdW1UeXBlLkRJU0tgXG4gICAqL1xuICByZWFkb25seSBtZWRpdW0/OiBFbXB0eURpck1lZGl1bVR5cGU7XG5cbiAgLyoqXG4gICAqIFRoZSBtYXhpbXVtIHNpemUgZm9yIHRoaXMgVm9sdW1lXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gc2l6ZSBsaW1pdFxuICAgKi9cbiAgcmVhZG9ubHkgc2l6ZUxpbWl0PzogU2l6ZTtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBFbXB0eURpclZvbHVtZU9wdGlvbnMpIHtcbiAgICBzdXBlcihvcHRpb25zKTtcbiAgICB0aGlzLm1lZGl1bSA9IG9wdGlvbnMubWVkaXVtO1xuICAgIHRoaXMuc2l6ZUxpbWl0ID0gb3B0aW9ucy5zaXplTGltaXQ7XG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KEVtcHR5RGlyVm9sdW1lLnByb3RvdHlwZSwgRU1QVFlfRElSX1ZPTFVNRV9TWU1CT0wsIHtcbiAgdmFsdWU6IHRydWUsXG4gIGVudW1lcmFibGU6IGZhbHNlLFxuICB3cml0YWJsZTogZmFsc2UsXG59KTtcblxuLyoqXG4gKiBPcHRpb25zIGZvciBhIGt1YmVybmV0ZXMgSG9zdFBhdGggdm9sdW1lXG4gKlxuICogQHNlZSBodHRwczovL2t1YmVybmV0ZXMuaW8vZG9jcy9jb25jZXB0cy9zdG9yYWdlL3ZvbHVtZXMvI2hvc3RwYXRoXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSG9zdFBhdGhWb2x1bWVPcHRpb25zIGV4dGVuZHMgRWtzVm9sdW1lT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgcGF0aCBvZiB0aGUgZmlsZSBvciBkaXJlY3Rvcnkgb24gdGhlIGhvc3QgdG8gbW91bnQgaW50byBjb250YWluZXJzIG9uIHRoZSBwb2QuXG4gICAqXG4gICAqICpOb3RlKjogSG90aFBhdGggVm9sdW1lcyBwcmVzZW50IG1hbnkgc2VjdXJpdHkgcmlza3MsIGFuZCBzaG91bGQgYmUgYXZvaWRlZCB3aGVuIHBvc3NpYmxlLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8va3ViZXJuZXRlcy5pby9kb2NzL2NvbmNlcHRzL3N0b3JhZ2Uvdm9sdW1lcy8jaG9zdHBhdGhcbiAgICovXG4gIHJlYWRvbmx5IGhvc3RQYXRoOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQSBLdWJlcm5ldGVzIEhvc3RQYXRoIHZvbHVtZVxuICpcbiAqIEBzZWUgaHR0cHM6Ly9rdWJlcm5ldGVzLmlvL2RvY3MvY29uY2VwdHMvc3RvcmFnZS92b2x1bWVzLyNob3N0cGF0aFxuICovXG5leHBvcnQgY2xhc3MgSG9zdFBhdGhWb2x1bWUgZXh0ZW5kcyBFa3NWb2x1bWUge1xuICAvKipcbiAgICogcmV0dXJucyBgdHJ1ZWAgaWYgYHhgIGlzIGEgSG9zdFBhdGhWb2x1bWUsIGBmYWxzZWAgb3RoZXJ3aXNlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGlzSG9zdFBhdGhWb2x1bWUoeDogYW55KSA6IHggaXMgSG9zdFBhdGhWb2x1bWUge1xuICAgIHJldHVybiB4ICE9PSBudWxsICYmIHR5cGVvZih4KSA9PT0gJ29iamVjdCcgJiYgSE9TVF9QQVRIX1ZPTFVNRV9TWU1CT0wgaW4geDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgcGF0aCBvZiB0aGUgZmlsZSBvciBkaXJlY3Rvcnkgb24gdGhlIGhvc3QgdG8gbW91bnQgaW50byBjb250YWluZXJzIG9uIHRoZSBwb2QuXG4gICAqXG4gICAqICpOb3RlKjogSG90aFBhdGggVm9sdW1lcyBwcmVzZW50IG1hbnkgc2VjdXJpdHkgcmlza3MsIGFuZCBzaG91bGQgYmUgYXZvaWRlZCB3aGVuIHBvc3NpYmxlLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8va3ViZXJuZXRlcy5pby9kb2NzL2NvbmNlcHRzL3N0b3JhZ2Uvdm9sdW1lcy8jaG9zdHBhdGhcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBwYXRoOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogSG9zdFBhdGhWb2x1bWVPcHRpb25zKSB7XG4gICAgc3VwZXIob3B0aW9ucyk7XG4gICAgdGhpcy5wYXRoID0gb3B0aW9ucy5ob3N0UGF0aDtcbiAgfVxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoSG9zdFBhdGhWb2x1bWUucHJvdG90eXBlLCBIT1NUX1BBVEhfVk9MVU1FX1NZTUJPTCwge1xuICB2YWx1ZTogdHJ1ZSxcbiAgZW51bWVyYWJsZTogZmFsc2UsXG4gIHdyaXRhYmxlOiBmYWxzZSxcbn0pO1xuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGEgS3ViZXJuZXRlcyBTZWNyZXRQYXRoIFZvbHVtZVxuICpcbiAqIEBzZWUgaHR0cHM6Ly9rdWJlcm5ldGVzLmlvL2RvY3MvY29uY2VwdHMvc3RvcmFnZS92b2x1bWVzLyNzZWNyZXRcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTZWNyZXRQYXRoVm9sdW1lT3B0aW9ucyBleHRlbmRzIEVrc1ZvbHVtZU9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIHNlY3JldC5cbiAgICogTXVzdCBiZSBhIHZhbGlkIEROUyBzdWJkb21haW4gbmFtZS5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2t1YmVybmV0ZXMuaW8vZG9jcy9jb25jZXB0cy9vdmVydmlldy93b3JraW5nLXdpdGgtb2JqZWN0cy9uYW1lcy8jZG5zLXN1YmRvbWFpbi1uYW1lc1xuICAgKi9cbiAgcmVhZG9ubHkgc2VjcmV0TmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgd2hldGhlciB0aGUgc2VjcmV0IG9yIHRoZSBzZWNyZXQncyBrZXlzIG11c3QgYmUgZGVmaW5lZFxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBvcHRpb25hbD86IGJvb2xlYW47XG59XG5cbi8qKlxuICogU3BlY2lmaWVzIHRoZSBjb25maWd1cmF0aW9uIG9mIGEgS3ViZXJuZXRlcyBzZWNyZXQgdm9sdW1lXG4gKlxuICogQHNlZSBodHRwczovL2t1YmVybmV0ZXMuaW8vZG9jcy9jb25jZXB0cy9zdG9yYWdlL3ZvbHVtZXMvI3NlY3JldFxuICovXG5leHBvcnQgY2xhc3MgU2VjcmV0UGF0aFZvbHVtZSBleHRlbmRzIEVrc1ZvbHVtZSB7XG4gIC8qKlxuICAgKiByZXR1cm5zIGB0cnVlYCBpZiBgeGAgaXMgYSBgU2VjcmV0UGF0aFZvbHVtZWAgYW5kIGBmYWxzZWAgb3RoZXJ3aXNlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGlzU2VjcmV0UGF0aFZvbHVtZSh4OiBhbnkpIDogeCBpcyBTZWNyZXRQYXRoVm9sdW1lIHtcbiAgICByZXR1cm4geCAhPT0gbnVsbCAmJiB0eXBlb2YoeCkgPT09ICdvYmplY3QnICYmIFNFQ1JFVF9QQVRIX1ZPTFVNRV9TWU1CT0wgaW4geDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgc2VjcmV0LlxuICAgKiBNdXN0IGJlIGEgdmFsaWQgRE5TIHN1YmRvbWFpbiBuYW1lLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8va3ViZXJuZXRlcy5pby9kb2NzL2NvbmNlcHRzL292ZXJ2aWV3L3dvcmtpbmctd2l0aC1vYmplY3RzL25hbWVzLyNkbnMtc3ViZG9tYWluLW5hbWVzXG4gICAqL1xuICByZWFkb25seSBzZWNyZXROYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyB3aGV0aGVyIHRoZSBzZWNyZXQgb3IgdGhlIHNlY3JldCdzIGtleXMgbXVzdCBiZSBkZWZpbmVkXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IG9wdGlvbmFsPzogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBTZWNyZXRQYXRoVm9sdW1lT3B0aW9ucykge1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIHRoaXMuc2VjcmV0TmFtZSA9IG9wdGlvbnMuc2VjcmV0TmFtZTtcbiAgICB0aGlzLm9wdGlvbmFsID0gb3B0aW9ucy5vcHRpb25hbCA/PyB0cnVlO1xuICB9XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShTZWNyZXRQYXRoVm9sdW1lLnByb3RvdHlwZSwgU0VDUkVUX1BBVEhfVk9MVU1FX1NZTUJPTCwge1xuICB2YWx1ZTogdHJ1ZSxcbiAgZW51bWVyYWJsZTogZmFsc2UsXG4gIHdyaXRhYmxlOiBmYWxzZSxcbn0pO1xuIl19
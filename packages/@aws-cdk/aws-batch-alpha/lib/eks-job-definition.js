"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EksJobDefinition = exports.DnsPolicy = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("aws-cdk-lib/core");
const aws_batch_1 = require("aws-cdk-lib/aws-batch");
const eks_container_definition_1 = require("./eks-container-definition");
const job_definition_base_1 = require("./job-definition-base");
/**
 * The DNS Policy for the pod used by the Job Definition
 *
 * @see https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/#pod-s-dns-policy
 */
var DnsPolicy;
(function (DnsPolicy) {
    /**
     * The Pod inherits the name resolution configuration from the node that the Pods run on
     */
    DnsPolicy["DEFAULT"] = "Default";
    /**
     * Any DNS query that does not match the configured cluster domain suffix, such as `"www.kubernetes.io"`,
     * is forwarded to an upstream nameserver by the DNS server.
     * Cluster administrators may have extra stub-domain and upstream DNS servers configured.
     */
    DnsPolicy["CLUSTER_FIRST"] = "ClusterFirst";
    /**
     * For Pods running with `hostNetwork`, you should explicitly set its DNS policy to `CLUSTER_FIRST_WITH_HOST_NET`.
     * Otherwise, Pods running with `hostNetwork` and `CLUSTER_FIRST` will fallback to the behavior of the `DEFAULT` policy.
     */
    DnsPolicy["CLUSTER_FIRST_WITH_HOST_NET"] = "ClusterFirstWithHostNet";
})(DnsPolicy || (exports.DnsPolicy = DnsPolicy = {}));
/**
 * A JobDefinition that uses Eks orchestration
 *
 * @resource AWS::Batch::JobDefinition
 */
class EksJobDefinition extends job_definition_base_1.JobDefinitionBase {
    /**
     * Import an EksJobDefinition by its arn
     */
    static fromEksJobDefinitionArn(scope, id, eksJobDefinitionArn) {
        const stack = core_1.Stack.of(scope);
        const jobDefinitionName = stack.splitArn(eksJobDefinitionArn, core_1.ArnFormat.SLASH_RESOURCE_NAME).resourceName;
        class Import extends job_definition_base_1.JobDefinitionBase {
            constructor() {
                super(...arguments);
                this.jobDefinitionArn = eksJobDefinitionArn;
                this.jobDefinitionName = jobDefinitionName;
                this.enabled = true;
                this.container = {};
            }
        }
        return new Import(scope, id);
    }
    constructor(scope, id, props) {
        super(scope, id, props);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_batch_alpha_EksJobDefinitionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, EksJobDefinition);
            }
            throw error;
        }
        this.container = props.container;
        this.dnsPolicy = props.dnsPolicy;
        this.useHostNetwork = props.useHostNetwork;
        this.serviceAccount = props.serviceAccount;
        const resource = new aws_batch_1.CfnJobDefinition(this, 'Resource', {
            ...(0, job_definition_base_1.baseJobDefinitionProperties)(this),
            type: 'container',
            jobDefinitionName: props.jobDefinitionName,
            eksProperties: {
                podProperties: {
                    containers: [
                        this.container._renderContainerDefinition(),
                    ],
                    dnsPolicy: this.dnsPolicy,
                    hostNetwork: this.useHostNetwork,
                    serviceAccountName: this.serviceAccount,
                    volumes: core_1.Lazy.any({
                        produce: () => {
                            if (this.container.volumes.length === 0) {
                                return undefined;
                            }
                            return this.container.volumes.map((volume) => {
                                if (eks_container_definition_1.EmptyDirVolume.isEmptyDirVolume(volume)) {
                                    return {
                                        name: volume.name,
                                        emptyDir: {
                                            medium: volume.medium,
                                            sizeLimit: volume.sizeLimit ? volume.sizeLimit.toMebibytes().toString() + 'Mi' : undefined,
                                        },
                                    };
                                }
                                if (eks_container_definition_1.HostPathVolume.isHostPathVolume(volume)) {
                                    return {
                                        name: volume.name,
                                        hostPath: {
                                            path: volume.path,
                                        },
                                    };
                                }
                                if (eks_container_definition_1.SecretPathVolume.isSecretPathVolume(volume)) {
                                    return {
                                        name: volume.name,
                                        secret: {
                                            optional: volume.optional,
                                            secretName: volume.secretName,
                                        },
                                    };
                                }
                                throw new Error('unknown volume type');
                            });
                        },
                    }),
                },
            },
        });
        this.jobDefinitionArn = this.getResourceArnAttribute(resource.ref, {
            service: 'batch',
            resource: 'job-definition',
            resourceName: this.physicalName,
        });
        this.jobDefinitionName = this.getResourceNameAttribute(resource.ref);
    }
}
exports.EksJobDefinition = EksJobDefinition;
_a = JSII_RTTI_SYMBOL_1;
EksJobDefinition[_a] = { fqn: "@aws-cdk/aws-batch-alpha.EksJobDefinition", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWtzLWpvYi1kZWZpbml0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZWtzLWpvYi1kZWZpbml0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDJDQUEwRDtBQUUxRCxxREFBeUQ7QUFDekQseUVBQXNIO0FBQ3RILCtEQUEySDtBQTBGM0g7Ozs7R0FJRztBQUNILElBQVksU0FrQlg7QUFsQkQsV0FBWSxTQUFTO0lBQ25COztPQUVHO0lBQ0gsZ0NBQW1CLENBQUE7SUFFbkI7Ozs7T0FJRztJQUNILDJDQUE4QixDQUFBO0lBRTlCOzs7T0FHRztJQUNILG9FQUF1RCxDQUFBO0FBQ3pELENBQUMsRUFsQlcsU0FBUyx5QkFBVCxTQUFTLFFBa0JwQjtBQUVEOzs7O0dBSUc7QUFDSCxNQUFhLGdCQUFpQixTQUFRLHVDQUFpQjtJQUNyRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxLQUFnQixFQUFFLEVBQVUsRUFBRSxtQkFBMkI7UUFDN0YsTUFBTSxLQUFLLEdBQUcsWUFBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixNQUFNLGlCQUFpQixHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsbUJBQW1CLEVBQUUsZ0JBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFlBQWEsQ0FBQztRQUUzRyxNQUFNLE1BQU8sU0FBUSx1Q0FBaUI7WUFBdEM7O2dCQUNrQixxQkFBZ0IsR0FBRyxtQkFBbUIsQ0FBQztnQkFDdkMsc0JBQWlCLEdBQUcsaUJBQWlCLENBQUM7Z0JBQ3RDLFlBQU8sR0FBRyxJQUFJLENBQUM7Z0JBQ2YsY0FBUyxHQUFHLEVBQVMsQ0FBQztZQUN4QyxDQUFDO1NBQUE7UUFFRCxPQUFPLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztLQUM5QjtJQVVELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBNEI7UUFDcEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFF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RkgsNENBNkZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXJuRm9ybWF0LCBMYXp5LCBTdGFjayB9IGZyb20gJ2F3cy1jZGstbGliL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDZm5Kb2JEZWZpbml0aW9uIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWJhdGNoJztcbmltcG9ydCB7IEVrc0NvbnRhaW5lckRlZmluaXRpb24sIEVtcHR5RGlyVm9sdW1lLCBIb3N0UGF0aFZvbHVtZSwgU2VjcmV0UGF0aFZvbHVtZSB9IGZyb20gJy4vZWtzLWNvbnRhaW5lci1kZWZpbml0aW9uJztcbmltcG9ydCB7IGJhc2VKb2JEZWZpbml0aW9uUHJvcGVydGllcywgSUpvYkRlZmluaXRpb24sIEpvYkRlZmluaXRpb25CYXNlLCBKb2JEZWZpbml0aW9uUHJvcHMgfSBmcm9tICcuL2pvYi1kZWZpbml0aW9uLWJhc2UnO1xuXG4vKipcbiAqIEEgSm9iRGVmaW5pdGlvbiB0aGF0IHVzZXMgRWtzIG9yY2hlc3RyYXRpb25cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJRWtzSm9iRGVmaW5pdGlvbiBleHRlbmRzIElKb2JEZWZpbml0aW9uIHtcbiAgLyoqXG4gICAqIFRoZSBjb250YWluZXIgdGhpcyBKb2IgRGVmaW5pdGlvbiB3aWxsIHJ1blxuICAgKi9cbiAgcmVhZG9ubHkgY29udGFpbmVyOiBFa3NDb250YWluZXJEZWZpbml0aW9uO1xuXG4gIC8qKlxuICAgKiBUaGUgRE5TIFBvbGljeSBvZiB0aGUgcG9kIHVzZWQgYnkgdGhpcyBKb2IgRGVmaW5pdGlvblxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8va3ViZXJuZXRlcy5pby9kb2NzL2NvbmNlcHRzL3NlcnZpY2VzLW5ldHdvcmtpbmcvZG5zLXBvZC1zZXJ2aWNlLyNwb2Qtcy1kbnMtcG9saWN5XG4gICAqXG4gICAqIEBkZWZhdWx0IGBEbnNQb2xpY3kuQ0xVU1RFUl9GSVJTVGBcbiAgICovXG4gIHJlYWRvbmx5IGRuc1BvbGljeT86IERuc1BvbGljeTtcblxuICAvKipcbiAgICogSWYgc3BlY2lmaWVkLCB0aGUgUG9kIHVzZWQgYnkgdGhpcyBKb2IgRGVmaW5pdGlvbiB3aWxsIHVzZSB0aGUgaG9zdCdzIG5ldHdvcmsgSVAgYWRkcmVzcy5cbiAgICogT3RoZXJ3aXNlLCB0aGUgS3ViZXJuZXRlcyBwb2QgbmV0d29ya2luZyBtb2RlbCBpcyBlbmFibGVkLlxuICAgKiBNb3N0IEFXUyBCYXRjaCB3b3JrbG9hZHMgYXJlIGVncmVzcy1vbmx5IGFuZCBkb24ndCByZXF1aXJlIHRoZSBvdmVyaGVhZCBvZiBJUCBhbGxvY2F0aW9uIGZvciBlYWNoIHBvZCBmb3IgaW5jb21pbmcgY29ubmVjdGlvbnMuXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICpcbiAgICogQHNlZSBodHRwczovL2t1YmVybmV0ZXMuaW8vZG9jcy9jb25jZXB0cy9zZWN1cml0eS9wb2Qtc2VjdXJpdHktcG9saWN5LyNob3N0LW5hbWVzcGFjZXNcbiAgICogQHNlZSBodHRwczovL2t1YmVybmV0ZXMuaW8vZG9jcy9jb25jZXB0cy93b3JrbG9hZHMvcG9kcy8jcG9kLW5ldHdvcmtpbmdcbiAgICovXG4gIHJlYWRvbmx5IHVzZUhvc3ROZXR3b3JrPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIHNlcnZpY2UgYWNjb3VudCB0aGF0J3MgdXNlZCB0byBydW4gdGhlIGNvbnRhaW5lci5cbiAgICogc2VydmljZSBhY2NvdW50cyBhcmUgS3ViZXJuZXRlcyBtZXRob2Qgb2YgaWRlbnRpZmljYXRpb24gYW5kIGF1dGhlbnRpY2F0aW9uLFxuICAgKiByb3VnaGx5IGFuYWxvZ291cyB0byBJQU0gdXNlcnMuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Vrcy9sYXRlc3QvdXNlcmd1aWRlL3NlcnZpY2UtYWNjb3VudHMuaHRtbFxuICAgKiBAc2VlIGh0dHBzOi8va3ViZXJuZXRlcy5pby9kb2NzL3Rhc2tzL2NvbmZpZ3VyZS1wb2QtY29udGFpbmVyL2NvbmZpZ3VyZS1zZXJ2aWNlLWFjY291bnQvXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Vrcy9sYXRlc3QvdXNlcmd1aWRlL2Fzc29jaWF0ZS1zZXJ2aWNlLWFjY291bnQtcm9sZS5odG1sXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdGhlIGRlZmF1bHQgc2VydmljZSBhY2NvdW50IG9mIHRoZSBjb250YWluZXJcbiAgICovXG4gIHJlYWRvbmx5IHNlcnZpY2VBY2NvdW50Pzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFByb3BzIGZvciBFa3NKb2JEZWZpbml0aW9uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRWtzSm9iRGVmaW5pdGlvblByb3BzIGV4dGVuZHMgSm9iRGVmaW5pdGlvblByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBjb250YWluZXIgdGhpcyBKb2IgRGVmaW5pdGlvbiB3aWxsIHJ1blxuICAgKi9cbiAgcmVhZG9ubHkgY29udGFpbmVyOiBFa3NDb250YWluZXJEZWZpbml0aW9uO1xuXG4gIC8qKlxuICAgKiBUaGUgRE5TIFBvbGljeSBvZiB0aGUgcG9kIHVzZWQgYnkgdGhpcyBKb2IgRGVmaW5pdGlvblxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8va3ViZXJuZXRlcy5pby9kb2NzL2NvbmNlcHRzL3NlcnZpY2VzLW5ldHdvcmtpbmcvZG5zLXBvZC1zZXJ2aWNlLyNwb2Qtcy1kbnMtcG9saWN5XG4gICAqXG4gICAqIEBkZWZhdWx0IGBEbnNQb2xpY3kuQ0xVU1RFUl9GSVJTVGBcbiAgICovXG4gIHJlYWRvbmx5IGRuc1BvbGljeT86IERuc1BvbGljeTtcblxuICAvKipcbiAgICogSWYgc3BlY2lmaWVkLCB0aGUgUG9kIHVzZWQgYnkgdGhpcyBKb2IgRGVmaW5pdGlvbiB3aWxsIHVzZSB0aGUgaG9zdCdzIG5ldHdvcmsgSVAgYWRkcmVzcy5cbiAgICogT3RoZXJ3aXNlLCB0aGUgS3ViZXJuZXRlcyBwb2QgbmV0d29ya2luZyBtb2RlbCBpcyBlbmFibGVkLlxuICAgKiBNb3N0IEFXUyBCYXRjaCB3b3JrbG9hZHMgYXJlIGVncmVzcy1vbmx5IGFuZCBkb24ndCByZXF1aXJlIHRoZSBvdmVyaGVhZCBvZiBJUCBhbGxvY2F0aW9uIGZvciBlYWNoIHBvZCBmb3IgaW5jb21pbmcgY29ubmVjdGlvbnMuXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICpcbiAgICogQHNlZSBodHRwczovL2t1YmVybmV0ZXMuaW8vZG9jcy9jb25jZXB0cy9zZWN1cml0eS9wb2Qtc2VjdXJpdHktcG9saWN5LyNob3N0LW5hbWVzcGFjZXNcbiAgICogQHNlZSBodHRwczovL2t1YmVybmV0ZXMuaW8vZG9jcy9jb25jZXB0cy93b3JrbG9hZHMvcG9kcy8jcG9kLW5ldHdvcmtpbmdcbiAgICovXG4gIHJlYWRvbmx5IHVzZUhvc3ROZXR3b3JrPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIHNlcnZpY2UgYWNjb3VudCB0aGF0J3MgdXNlZCB0byBydW4gdGhlIGNvbnRhaW5lci5cbiAgICogc2VydmljZSBhY2NvdW50cyBhcmUgS3ViZXJuZXRlcyBtZXRob2Qgb2YgaWRlbnRpZmljYXRpb24gYW5kIGF1dGhlbnRpY2F0aW9uLFxuICAgKiByb3VnaGx5IGFuYWxvZ291cyB0byBJQU0gdXNlcnMuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Vrcy9sYXRlc3QvdXNlcmd1aWRlL3NlcnZpY2UtYWNjb3VudHMuaHRtbFxuICAgKiBAc2VlIGh0dHBzOi8va3ViZXJuZXRlcy5pby9kb2NzL3Rhc2tzL2NvbmZpZ3VyZS1wb2QtY29udGFpbmVyL2NvbmZpZ3VyZS1zZXJ2aWNlLWFjY291bnQvXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Vrcy9sYXRlc3QvdXNlcmd1aWRlL2Fzc29jaWF0ZS1zZXJ2aWNlLWFjY291bnQtcm9sZS5odG1sXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdGhlIGRlZmF1bHQgc2VydmljZSBhY2NvdW50IG9mIHRoZSBjb250YWluZXJcbiAgICovXG4gIHJlYWRvbmx5IHNlcnZpY2VBY2NvdW50Pzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFRoZSBETlMgUG9saWN5IGZvciB0aGUgcG9kIHVzZWQgYnkgdGhlIEpvYiBEZWZpbml0aW9uXG4gKlxuICogQHNlZSBodHRwczovL2t1YmVybmV0ZXMuaW8vZG9jcy9jb25jZXB0cy9zZXJ2aWNlcy1uZXR3b3JraW5nL2Rucy1wb2Qtc2VydmljZS8jcG9kLXMtZG5zLXBvbGljeVxuICovXG5leHBvcnQgZW51bSBEbnNQb2xpY3kge1xuICAvKipcbiAgICogVGhlIFBvZCBpbmhlcml0cyB0aGUgbmFtZSByZXNvbHV0aW9uIGNvbmZpZ3VyYXRpb24gZnJvbSB0aGUgbm9kZSB0aGF0IHRoZSBQb2RzIHJ1biBvblxuICAgKi9cbiAgREVGQVVMVCA9ICdEZWZhdWx0JyxcblxuICAvKipcbiAgICogQW55IEROUyBxdWVyeSB0aGF0IGRvZXMgbm90IG1hdGNoIHRoZSBjb25maWd1cmVkIGNsdXN0ZXIgZG9tYWluIHN1ZmZpeCwgc3VjaCBhcyBgXCJ3d3cua3ViZXJuZXRlcy5pb1wiYCxcbiAgICogaXMgZm9yd2FyZGVkIHRvIGFuIHVwc3RyZWFtIG5hbWVzZXJ2ZXIgYnkgdGhlIEROUyBzZXJ2ZXIuXG4gICAqIENsdXN0ZXIgYWRtaW5pc3RyYXRvcnMgbWF5IGhhdmUgZXh0cmEgc3R1Yi1kb21haW4gYW5kIHVwc3RyZWFtIEROUyBzZXJ2ZXJzIGNvbmZpZ3VyZWQuXG4gICAqL1xuICBDTFVTVEVSX0ZJUlNUID0gJ0NsdXN0ZXJGaXJzdCcsXG5cbiAgLyoqXG4gICAqIEZvciBQb2RzIHJ1bm5pbmcgd2l0aCBgaG9zdE5ldHdvcmtgLCB5b3Ugc2hvdWxkIGV4cGxpY2l0bHkgc2V0IGl0cyBETlMgcG9saWN5IHRvIGBDTFVTVEVSX0ZJUlNUX1dJVEhfSE9TVF9ORVRgLlxuICAgKiBPdGhlcndpc2UsIFBvZHMgcnVubmluZyB3aXRoIGBob3N0TmV0d29ya2AgYW5kIGBDTFVTVEVSX0ZJUlNUYCB3aWxsIGZhbGxiYWNrIHRvIHRoZSBiZWhhdmlvciBvZiB0aGUgYERFRkFVTFRgIHBvbGljeS5cbiAgICovXG4gIENMVVNURVJfRklSU1RfV0lUSF9IT1NUX05FVCA9ICdDbHVzdGVyRmlyc3RXaXRoSG9zdE5ldCcsXG59XG5cbi8qKlxuICogQSBKb2JEZWZpbml0aW9uIHRoYXQgdXNlcyBFa3Mgb3JjaGVzdHJhdGlvblxuICpcbiAqIEByZXNvdXJjZSBBV1M6OkJhdGNoOjpKb2JEZWZpbml0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBFa3NKb2JEZWZpbml0aW9uIGV4dGVuZHMgSm9iRGVmaW5pdGlvbkJhc2UgaW1wbGVtZW50cyBJRWtzSm9iRGVmaW5pdGlvbiB7XG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gRWtzSm9iRGVmaW5pdGlvbiBieSBpdHMgYXJuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Fa3NKb2JEZWZpbml0aW9uQXJuKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGVrc0pvYkRlZmluaXRpb25Bcm46IHN0cmluZyk6IElFa3NKb2JEZWZpbml0aW9uIHtcbiAgICBjb25zdCBzdGFjayA9IFN0YWNrLm9mKHNjb3BlKTtcbiAgICBjb25zdCBqb2JEZWZpbml0aW9uTmFtZSA9IHN0YWNrLnNwbGl0QXJuKGVrc0pvYkRlZmluaXRpb25Bcm4sIEFybkZvcm1hdC5TTEFTSF9SRVNPVVJDRV9OQU1FKS5yZXNvdXJjZU5hbWUhO1xuXG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgSm9iRGVmaW5pdGlvbkJhc2UgaW1wbGVtZW50cyBJSm9iRGVmaW5pdGlvbiB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgam9iRGVmaW5pdGlvbkFybiA9IGVrc0pvYkRlZmluaXRpb25Bcm47XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgam9iRGVmaW5pdGlvbk5hbWUgPSBqb2JEZWZpbml0aW9uTmFtZTtcbiAgICAgIHB1YmxpYyByZWFkb25seSBlbmFibGVkID0gdHJ1ZTtcbiAgICAgIHB1YmxpYyByZWFkb25seSBjb250YWluZXIgPSB7fSBhcyBhbnk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkKTtcbiAgfVxuXG4gIHB1YmxpYyByZWFkb25seSBjb250YWluZXI6IEVrc0NvbnRhaW5lckRlZmluaXRpb247XG4gIHB1YmxpYyByZWFkb25seSBkbnNQb2xpY3k/OiBEbnNQb2xpY3k7XG4gIHB1YmxpYyByZWFkb25seSB1c2VIb3N0TmV0d29yaz86IGJvb2xlYW47XG4gIHB1YmxpYyByZWFkb25seSBzZXJ2aWNlQWNjb3VudD86IHN0cmluZztcblxuICBwdWJsaWMgcmVhZG9ubHkgam9iRGVmaW5pdGlvbkFybjogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgam9iRGVmaW5pdGlvbk5hbWU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogRWtzSm9iRGVmaW5pdGlvblByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICB0aGlzLmNvbnRhaW5lciA9IHByb3BzLmNvbnRhaW5lcjtcbiAgICB0aGlzLmRuc1BvbGljeSA9IHByb3BzLmRuc1BvbGljeTtcbiAgICB0aGlzLnVzZUhvc3ROZXR3b3JrID0gcHJvcHMudXNlSG9zdE5ldHdvcms7XG4gICAgdGhpcy5zZXJ2aWNlQWNjb3VudCA9IHByb3BzLnNlcnZpY2VBY2NvdW50O1xuXG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ2ZuSm9iRGVmaW5pdGlvbih0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICAuLi5iYXNlSm9iRGVmaW5pdGlvblByb3BlcnRpZXModGhpcyksXG4gICAgICB0eXBlOiAnY29udGFpbmVyJyxcbiAgICAgIGpvYkRlZmluaXRpb25OYW1lOiBwcm9wcy5qb2JEZWZpbml0aW9uTmFtZSxcbiAgICAgIGVrc1Byb3BlcnRpZXM6IHtcbiAgICAgICAgcG9kUHJvcGVydGllczoge1xuICAgICAgICAgIGNvbnRhaW5lcnM6IFtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLl9yZW5kZXJDb250YWluZXJEZWZpbml0aW9uKCksXG4gICAgICAgICAgXSxcbiAgICAgICAgICBkbnNQb2xpY3k6IHRoaXMuZG5zUG9saWN5LFxuICAgICAgICAgIGhvc3ROZXR3b3JrOiB0aGlzLnVzZUhvc3ROZXR3b3JrLFxuICAgICAgICAgIHNlcnZpY2VBY2NvdW50TmFtZTogdGhpcy5zZXJ2aWNlQWNjb3VudCxcbiAgICAgICAgICB2b2x1bWVzOiBMYXp5LmFueSh7XG4gICAgICAgICAgICBwcm9kdWNlOiAoKSA9PiB7XG4gICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRhaW5lci52b2x1bWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udGFpbmVyLnZvbHVtZXMubWFwKCh2b2x1bWUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoRW1wdHlEaXJWb2x1bWUuaXNFbXB0eURpclZvbHVtZSh2b2x1bWUpKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiB2b2x1bWUubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgZW1wdHlEaXI6IHtcbiAgICAgICAgICAgICAgICAgICAgICBtZWRpdW06IHZvbHVtZS5tZWRpdW0sXG4gICAgICAgICAgICAgICAgICAgICAgc2l6ZUxpbWl0OiB2b2x1bWUuc2l6ZUxpbWl0ID8gdm9sdW1lLnNpemVMaW1pdC50b01lYmlieXRlcygpLnRvU3RyaW5nKCkgKyAnTWknIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKEhvc3RQYXRoVm9sdW1lLmlzSG9zdFBhdGhWb2x1bWUodm9sdW1lKSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogdm9sdW1lLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGhvc3RQYXRoOiB7XG4gICAgICAgICAgICAgICAgICAgICAgcGF0aDogdm9sdW1lLnBhdGgsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoU2VjcmV0UGF0aFZvbHVtZS5pc1NlY3JldFBhdGhWb2x1bWUodm9sdW1lKSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogdm9sdW1lLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHNlY3JldDoge1xuICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbmFsOiB2b2x1bWUub3B0aW9uYWwsXG4gICAgICAgICAgICAgICAgICAgICAgc2VjcmV0TmFtZTogdm9sdW1lLnNlY3JldE5hbWUsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigndW5rbm93biB2b2x1bWUgdHlwZScpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSksXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHRoaXMuam9iRGVmaW5pdGlvbkFybiA9IHRoaXMuZ2V0UmVzb3VyY2VBcm5BdHRyaWJ1dGUocmVzb3VyY2UucmVmLCB7XG4gICAgICBzZXJ2aWNlOiAnYmF0Y2gnLFxuICAgICAgcmVzb3VyY2U6ICdqb2ItZGVmaW5pdGlvbicsXG4gICAgICByZXNvdXJjZU5hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgIH0pO1xuICAgIHRoaXMuam9iRGVmaW5pdGlvbk5hbWUgPSB0aGlzLmdldFJlc291cmNlTmFtZUF0dHJpYnV0ZShyZXNvdXJjZS5yZWYpO1xuICB9XG59XG4iXX0=
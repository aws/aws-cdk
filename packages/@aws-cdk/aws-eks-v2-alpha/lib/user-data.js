"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifecycleLabel = void 0;
exports.renderAmazonLinuxUserData = renderAmazonLinuxUserData;
exports.renderBottlerocketUserData = renderBottlerocketUserData;
const core_1 = require("aws-cdk-lib/core");
// eslint-disable-next-line max-len
function renderAmazonLinuxUserData(cluster, autoScalingGroup, options = {}) {
    const stack = core_1.Stack.of(autoScalingGroup);
    // determine logical id of ASG so we can signal cloudformation
    const cfn = autoScalingGroup.node.defaultChild;
    const asgLogicalId = cfn.logicalId;
    const extraArgs = new Array();
    try {
        const clusterEndpoint = cluster.clusterEndpoint;
        const clusterCertificateAuthorityData = cluster.clusterCertificateAuthorityData;
        extraArgs.push(`--apiserver-endpoint '${clusterEndpoint}'`);
        extraArgs.push(`--b64-cluster-ca '${clusterCertificateAuthorityData}'`);
    }
    catch (e) {
        /**
         * Errors are ignored here.
         * apiserver-endpoint and b64-cluster-ca arguments are added in #12659 to make nodes join the cluster faster.
         * As these are not necessary arguments, we don't need to pass these arguments when they don't exist.
         *
         * @see https://github.com/aws/aws-cdk/pull/12659
         */
    }
    extraArgs.push(`--use-max-pods ${options.useMaxPods ?? true}`);
    if (options.awsApiRetryAttempts) {
        extraArgs.push(`--aws-api-retry-attempts ${options.awsApiRetryAttempts}`);
    }
    if (options.enableDockerBridge) {
        extraArgs.push('--enable-docker-bridge true');
    }
    if (options.dockerConfigJson) {
        extraArgs.push(`--docker-config-json '${options.dockerConfigJson}'`);
    }
    if (options.dnsClusterIp) {
        extraArgs.push(`--dns-cluster-ip ${options.dnsClusterIp}`);
    }
    if (options.additionalArgs) {
        extraArgs.push(options.additionalArgs);
    }
    const commandLineSuffix = extraArgs.join(' ');
    const kubeletExtraArgsSuffix = options.kubeletExtraArgs || '';
    // determine lifecycle label based on whether the ASG has a spot price.
    const lifecycleLabel = autoScalingGroup.spotPrice ? LifecycleLabel.SPOT : LifecycleLabel.ON_DEMAND;
    const withTaints = autoScalingGroup.spotPrice ? '--register-with-taints=spotInstance=true:PreferNoSchedule' : '';
    const kubeletExtraArgs = `--node-labels lifecycle=${lifecycleLabel} ${withTaints} ${kubeletExtraArgsSuffix}`.trim();
    return [
        'set -o xtrace',
        `/etc/eks/bootstrap.sh ${cluster.clusterName} --kubelet-extra-args "${kubeletExtraArgs}" ${commandLineSuffix}`.trim(),
        `/opt/aws/bin/cfn-signal --exit-code $? --stack ${stack.stackName} --resource ${asgLogicalId} --region ${stack.region}`,
    ];
}
function renderBottlerocketUserData(cluster) {
    return [
        '[settings.kubernetes]',
        `api-server="${cluster.clusterEndpoint}"`,
        `cluster-certificate="${cluster.clusterCertificateAuthorityData}"`,
        `cluster-name="${cluster.clusterName}"`,
    ];
}
/**
 * The lifecycle label for node selector
 */
var LifecycleLabel;
(function (LifecycleLabel) {
    /**
     * on-demand instances
     */
    LifecycleLabel["ON_DEMAND"] = "OnDemand";
    /**
     * spot instances
     */
    LifecycleLabel["SPOT"] = "Ec2Spot";
})(LifecycleLabel || (exports.LifecycleLabel = LifecycleLabel = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1kYXRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlci1kYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUtBLDhEQTREQztBQUVELGdFQU9DO0FBekVELDJDQUF5QztBQUd6QyxtQ0FBbUM7QUFDbkMsU0FBZ0IseUJBQXlCLENBQUMsT0FBaUIsRUFBRSxnQkFBOEMsRUFBRSxVQUE0QixFQUFFO0lBQ3pJLE1BQU0sS0FBSyxHQUFHLFlBQUssQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUV6Qyw4REFBOEQ7SUFDOUQsTUFBTSxHQUFHLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFlBQStDLENBQUM7SUFDbEYsTUFBTSxZQUFZLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQztJQUVuQyxNQUFNLFNBQVMsR0FBRyxJQUFJLEtBQUssRUFBVSxDQUFDO0lBRXRDLElBQUksQ0FBQztRQUNILE1BQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUM7UUFDaEQsTUFBTSwrQkFBK0IsR0FDbkMsT0FBTyxDQUFDLCtCQUErQixDQUFDO1FBQzFDLFNBQVMsQ0FBQyxJQUFJLENBQUMseUJBQXlCLGVBQWUsR0FBRyxDQUFDLENBQUM7UUFDNUQsU0FBUyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsK0JBQStCLEdBQUcsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1FBQ1g7Ozs7OztXQU1HO0lBQ0wsQ0FBQztJQUVELFNBQVMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLE9BQU8sQ0FBQyxVQUFVLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQztJQUUvRCxJQUFJLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQ2hDLFNBQVMsQ0FBQyxJQUFJLENBQUMsNEJBQTRCLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUVELElBQUksT0FBTyxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDL0IsU0FBUyxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRCxJQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQzdCLFNBQVMsQ0FBQyxJQUFJLENBQUMseUJBQXlCLE9BQU8sQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUVELElBQUksT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3pCLFNBQVMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFRCxJQUFJLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUMzQixTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQsTUFBTSxpQkFBaUIsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzlDLE1BQU0sc0JBQXNCLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixJQUFJLEVBQUUsQ0FBQztJQUU5RCx1RUFBdUU7SUFDdkUsTUFBTSxjQUFjLEdBQUcsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDO0lBQ25HLE1BQU0sVUFBVSxHQUFHLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsMkRBQTJELENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNqSCxNQUFNLGdCQUFnQixHQUFHLDJCQUEyQixjQUFjLElBQUksVUFBVSxJQUFJLHNCQUFzQixFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFcEgsT0FBTztRQUNMLGVBQWU7UUFDZix5QkFBeUIsT0FBTyxDQUFDLFdBQVcsMEJBQTBCLGdCQUFnQixLQUFLLGlCQUFpQixFQUFFLENBQUMsSUFBSSxFQUFFO1FBQ3JILGtEQUFrRCxLQUFLLENBQUMsU0FBUyxlQUFlLFlBQVksYUFBYSxLQUFLLENBQUMsTUFBTSxFQUFFO0tBQ3hILENBQUM7QUFDSixDQUFDO0FBRUQsU0FBZ0IsMEJBQTBCLENBQUMsT0FBaUI7SUFDMUQsT0FBTztRQUNMLHVCQUF1QjtRQUN2QixlQUFlLE9BQU8sQ0FBQyxlQUFlLEdBQUc7UUFDekMsd0JBQXdCLE9BQU8sQ0FBQywrQkFBK0IsR0FBRztRQUNsRSxpQkFBaUIsT0FBTyxDQUFDLFdBQVcsR0FBRztLQUN4QyxDQUFDO0FBQ0osQ0FBQztBQUVEOztHQUVHO0FBQ0gsSUFBWSxjQVNYO0FBVEQsV0FBWSxjQUFjO0lBQ3hCOztPQUVHO0lBQ0gsd0NBQXNCLENBQUE7SUFDdEI7O09BRUc7SUFDSCxrQ0FBZ0IsQ0FBQTtBQUNsQixDQUFDLEVBVFcsY0FBYyw4QkFBZCxjQUFjLFFBU3pCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYXV0b3NjYWxpbmcgZnJvbSAnYXdzLWNkay1saWIvYXdzLWF1dG9zY2FsaW5nJztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnYXdzLWNkay1saWIvY29yZSc7XG5pbXBvcnQgeyBCb290c3RyYXBPcHRpb25zLCBJQ2x1c3RlciB9IGZyb20gJy4vY2x1c3Rlcic7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyQW1hem9uTGludXhVc2VyRGF0YShjbHVzdGVyOiBJQ2x1c3RlciwgYXV0b1NjYWxpbmdHcm91cDogYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cCwgb3B0aW9uczogQm9vdHN0cmFwT3B0aW9ucyA9IHt9KTogc3RyaW5nW10ge1xuICBjb25zdCBzdGFjayA9IFN0YWNrLm9mKGF1dG9TY2FsaW5nR3JvdXApO1xuXG4gIC8vIGRldGVybWluZSBsb2dpY2FsIGlkIG9mIEFTRyBzbyB3ZSBjYW4gc2lnbmFsIGNsb3VkZm9ybWF0aW9uXG4gIGNvbnN0IGNmbiA9IGF1dG9TY2FsaW5nR3JvdXAubm9kZS5kZWZhdWx0Q2hpbGQgYXMgYXV0b3NjYWxpbmcuQ2ZuQXV0b1NjYWxpbmdHcm91cDtcbiAgY29uc3QgYXNnTG9naWNhbElkID0gY2ZuLmxvZ2ljYWxJZDtcblxuICBjb25zdCBleHRyYUFyZ3MgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuXG4gIHRyeSB7XG4gICAgY29uc3QgY2x1c3RlckVuZHBvaW50ID0gY2x1c3Rlci5jbHVzdGVyRW5kcG9pbnQ7XG4gICAgY29uc3QgY2x1c3RlckNlcnRpZmljYXRlQXV0aG9yaXR5RGF0YSA9XG4gICAgICBjbHVzdGVyLmNsdXN0ZXJDZXJ0aWZpY2F0ZUF1dGhvcml0eURhdGE7XG4gICAgZXh0cmFBcmdzLnB1c2goYC0tYXBpc2VydmVyLWVuZHBvaW50ICcke2NsdXN0ZXJFbmRwb2ludH0nYCk7XG4gICAgZXh0cmFBcmdzLnB1c2goYC0tYjY0LWNsdXN0ZXItY2EgJyR7Y2x1c3RlckNlcnRpZmljYXRlQXV0aG9yaXR5RGF0YX0nYCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvKipcbiAgICAgKiBFcnJvcnMgYXJlIGlnbm9yZWQgaGVyZS5cbiAgICAgKiBhcGlzZXJ2ZXItZW5kcG9pbnQgYW5kIGI2NC1jbHVzdGVyLWNhIGFyZ3VtZW50cyBhcmUgYWRkZWQgaW4gIzEyNjU5IHRvIG1ha2Ugbm9kZXMgam9pbiB0aGUgY2x1c3RlciBmYXN0ZXIuXG4gICAgICogQXMgdGhlc2UgYXJlIG5vdCBuZWNlc3NhcnkgYXJndW1lbnRzLCB3ZSBkb24ndCBuZWVkIHRvIHBhc3MgdGhlc2UgYXJndW1lbnRzIHdoZW4gdGhleSBkb24ndCBleGlzdC5cbiAgICAgKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3cy9hd3MtY2RrL3B1bGwvMTI2NTlcbiAgICAgKi9cbiAgfVxuXG4gIGV4dHJhQXJncy5wdXNoKGAtLXVzZS1tYXgtcG9kcyAke29wdGlvbnMudXNlTWF4UG9kcyA/PyB0cnVlfWApO1xuXG4gIGlmIChvcHRpb25zLmF3c0FwaVJldHJ5QXR0ZW1wdHMpIHtcbiAgICBleHRyYUFyZ3MucHVzaChgLS1hd3MtYXBpLXJldHJ5LWF0dGVtcHRzICR7b3B0aW9ucy5hd3NBcGlSZXRyeUF0dGVtcHRzfWApO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMuZW5hYmxlRG9ja2VyQnJpZGdlKSB7XG4gICAgZXh0cmFBcmdzLnB1c2goJy0tZW5hYmxlLWRvY2tlci1icmlkZ2UgdHJ1ZScpO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMuZG9ja2VyQ29uZmlnSnNvbikge1xuICAgIGV4dHJhQXJncy5wdXNoKGAtLWRvY2tlci1jb25maWctanNvbiAnJHtvcHRpb25zLmRvY2tlckNvbmZpZ0pzb259J2ApO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMuZG5zQ2x1c3RlcklwKSB7XG4gICAgZXh0cmFBcmdzLnB1c2goYC0tZG5zLWNsdXN0ZXItaXAgJHtvcHRpb25zLmRuc0NsdXN0ZXJJcH1gKTtcbiAgfVxuXG4gIGlmIChvcHRpb25zLmFkZGl0aW9uYWxBcmdzKSB7XG4gICAgZXh0cmFBcmdzLnB1c2gob3B0aW9ucy5hZGRpdGlvbmFsQXJncyk7XG4gIH1cblxuICBjb25zdCBjb21tYW5kTGluZVN1ZmZpeCA9IGV4dHJhQXJncy5qb2luKCcgJyk7XG4gIGNvbnN0IGt1YmVsZXRFeHRyYUFyZ3NTdWZmaXggPSBvcHRpb25zLmt1YmVsZXRFeHRyYUFyZ3MgfHwgJyc7XG5cbiAgLy8gZGV0ZXJtaW5lIGxpZmVjeWNsZSBsYWJlbCBiYXNlZCBvbiB3aGV0aGVyIHRoZSBBU0cgaGFzIGEgc3BvdCBwcmljZS5cbiAgY29uc3QgbGlmZWN5Y2xlTGFiZWwgPSBhdXRvU2NhbGluZ0dyb3VwLnNwb3RQcmljZSA/IExpZmVjeWNsZUxhYmVsLlNQT1QgOiBMaWZlY3ljbGVMYWJlbC5PTl9ERU1BTkQ7XG4gIGNvbnN0IHdpdGhUYWludHMgPSBhdXRvU2NhbGluZ0dyb3VwLnNwb3RQcmljZSA/ICctLXJlZ2lzdGVyLXdpdGgtdGFpbnRzPXNwb3RJbnN0YW5jZT10cnVlOlByZWZlck5vU2NoZWR1bGUnIDogJyc7XG4gIGNvbnN0IGt1YmVsZXRFeHRyYUFyZ3MgPSBgLS1ub2RlLWxhYmVscyBsaWZlY3ljbGU9JHtsaWZlY3ljbGVMYWJlbH0gJHt3aXRoVGFpbnRzfSAke2t1YmVsZXRFeHRyYUFyZ3NTdWZmaXh9YC50cmltKCk7XG5cbiAgcmV0dXJuIFtcbiAgICAnc2V0IC1vIHh0cmFjZScsXG4gICAgYC9ldGMvZWtzL2Jvb3RzdHJhcC5zaCAke2NsdXN0ZXIuY2x1c3Rlck5hbWV9IC0ta3ViZWxldC1leHRyYS1hcmdzIFwiJHtrdWJlbGV0RXh0cmFBcmdzfVwiICR7Y29tbWFuZExpbmVTdWZmaXh9YC50cmltKCksXG4gICAgYC9vcHQvYXdzL2Jpbi9jZm4tc2lnbmFsIC0tZXhpdC1jb2RlICQ/IC0tc3RhY2sgJHtzdGFjay5zdGFja05hbWV9IC0tcmVzb3VyY2UgJHthc2dMb2dpY2FsSWR9IC0tcmVnaW9uICR7c3RhY2sucmVnaW9ufWAsXG4gIF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJCb3R0bGVyb2NrZXRVc2VyRGF0YShjbHVzdGVyOiBJQ2x1c3Rlcik6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIFtcbiAgICAnW3NldHRpbmdzLmt1YmVybmV0ZXNdJyxcbiAgICBgYXBpLXNlcnZlcj1cIiR7Y2x1c3Rlci5jbHVzdGVyRW5kcG9pbnR9XCJgLFxuICAgIGBjbHVzdGVyLWNlcnRpZmljYXRlPVwiJHtjbHVzdGVyLmNsdXN0ZXJDZXJ0aWZpY2F0ZUF1dGhvcml0eURhdGF9XCJgLFxuICAgIGBjbHVzdGVyLW5hbWU9XCIke2NsdXN0ZXIuY2x1c3Rlck5hbWV9XCJgLFxuICBdO1xufVxuXG4vKipcbiAqIFRoZSBsaWZlY3ljbGUgbGFiZWwgZm9yIG5vZGUgc2VsZWN0b3JcbiAqL1xuZXhwb3J0IGVudW0gTGlmZWN5Y2xlTGFiZWwge1xuICAvKipcbiAgICogb24tZGVtYW5kIGluc3RhbmNlc1xuICAgKi9cbiAgT05fREVNQU5EID0gJ09uRGVtYW5kJyxcbiAgLyoqXG4gICAqIHNwb3QgaW5zdGFuY2VzXG4gICAqL1xuICBTUE9UID0gJ0VjMlNwb3QnLFxufVxuIl19
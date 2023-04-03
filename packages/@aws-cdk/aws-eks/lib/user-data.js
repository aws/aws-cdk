"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifecycleLabel = exports.renderBottlerocketUserData = exports.renderAmazonLinuxUserData = void 0;
const core_1 = require("@aws-cdk/core");
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
exports.renderAmazonLinuxUserData = renderAmazonLinuxUserData;
function renderBottlerocketUserData(cluster) {
    return [
        '[settings.kubernetes]',
        `api-server="${cluster.clusterEndpoint}"`,
        `cluster-certificate="${cluster.clusterCertificateAuthorityData}"`,
        `cluster-name="${cluster.clusterName}"`,
    ];
}
exports.renderBottlerocketUserData = renderBottlerocketUserData;
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
})(LifecycleLabel = exports.LifecycleLabel || (exports.LifecycleLabel = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1kYXRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlci1kYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHdDQUFzQztBQUd0QyxtQ0FBbUM7QUFDbkMsU0FBZ0IseUJBQXlCLENBQUMsT0FBaUIsRUFBRSxnQkFBOEMsRUFBRSxVQUE0QixFQUFFO0lBRXpJLE1BQU0sS0FBSyxHQUFHLFlBQUssQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUV6Qyw4REFBOEQ7SUFDOUQsTUFBTSxHQUFHLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFlBQStDLENBQUM7SUFDbEYsTUFBTSxZQUFZLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQztJQUVuQyxNQUFNLFNBQVMsR0FBRyxJQUFJLEtBQUssRUFBVSxDQUFDO0lBRXRDLElBQUk7UUFDRixNQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDO1FBQ2hELE1BQU0sK0JBQStCLEdBQ25DLE9BQU8sQ0FBQywrQkFBK0IsQ0FBQztRQUMxQyxTQUFTLENBQUMsSUFBSSxDQUFDLHlCQUF5QixlQUFlLEdBQUcsQ0FBQyxDQUFDO1FBQzVELFNBQVMsQ0FBQyxJQUFJLENBQUMscUJBQXFCLCtCQUErQixHQUFHLENBQUMsQ0FBQztLQUN6RTtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1Y7Ozs7OztXQU1HO0tBQ0o7SUFFRCxTQUFTLENBQUMsSUFBSSxDQUFDLGtCQUFrQixPQUFPLENBQUMsVUFBVSxJQUFJLElBQUksRUFBRSxDQUFDLENBQUM7SUFFL0QsSUFBSSxPQUFPLENBQUMsbUJBQW1CLEVBQUU7UUFDL0IsU0FBUyxDQUFDLElBQUksQ0FBQyw0QkFBNEIsT0FBTyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQztLQUMzRTtJQUVELElBQUksT0FBTyxDQUFDLGtCQUFrQixFQUFFO1FBQzlCLFNBQVMsQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsQ0FBQztLQUMvQztJQUVELElBQUksT0FBTyxDQUFDLGdCQUFnQixFQUFFO1FBQzVCLFNBQVMsQ0FBQyxJQUFJLENBQUMseUJBQXlCLE9BQU8sQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLENBQUM7S0FDdEU7SUFFRCxJQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQUU7UUFDeEIsU0FBUyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7S0FDNUQ7SUFFRCxJQUFJLE9BQU8sQ0FBQyxjQUFjLEVBQUU7UUFDMUIsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7S0FDeEM7SUFFRCxNQUFNLGlCQUFpQixHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDOUMsTUFBTSxzQkFBc0IsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLElBQUksRUFBRSxDQUFDO0lBRTlELHVFQUF1RTtJQUN2RSxNQUFNLGNBQWMsR0FBRyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUM7SUFDbkcsTUFBTSxVQUFVLEdBQUcsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQywyREFBMkQsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ2pILE1BQU0sZ0JBQWdCLEdBQUcsMkJBQTJCLGNBQWMsSUFBSSxVQUFVLElBQUksc0JBQXNCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUVwSCxPQUFPO1FBQ0wsZUFBZTtRQUNmLHlCQUF5QixPQUFPLENBQUMsV0FBVywwQkFBMEIsZ0JBQWdCLEtBQUssaUJBQWlCLEVBQUUsQ0FBQyxJQUFJLEVBQUU7UUFDckgsa0RBQWtELEtBQUssQ0FBQyxTQUFTLGVBQWUsWUFBWSxhQUFhLEtBQUssQ0FBQyxNQUFNLEVBQUU7S0FDeEgsQ0FBQztBQUNKLENBQUM7QUE3REQsOERBNkRDO0FBRUQsU0FBZ0IsMEJBQTBCLENBQUMsT0FBaUI7SUFDMUQsT0FBTztRQUNMLHVCQUF1QjtRQUN2QixlQUFlLE9BQU8sQ0FBQyxlQUFlLEdBQUc7UUFDekMsd0JBQXdCLE9BQU8sQ0FBQywrQkFBK0IsR0FBRztRQUNsRSxpQkFBaUIsT0FBTyxDQUFDLFdBQVcsR0FBRztLQUN4QyxDQUFDO0FBQ0osQ0FBQztBQVBELGdFQU9DO0FBRUQ7O0dBRUc7QUFDSCxJQUFZLGNBU1g7QUFURCxXQUFZLGNBQWM7SUFDeEI7O09BRUc7SUFDSCx3Q0FBc0IsQ0FBQTtJQUN0Qjs7T0FFRztJQUNILGtDQUFnQixDQUFBO0FBQ2xCLENBQUMsRUFUVyxjQUFjLEdBQWQsc0JBQWMsS0FBZCxzQkFBYyxRQVN6QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGF1dG9zY2FsaW5nIGZyb20gJ0Bhd3MtY2RrL2F3cy1hdXRvc2NhbGluZyc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQm9vdHN0cmFwT3B0aW9ucywgSUNsdXN0ZXIgfSBmcm9tICcuL2NsdXN0ZXInO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckFtYXpvbkxpbnV4VXNlckRhdGEoY2x1c3RlcjogSUNsdXN0ZXIsIGF1dG9TY2FsaW5nR3JvdXA6IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAsIG9wdGlvbnM6IEJvb3RzdHJhcE9wdGlvbnMgPSB7fSk6IHN0cmluZ1tdIHtcblxuICBjb25zdCBzdGFjayA9IFN0YWNrLm9mKGF1dG9TY2FsaW5nR3JvdXApO1xuXG4gIC8vIGRldGVybWluZSBsb2dpY2FsIGlkIG9mIEFTRyBzbyB3ZSBjYW4gc2lnbmFsIGNsb3VkZm9ybWF0aW9uXG4gIGNvbnN0IGNmbiA9IGF1dG9TY2FsaW5nR3JvdXAubm9kZS5kZWZhdWx0Q2hpbGQgYXMgYXV0b3NjYWxpbmcuQ2ZuQXV0b1NjYWxpbmdHcm91cDtcbiAgY29uc3QgYXNnTG9naWNhbElkID0gY2ZuLmxvZ2ljYWxJZDtcblxuICBjb25zdCBleHRyYUFyZ3MgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuXG4gIHRyeSB7XG4gICAgY29uc3QgY2x1c3RlckVuZHBvaW50ID0gY2x1c3Rlci5jbHVzdGVyRW5kcG9pbnQ7XG4gICAgY29uc3QgY2x1c3RlckNlcnRpZmljYXRlQXV0aG9yaXR5RGF0YSA9XG4gICAgICBjbHVzdGVyLmNsdXN0ZXJDZXJ0aWZpY2F0ZUF1dGhvcml0eURhdGE7XG4gICAgZXh0cmFBcmdzLnB1c2goYC0tYXBpc2VydmVyLWVuZHBvaW50ICcke2NsdXN0ZXJFbmRwb2ludH0nYCk7XG4gICAgZXh0cmFBcmdzLnB1c2goYC0tYjY0LWNsdXN0ZXItY2EgJyR7Y2x1c3RlckNlcnRpZmljYXRlQXV0aG9yaXR5RGF0YX0nYCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvKipcbiAgICAgKiBFcnJvcnMgYXJlIGlnbm9yZWQgaGVyZS5cbiAgICAgKiBhcGlzZXJ2ZXItZW5kcG9pbnQgYW5kIGI2NC1jbHVzdGVyLWNhIGFyZ3VtZW50cyBhcmUgYWRkZWQgaW4gIzEyNjU5IHRvIG1ha2Ugbm9kZXMgam9pbiB0aGUgY2x1c3RlciBmYXN0ZXIuXG4gICAgICogQXMgdGhlc2UgYXJlIG5vdCBuZWNlc3NhcnkgYXJndW1lbnRzLCB3ZSBkb24ndCBuZWVkIHRvIHBhc3MgdGhlc2UgYXJndW1lbnRzIHdoZW4gdGhleSBkb24ndCBleGlzdC5cbiAgICAgKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3cy9hd3MtY2RrL3B1bGwvMTI2NTlcbiAgICAgKi9cbiAgfVxuXG4gIGV4dHJhQXJncy5wdXNoKGAtLXVzZS1tYXgtcG9kcyAke29wdGlvbnMudXNlTWF4UG9kcyA/PyB0cnVlfWApO1xuXG4gIGlmIChvcHRpb25zLmF3c0FwaVJldHJ5QXR0ZW1wdHMpIHtcbiAgICBleHRyYUFyZ3MucHVzaChgLS1hd3MtYXBpLXJldHJ5LWF0dGVtcHRzICR7b3B0aW9ucy5hd3NBcGlSZXRyeUF0dGVtcHRzfWApO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMuZW5hYmxlRG9ja2VyQnJpZGdlKSB7XG4gICAgZXh0cmFBcmdzLnB1c2goJy0tZW5hYmxlLWRvY2tlci1icmlkZ2UgdHJ1ZScpO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMuZG9ja2VyQ29uZmlnSnNvbikge1xuICAgIGV4dHJhQXJncy5wdXNoKGAtLWRvY2tlci1jb25maWctanNvbiAnJHtvcHRpb25zLmRvY2tlckNvbmZpZ0pzb259J2ApO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMuZG5zQ2x1c3RlcklwKSB7XG4gICAgZXh0cmFBcmdzLnB1c2goYC0tZG5zLWNsdXN0ZXItaXAgJHtvcHRpb25zLmRuc0NsdXN0ZXJJcH1gKTtcbiAgfVxuXG4gIGlmIChvcHRpb25zLmFkZGl0aW9uYWxBcmdzKSB7XG4gICAgZXh0cmFBcmdzLnB1c2gob3B0aW9ucy5hZGRpdGlvbmFsQXJncyk7XG4gIH1cblxuICBjb25zdCBjb21tYW5kTGluZVN1ZmZpeCA9IGV4dHJhQXJncy5qb2luKCcgJyk7XG4gIGNvbnN0IGt1YmVsZXRFeHRyYUFyZ3NTdWZmaXggPSBvcHRpb25zLmt1YmVsZXRFeHRyYUFyZ3MgfHwgJyc7XG5cbiAgLy8gZGV0ZXJtaW5lIGxpZmVjeWNsZSBsYWJlbCBiYXNlZCBvbiB3aGV0aGVyIHRoZSBBU0cgaGFzIGEgc3BvdCBwcmljZS5cbiAgY29uc3QgbGlmZWN5Y2xlTGFiZWwgPSBhdXRvU2NhbGluZ0dyb3VwLnNwb3RQcmljZSA/IExpZmVjeWNsZUxhYmVsLlNQT1QgOiBMaWZlY3ljbGVMYWJlbC5PTl9ERU1BTkQ7XG4gIGNvbnN0IHdpdGhUYWludHMgPSBhdXRvU2NhbGluZ0dyb3VwLnNwb3RQcmljZSA/ICctLXJlZ2lzdGVyLXdpdGgtdGFpbnRzPXNwb3RJbnN0YW5jZT10cnVlOlByZWZlck5vU2NoZWR1bGUnIDogJyc7XG4gIGNvbnN0IGt1YmVsZXRFeHRyYUFyZ3MgPSBgLS1ub2RlLWxhYmVscyBsaWZlY3ljbGU9JHtsaWZlY3ljbGVMYWJlbH0gJHt3aXRoVGFpbnRzfSAke2t1YmVsZXRFeHRyYUFyZ3NTdWZmaXh9YC50cmltKCk7XG5cbiAgcmV0dXJuIFtcbiAgICAnc2V0IC1vIHh0cmFjZScsXG4gICAgYC9ldGMvZWtzL2Jvb3RzdHJhcC5zaCAke2NsdXN0ZXIuY2x1c3Rlck5hbWV9IC0ta3ViZWxldC1leHRyYS1hcmdzIFwiJHtrdWJlbGV0RXh0cmFBcmdzfVwiICR7Y29tbWFuZExpbmVTdWZmaXh9YC50cmltKCksXG4gICAgYC9vcHQvYXdzL2Jpbi9jZm4tc2lnbmFsIC0tZXhpdC1jb2RlICQ/IC0tc3RhY2sgJHtzdGFjay5zdGFja05hbWV9IC0tcmVzb3VyY2UgJHthc2dMb2dpY2FsSWR9IC0tcmVnaW9uICR7c3RhY2sucmVnaW9ufWAsXG4gIF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJCb3R0bGVyb2NrZXRVc2VyRGF0YShjbHVzdGVyOiBJQ2x1c3Rlcik6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIFtcbiAgICAnW3NldHRpbmdzLmt1YmVybmV0ZXNdJyxcbiAgICBgYXBpLXNlcnZlcj1cIiR7Y2x1c3Rlci5jbHVzdGVyRW5kcG9pbnR9XCJgLFxuICAgIGBjbHVzdGVyLWNlcnRpZmljYXRlPVwiJHtjbHVzdGVyLmNsdXN0ZXJDZXJ0aWZpY2F0ZUF1dGhvcml0eURhdGF9XCJgLFxuICAgIGBjbHVzdGVyLW5hbWU9XCIke2NsdXN0ZXIuY2x1c3Rlck5hbWV9XCJgLFxuICBdO1xufVxuXG4vKipcbiAqIFRoZSBsaWZlY3ljbGUgbGFiZWwgZm9yIG5vZGUgc2VsZWN0b3JcbiAqL1xuZXhwb3J0IGVudW0gTGlmZWN5Y2xlTGFiZWwge1xuICAvKipcbiAgICogb24tZGVtYW5kIGluc3RhbmNlc1xuICAgKi9cbiAgT05fREVNQU5EID0gJ09uRGVtYW5kJyxcbiAgLyoqXG4gICAqIHNwb3QgaW5zdGFuY2VzXG4gICAqL1xuICBTUE9UID0gJ0VjMlNwb3QnXG59XG4iXX0=
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateName = exports.renderAutoRollbackConfiguration = exports.deploymentConfig = exports.renderAlarmConfiguration = exports.arnForDeploymentConfig = exports.nameFromDeploymentGroupArn = exports.arnForApplication = void 0;
const core_1 = require("@aws-cdk/core");
function arnForApplication(stack, applicationName) {
    return stack.formatArn({
        service: 'codedeploy',
        resource: 'application',
        resourceName: applicationName,
        arnFormat: core_1.ArnFormat.COLON_RESOURCE_NAME,
    });
}
exports.arnForApplication = arnForApplication;
function nameFromDeploymentGroupArn(deploymentGroupArn) {
    const components = core_1.Arn.split(deploymentGroupArn, core_1.ArnFormat.COLON_RESOURCE_NAME);
    return core_1.Fn.select(1, core_1.Fn.split('/', components.resourceName ?? ''));
}
exports.nameFromDeploymentGroupArn = nameFromDeploymentGroupArn;
function arnForDeploymentConfig(name, resource) {
    return core_1.Arn.format({
        partition: core_1.Aws.PARTITION,
        account: resource?.env.account ?? core_1.Aws.ACCOUNT_ID,
        region: resource?.env.region ?? core_1.Aws.REGION,
        service: 'codedeploy',
        resource: 'deploymentconfig',
        resourceName: name,
        arnFormat: core_1.ArnFormat.COLON_RESOURCE_NAME,
    });
}
exports.arnForDeploymentConfig = arnForDeploymentConfig;
function renderAlarmConfiguration(alarms, ignorePollAlarmFailure, removeAlarms = true) {
    if (removeAlarms) {
        return {
            alarms: alarms.length > 0 ? alarms.map(a => ({ name: a.alarmName })) : undefined,
            enabled: alarms.length > 0,
            ignorePollAlarmFailure,
        };
    }
    return alarms.length === 0
        ? undefined
        : {
            alarms: alarms.map(a => ({ name: a.alarmName })),
            enabled: true,
            ignorePollAlarmFailure,
        };
}
exports.renderAlarmConfiguration = renderAlarmConfiguration;
function deploymentConfig(name) {
    return {
        deploymentConfigName: name,
        deploymentConfigArn: arnForDeploymentConfig(name),
        bindEnvironment: (resource) => ({
            deploymentConfigName: name,
            deploymentConfigArn: arnForDeploymentConfig(name, resource),
        }),
    };
}
exports.deploymentConfig = deploymentConfig;
var AutoRollbackEvent;
(function (AutoRollbackEvent) {
    AutoRollbackEvent["DEPLOYMENT_FAILURE"] = "DEPLOYMENT_FAILURE";
    AutoRollbackEvent["DEPLOYMENT_STOP_ON_ALARM"] = "DEPLOYMENT_STOP_ON_ALARM";
    AutoRollbackEvent["DEPLOYMENT_STOP_ON_REQUEST"] = "DEPLOYMENT_STOP_ON_REQUEST";
})(AutoRollbackEvent || (AutoRollbackEvent = {}));
function renderAutoRollbackConfiguration(alarms, autoRollbackConfig = {}) {
    const events = new Array();
    // we roll back failed deployments by default
    if (autoRollbackConfig.failedDeployment !== false) {
        events.push(AutoRollbackEvent.DEPLOYMENT_FAILURE);
    }
    // we _do not_ roll back stopped deployments by default
    if (autoRollbackConfig.stoppedDeployment === true) {
        events.push(AutoRollbackEvent.DEPLOYMENT_STOP_ON_REQUEST);
    }
    // we _do not_ roll back alarm-triggering deployments by default
    // unless the Deployment Group has at least one alarm
    if (autoRollbackConfig.deploymentInAlarm !== false) {
        if (alarms.length > 0) {
            events.push(AutoRollbackEvent.DEPLOYMENT_STOP_ON_ALARM);
        }
        else if (autoRollbackConfig.deploymentInAlarm === true) {
            throw new Error("The auto-rollback setting 'deploymentInAlarm' does not have any effect unless you associate " +
                'at least one CloudWatch alarm with the Deployment Group');
        }
    }
    if (autoRollbackConfig.failedDeployment === false
        && autoRollbackConfig.stoppedDeployment !== true
        && autoRollbackConfig.deploymentInAlarm === false) {
        return {
            enabled: false,
        };
    }
    return events.length > 0
        ? {
            enabled: true,
            events,
        }
        : undefined;
}
exports.renderAutoRollbackConfiguration = renderAutoRollbackConfiguration;
function validateName(type, name) {
    const ret = [];
    if (!core_1.Token.isUnresolved(name) && name !== undefined) {
        if (name.length > 100) {
            ret.push(`${type} name: "${name}" can be a max of 100 characters.`);
        }
        if (!/^[a-z0-9._+=,@-]+$/i.test(name)) {
            ret.push(`${type} name: "${name}" can only contain letters (a-z, A-Z), numbers (0-9), periods (.), underscores (_), + (plus signs), = (equals signs), , (commas), @ (at signs), - (minus signs).`);
        }
    }
    return ret;
}
exports.validateName = validateName;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx3Q0FBaUY7QUFNakYsU0FBZ0IsaUJBQWlCLENBQUMsS0FBWSxFQUFFLGVBQXVCO0lBQ3JFLE9BQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQztRQUNyQixPQUFPLEVBQUUsWUFBWTtRQUNyQixRQUFRLEVBQUUsYUFBYTtRQUN2QixZQUFZLEVBQUUsZUFBZTtRQUM3QixTQUFTLEVBQUUsZ0JBQVMsQ0FBQyxtQkFBbUI7S0FDekMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQVBELDhDQU9DO0FBRUQsU0FBZ0IsMEJBQTBCLENBQUMsa0JBQTBCO0lBQ25FLE1BQU0sVUFBVSxHQUFHLFVBQUcsQ0FBQyxLQUFLLENBQUMsa0JBQWtCLEVBQUUsZ0JBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ2hGLE9BQU8sU0FBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsU0FBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLFlBQVksSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3BFLENBQUM7QUFIRCxnRUFHQztBQUVELFNBQWdCLHNCQUFzQixDQUFDLElBQVksRUFBRSxRQUFvQjtJQUN2RSxPQUFPLFVBQUcsQ0FBQyxNQUFNLENBQUM7UUFDaEIsU0FBUyxFQUFFLFVBQUcsQ0FBQyxTQUFTO1FBQ3hCLE9BQU8sRUFBRSxRQUFRLEVBQUUsR0FBRyxDQUFDLE9BQU8sSUFBSSxVQUFHLENBQUMsVUFBVTtRQUNoRCxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsQ0FBQyxNQUFNLElBQUksVUFBRyxDQUFDLE1BQU07UUFDMUMsT0FBTyxFQUFFLFlBQVk7UUFDckIsUUFBUSxFQUFFLGtCQUFrQjtRQUM1QixZQUFZLEVBQUUsSUFBSTtRQUNsQixTQUFTLEVBQUUsZ0JBQVMsQ0FBQyxtQkFBbUI7S0FDekMsQ0FBQyxDQUFDO0FBQ0ws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QSxPQUFPLEVBQUUsSUFBSTtZQUNiLE1BQU07U0FDUDtRQUNELENBQUMsQ0FBQyxTQUFTLENBQUM7QUFDaEIsQ0FBQztBQXhDRCwwRUF3Q0M7QUFFRCxTQUFnQixZQUFZLENBQUMsSUFBOEQsRUFBRSxJQUFZO0lBQ3ZHLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUVmLElBQUksQ0FBQyxZQUFLLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksS0FBSyxTQUFTLEVBQUU7UUFDbkQsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRTtZQUNyQixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxXQUFXLElBQUksbUNBQW1DLENBQUMsQ0FBQztTQUNyRTtRQUNELElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDckMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksV0FBVyxJQUFJLGtLQUFrSyxDQUFDLENBQUM7U0FDcE07S0FDRjtJQUVELE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQWJELG9DQWFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2xvdWR3YXRjaCBmcm9tICdAYXdzLWNkay9hd3MtY2xvdWR3YXRjaCc7XG5pbXBvcnQgeyBUb2tlbiwgU3RhY2ssIEFybkZvcm1hdCwgQXJuLCBGbiwgQXdzLCBJUmVzb3VyY2UgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IElQcmVkZWZpbmVkRGVwbG95bWVudENvbmZpZyB9IGZyb20gJy4vcHJlZGVmaW5lZC1kZXBsb3ltZW50LWNvbmZpZyc7XG5pbXBvcnQgeyBJQmFzZURlcGxveW1lbnRDb25maWcgfSBmcm9tICcuLi9iYXNlLWRlcGxveW1lbnQtY29uZmlnJztcbmltcG9ydCB7IENmbkRlcGxveW1lbnRHcm91cCB9IGZyb20gJy4uL2NvZGVkZXBsb3kuZ2VuZXJhdGVkJztcbmltcG9ydCB7IEF1dG9Sb2xsYmFja0NvbmZpZyB9IGZyb20gJy4uL3JvbGxiYWNrLWNvbmZpZyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhcm5Gb3JBcHBsaWNhdGlvbihzdGFjazogU3RhY2ssIGFwcGxpY2F0aW9uTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHN0YWNrLmZvcm1hdEFybih7XG4gICAgc2VydmljZTogJ2NvZGVkZXBsb3knLFxuICAgIHJlc291cmNlOiAnYXBwbGljYXRpb24nLFxuICAgIHJlc291cmNlTmFtZTogYXBwbGljYXRpb25OYW1lLFxuICAgIGFybkZvcm1hdDogQXJuRm9ybWF0LkNPTE9OX1JFU09VUkNFX05BTUUsXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbmFtZUZyb21EZXBsb3ltZW50R3JvdXBBcm4oZGVwbG95bWVudEdyb3VwQXJuOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBjb21wb25lbnRzID0gQXJuLnNwbGl0KGRlcGxveW1lbnRHcm91cEFybiwgQXJuRm9ybWF0LkNPTE9OX1JFU09VUkNFX05BTUUpO1xuICByZXR1cm4gRm4uc2VsZWN0KDEsIEZuLnNwbGl0KCcvJywgY29tcG9uZW50cy5yZXNvdXJjZU5hbWUgPz8gJycpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFybkZvckRlcGxveW1lbnRDb25maWcobmFtZTogc3RyaW5nLCByZXNvdXJjZT86IElSZXNvdXJjZSk6IHN0cmluZyB7XG4gIHJldHVybiBBcm4uZm9ybWF0KHtcbiAgICBwYXJ0aXRpb246IEF3cy5QQVJUSVRJT04sXG4gICAgYWNjb3VudDogcmVzb3VyY2U/LmVudi5hY2NvdW50ID8/IEF3cy5BQ0NPVU5UX0lELFxuICAgIHJlZ2lvbjogcmVzb3VyY2U/LmVudi5yZWdpb24gPz8gQXdzLlJFR0lPTixcbiAgICBzZXJ2aWNlOiAnY29kZWRlcGxveScsXG4gICAgcmVzb3VyY2U6ICdkZXBsb3ltZW50Y29uZmlnJyxcbiAgICByZXNvdXJjZU5hbWU6IG5hbWUsXG4gICAgYXJuRm9ybWF0OiBBcm5Gb3JtYXQuQ09MT05fUkVTT1VSQ0VfTkFNRSxcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJBbGFybUNvbmZpZ3VyYXRpb24oYWxhcm1zOiBjbG91ZHdhdGNoLklBbGFybVtdLCBpZ25vcmVQb2xsQWxhcm1GYWlsdXJlOiBib29sZWFuIHwgdW5kZWZpbmVkLCByZW1vdmVBbGFybXMgPSB0cnVlKTpcbkNmbkRlcGxveW1lbnRHcm91cC5BbGFybUNvbmZpZ3VyYXRpb25Qcm9wZXJ0eSB8IHVuZGVmaW5lZCB7XG4gIGlmIChyZW1vdmVBbGFybXMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWxhcm1zOiBhbGFybXMubGVuZ3RoID4gMCA/IGFsYXJtcy5tYXAoYSA9PiAoeyBuYW1lOiBhLmFsYXJtTmFtZSB9KSkgOiB1bmRlZmluZWQsXG4gICAgICBlbmFibGVkOiBhbGFybXMubGVuZ3RoID4gMCxcbiAgICAgIGlnbm9yZVBvbGxBbGFybUZhaWx1cmUsXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBhbGFybXMubGVuZ3RoID09PSAwXG4gICAgPyB1bmRlZmluZWRcbiAgICA6IHtcbiAgICAgIGFsYXJtczogYWxhcm1zLm1hcChhID0+ICh7IG5hbWU6IGEuYWxhcm1OYW1lIH0pKSxcbiAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICBpZ25vcmVQb2xsQWxhcm1GYWlsdXJlLFxuICAgIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXBsb3ltZW50Q29uZmlnKG5hbWU6IHN0cmluZyk6IElCYXNlRGVwbG95bWVudENvbmZpZyAmIElQcmVkZWZpbmVkRGVwbG95bWVudENvbmZpZyB7XG4gIHJldHVybiB7XG4gICAgZGVwbG95bWVudENvbmZpZ05hbWU6IG5hbWUsXG4gICAgZGVwbG95bWVudENvbmZpZ0FybjogYXJuRm9yRGVwbG95bWVudENvbmZpZyhuYW1lKSxcbiAgICBiaW5kRW52aXJvbm1lbnQ6IChyZXNvdXJjZSkgPT4gKHtcbiAgICAgIGRlcGxveW1lbnRDb25maWdOYW1lOiBuYW1lLFxuICAgICAgZGVwbG95bWVudENvbmZpZ0FybjogYXJuRm9yRGVwbG95bWVudENvbmZpZyhuYW1lLCByZXNvdXJjZSksXG4gICAgfSksXG4gIH07XG59XG5cbmVudW0gQXV0b1JvbGxiYWNrRXZlbnQge1xuICBERVBMT1lNRU5UX0ZBSUxVUkUgPSAnREVQTE9ZTUVOVF9GQUlMVVJFJyxcbiAgREVQTE9ZTUVOVF9TVE9QX09OX0FMQVJNID0gJ0RFUExPWU1FTlRfU1RPUF9PTl9BTEFSTScsXG4gIERFUExPWU1FTlRfU1RPUF9PTl9SRVFVRVNUID0gJ0RFUExPWU1FTlRfU1RPUF9PTl9SRVFVRVNUJ1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyQXV0b1JvbGxiYWNrQ29uZmlndXJhdGlvbihhbGFybXM6IGNsb3Vkd2F0Y2guSUFsYXJtW10sIGF1dG9Sb2xsYmFja0NvbmZpZzogQXV0b1JvbGxiYWNrQ29uZmlnID0ge30pOlxuQ2ZuRGVwbG95bWVudEdyb3VwLkF1dG9Sb2xsYmFja0NvbmZpZ3VyYXRpb25Qcm9wZXJ0eSB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IGV2ZW50cyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG5cbiAgLy8gd2Ugcm9sbCBiYWNrIGZhaWxlZCBkZXBsb3ltZW50cyBieSBkZWZhdWx0XG4gIGlmIChhdXRvUm9sbGJhY2tDb25maWcuZmFpbGVkRGVwbG95bWVudCAhPT0gZmFsc2UpIHtcbiAgICBldmVudHMucHVzaChBdXRvUm9sbGJhY2tFdmVudC5ERVBMT1lNRU5UX0ZBSUxVUkUpO1xuICB9XG5cbiAgLy8gd2UgX2RvIG5vdF8gcm9sbCBiYWNrIHN0b3BwZWQgZGVwbG95bWVudHMgYnkgZGVmYXVsdFxuICBpZiAoYXV0b1JvbGxiYWNrQ29uZmlnLnN0b3BwZWREZXBsb3ltZW50ID09PSB0cnVlKSB7XG4gICAgZXZlbnRzLnB1c2goQXV0b1JvbGxiYWNrRXZlbnQuREVQTE9ZTUVOVF9TVE9QX09OX1JFUVVFU1QpO1xuICB9XG5cbiAgLy8gd2UgX2RvIG5vdF8gcm9sbCBiYWNrIGFsYXJtLXRyaWdnZXJpbmcgZGVwbG95bWVudHMgYnkgZGVmYXVsdFxuICAvLyB1bmxlc3MgdGhlIERlcGxveW1lbnQgR3JvdXAgaGFzIGF0IGxlYXN0IG9uZSBhbGFybVxuICBpZiAoYXV0b1JvbGxiYWNrQ29uZmlnLmRlcGxveW1lbnRJbkFsYXJtICE9PSBmYWxzZSkge1xuICAgIGlmIChhbGFybXMubGVuZ3RoID4gMCkge1xuICAgICAgZXZlbnRzLnB1c2goQXV0b1JvbGxiYWNrRXZlbnQuREVQTE9ZTUVOVF9TVE9QX09OX0FMQVJNKTtcbiAgICB9IGVsc2UgaWYgKGF1dG9Sb2xsYmFja0NvbmZpZy5kZXBsb3ltZW50SW5BbGFybSA9PT0gdHJ1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBcIlRoZSBhdXRvLXJvbGxiYWNrIHNldHRpbmcgJ2RlcGxveW1lbnRJbkFsYXJtJyBkb2VzIG5vdCBoYXZlIGFueSBlZmZlY3QgdW5sZXNzIHlvdSBhc3NvY2lhdGUgXCIgK1xuICAgICAgICAnYXQgbGVhc3Qgb25lIENsb3VkV2F0Y2ggYWxhcm0gd2l0aCB0aGUgRGVwbG95bWVudCBHcm91cCcpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChhdXRvUm9sbGJhY2tDb25maWcuZmFpbGVkRGVwbG95bWVudCA9PT0gZmFsc2VcbiAgICAmJiBhdXRvUm9sbGJhY2tDb25maWcuc3RvcHBlZERlcGxveW1lbnQgIT09IHRydWVcbiAgICAmJiBhdXRvUm9sbGJhY2tDb25maWcuZGVwbG95bWVudEluQWxhcm0gPT09IGZhbHNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgIH07XG4gIH1cblxuICByZXR1cm4gZXZlbnRzLmxlbmd0aCA+IDBcbiAgICA/IHtcbiAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICBldmVudHMsXG4gICAgfVxuICAgIDogdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVOYW1lKHR5cGU6ICdBcHBsaWNhdGlvbicgfCAnRGVwbG95bWVudCBncm91cCcgfCAnRGVwbG95bWVudCBjb25maWcnLCBuYW1lOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gIGNvbnN0IHJldCA9IFtdO1xuXG4gIGlmICghVG9rZW4uaXNVbnJlc29sdmVkKG5hbWUpICYmIG5hbWUgIT09IHVuZGVmaW5lZCkge1xuICAgIGlmIChuYW1lLmxlbmd0aCA+IDEwMCkge1xuICAgICAgcmV0LnB1c2goYCR7dHlwZX0gbmFtZTogXCIke25hbWV9XCIgY2FuIGJlIGEgbWF4IG9mIDEwMCBjaGFyYWN0ZXJzLmApO1xuICAgIH1cbiAgICBpZiAoIS9eW2EtejAtOS5fKz0sQC1dKyQvaS50ZXN0KG5hbWUpKSB7XG4gICAgICByZXQucHVzaChgJHt0eXBlfSBuYW1lOiBcIiR7bmFtZX1cIiBjYW4gb25seSBjb250YWluIGxldHRlcnMgKGEteiwgQS1aKSwgbnVtYmVycyAoMC05KSwgcGVyaW9kcyAoLiksIHVuZGVyc2NvcmVzIChfKSwgKyAocGx1cyBzaWducyksID0gKGVxdWFscyBzaWducyksICwgKGNvbW1hcyksIEAgKGF0IHNpZ25zKSwgLSAobWludXMgc2lnbnMpLmApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXQ7XG59XG4iXX0=
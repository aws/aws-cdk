"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCertificateRegion = exports.isDnsValidatedCertificate = exports.apexDomain = void 0;
const core_1 = require("@aws-cdk/core");
const public_suffixes_1 = require("./public-suffixes");
/**
 * Returns the apex domain (domain.com) from a subdomain (www.sub.domain.com)
 */
function apexDomain(domainName) {
    const parts = domainName.split('.').reverse();
    let curr = public_suffixes_1.publicSuffixes;
    const accumulated = [];
    for (const part of parts) {
        accumulated.push(part);
        if (!(part in curr)) {
            break;
        }
        curr = curr[part];
    }
    return accumulated.reverse().join('.');
}
exports.apexDomain = apexDomain;
function isDnsValidatedCertificate(cert) {
    return cert.hasOwnProperty('domainName');
}
exports.isDnsValidatedCertificate = isDnsValidatedCertificate;
function getCertificateRegion(cert) {
    const { certificateArn, stack } = cert;
    if (isDnsValidatedCertificate(cert)) {
        const requestResource = cert.node.findChild('CertificateRequestorResource').node.defaultChild;
        // @ts-ignore
        const { _cfnProperties: properties } = requestResource;
        const { Region: region } = properties;
        if (region && !core_1.Token.isUnresolved(region)) {
            return region;
        }
    }
    {
        const { region } = core_1.Arn.split(certificateArn, core_1.ArnFormat.SLASH_RESOURCE_NAME);
        if (region && !core_1.Token.isUnresolved(region)) {
            return region;
        }
    }
    return core_1.Stack.of(stack).region;
}
exports.getCertificateRegion = getCertificateRegion;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsd0NBQTZEO0FBRzdELHVEQUFtRDtBQUVuRDs7R0FFRztBQUNILFNBQWdCLFVBQVUsQ0FBQyxVQUFrQjtJQUMzQyxNQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBRTlDLElBQUksSUFBSSxHQUFRLGdDQUFjLENBQUM7SUFFL0IsTUFBTSxXQUFXLEdBQWEsRUFBRSxDQUFDO0lBQ2pDLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxFQUFFO1FBQ3hCLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxFQUFFO1lBQUUsTUFBTTtTQUFFO1FBQy9CLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDbkI7SUFDRCxPQUFPLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekMsQ0FBQztBQVpELGdDQVlDO0FBRUQsU0FBZ0IseUJBQXlCLENBQUMsSUFBa0I7SUFDMUQsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzNDLENBQUM7QUFGRCw4REFFQztBQUVELFNBQWdCLG9CQUFvQixDQUFDLElBQWtCO0lBQ3JELE1BQU0sRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLEdBQUcsSUFBSSxDQUFDO0lBRXZDLElBQUkseUJBQXlCLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDbkMsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsOEJBQThCLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBRTlGLGFBQWE7UUFDYixNQUFNLEVBQUUsY0FBYyxFQUFFLFVBQVUsRUFBRSxHQUFHLGVBQWUsQ0FBQztRQUN2RCxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLFVBQVUsQ0FBQztRQUV0QyxJQUFJLE1BQU0sSUFBSSxDQUFDLFlBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDekMsT0FBTyxNQUFNLENBQUM7U0FDZjtLQUNGO0lBRUQ7UUFDRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsVUFBRyxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsZ0JBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBRTVFLElBQUksTUFBTSxJQUFJLENBQUMsWUFBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUN6QyxPQUFPLE1BQU0sQ0FBQztTQUNmO0tBQ0Y7SUFFRCxPQUFPLFlBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ2hDLENBQUM7QUF4QkQsb0RBd0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXJuLCBBcm5Gb3JtYXQsIFN0YWNrLCBUb2tlbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgSUNlcnRpZmljYXRlIH0gZnJvbSAnLi9jZXJ0aWZpY2F0ZSc7XG5pbXBvcnQgeyBEbnNWYWxpZGF0ZWRDZXJ0aWZpY2F0ZSB9IGZyb20gJy4vZG5zLXZhbGlkYXRlZC1jZXJ0aWZpY2F0ZSc7XG5pbXBvcnQgeyBwdWJsaWNTdWZmaXhlcyB9IGZyb20gJy4vcHVibGljLXN1ZmZpeGVzJztcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBhcGV4IGRvbWFpbiAoZG9tYWluLmNvbSkgZnJvbSBhIHN1YmRvbWFpbiAod3d3LnN1Yi5kb21haW4uY29tKVxuICovXG5leHBvcnQgZnVuY3Rpb24gYXBleERvbWFpbihkb21haW5OYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBwYXJ0cyA9IGRvbWFpbk5hbWUuc3BsaXQoJy4nKS5yZXZlcnNlKCk7XG5cbiAgbGV0IGN1cnI6IGFueSA9IHB1YmxpY1N1ZmZpeGVzO1xuXG4gIGNvbnN0IGFjY3VtdWxhdGVkOiBzdHJpbmdbXSA9IFtdO1xuICBmb3IgKGNvbnN0IHBhcnQgb2YgcGFydHMpIHtcbiAgICBhY2N1bXVsYXRlZC5wdXNoKHBhcnQpO1xuICAgIGlmICghKHBhcnQgaW4gY3VycikpIHsgYnJlYWs7IH1cbiAgICBjdXJyID0gY3VycltwYXJ0XTtcbiAgfVxuICByZXR1cm4gYWNjdW11bGF0ZWQucmV2ZXJzZSgpLmpvaW4oJy4nKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRG5zVmFsaWRhdGVkQ2VydGlmaWNhdGUoY2VydDogSUNlcnRpZmljYXRlKTogY2VydCBpcyBEbnNWYWxpZGF0ZWRDZXJ0aWZpY2F0ZSB7XG4gIHJldHVybiBjZXJ0Lmhhc093blByb3BlcnR5KCdkb21haW5OYW1lJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDZXJ0aWZpY2F0ZVJlZ2lvbihjZXJ0OiBJQ2VydGlmaWNhdGUpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICBjb25zdCB7IGNlcnRpZmljYXRlQXJuLCBzdGFjayB9ID0gY2VydDtcblxuICBpZiAoaXNEbnNWYWxpZGF0ZWRDZXJ0aWZpY2F0ZShjZXJ0KSkge1xuICAgIGNvbnN0IHJlcXVlc3RSZXNvdXJjZSA9IGNlcnQubm9kZS5maW5kQ2hpbGQoJ0NlcnRpZmljYXRlUmVxdWVzdG9yUmVzb3VyY2UnKS5ub2RlLmRlZmF1bHRDaGlsZDtcblxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCB7IF9jZm5Qcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzIH0gPSByZXF1ZXN0UmVzb3VyY2U7XG4gICAgY29uc3QgeyBSZWdpb246IHJlZ2lvbiB9ID0gcHJvcGVydGllcztcblxuICAgIGlmIChyZWdpb24gJiYgIVRva2VuLmlzVW5yZXNvbHZlZChyZWdpb24pKSB7XG4gICAgICByZXR1cm4gcmVnaW9uO1xuICAgIH1cbiAgfVxuXG4gIHtcbiAgICBjb25zdCB7IHJlZ2lvbiB9ID0gQXJuLnNwbGl0KGNlcnRpZmljYXRlQXJuLCBBcm5Gb3JtYXQuU0xBU0hfUkVTT1VSQ0VfTkFNRSk7XG5cbiAgICBpZiAocmVnaW9uICYmICFUb2tlbi5pc1VucmVzb2x2ZWQocmVnaW9uKSkge1xuICAgICAgcmV0dXJuIHJlZ2lvbjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gU3RhY2sub2Yoc3RhY2spLnJlZ2lvbjtcbn1cbiJdfQ==
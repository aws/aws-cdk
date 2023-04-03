"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeHostedZoneArn = exports.determineFullyQualifiedDomainName = exports.validateZoneName = void 0;
const core_1 = require("@aws-cdk/core");
/**
 * Validates a zone name is valid by Route53 specifc naming rules,
 * and that there is no trailing dot in the name.
 *
 * @param zoneName the zone name to be validated.
 * @returns +zoneName+
 * @throws ValidationError if the name is not valid.
 */
function validateZoneName(zoneName) {
    if (zoneName.endsWith('.')) {
        throw new ValidationError('zone name must not end with a trailing dot');
    }
    if (zoneName.length > 255) {
        throw new ValidationError('zone name cannot be more than 255 bytes long');
    }
    if (zoneName.split('.').find(label => label.length > 63)) {
        throw new ValidationError('zone name labels cannot be more than 63 bytes long');
    }
    if (!zoneName.match(/^[a-z0-9!"#$%&'()*+,/:;<=>?@[\\\]^_`{|}~.-]+$/i)) {
        throw new ValidationError('zone names can only contain a-z, 0-9, -, ! " # $ % & \' ( ) * + , - / : ; < = > ? @ [ \ ] ^ _ ` { | } ~ .');
    }
}
exports.validateZoneName = validateZoneName;
class ValidationError extends Error {
    constructor(message) {
        super(message);
    }
}
/**
 * Route53 requires the record names are specified as fully qualified names, but this
 * forces lots of redundant work on the user (repeating the zone name over and over).
 * This function allows the user to be lazier and offers a nicer experience, by
 * qualifying relative names appropriately:
 *
 * @param providedName the user-specified name of the record.
 * @param zoneName   the fully-qualified name of the zone the record will be created in.
 *
 * @returns <ul>
 *        <li>If +providedName+ ends with a +.+, use it as-is</li>
 *        <li>If +providedName+ ends with or equals +zoneName+, append a trailing +.+</li>
 *        <li>Otherwise, append +.+, +zoneName+ and a trailing +.+</li>
 *      </ul>
 */
function determineFullyQualifiedDomainName(providedName, hostedZone) {
    if (providedName.endsWith('.')) {
        return providedName;
    }
    const hostedZoneName = hostedZone.zoneName.endsWith('.')
        ? hostedZone.zoneName.substring(0, hostedZone.zoneName.length - 1)
        : hostedZone.zoneName;
    const suffix = `.${hostedZoneName}`;
    if (providedName.endsWith(suffix) || providedName === hostedZoneName) {
        return `${providedName}.`;
    }
    return `${providedName}${suffix}.`;
}
exports.determineFullyQualifiedDomainName = determineFullyQualifiedDomainName;
function makeHostedZoneArn(construct, hostedZoneId) {
    return core_1.Stack.of(construct).formatArn({
        account: '',
        region: '',
        service: 'route53',
        resource: 'hostedzone',
        resourceName: hostedZoneId,
    });
}
exports.makeHostedZoneArn = makeHostedZoneArn;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsd0NBQXNDO0FBSXRDOzs7Ozs7O0dBT0c7QUFDSCxTQUFnQixnQkFBZ0IsQ0FBQyxRQUFnQjtJQUMvQyxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDMUIsTUFBTSxJQUFJLGVBQWUsQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO0tBQ3pFO0lBQ0QsSUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRTtRQUN6QixNQUFNLElBQUksZUFBZSxDQUFDLDhDQUE4QyxDQUFDLENBQUM7S0FDM0U7SUFDRCxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsRUFBRTtRQUN4RCxNQUFNLElBQUksZUFBZSxDQUFDLG9EQUFvRCxDQUFDLENBQUM7S0FDakY7SUFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxFQUFFO1FBQ3JFLE1BQU0sSUFBSSxlQUFlLENBQUMsMkdBQTJHLENBQUMsQ0FBQztLQUN4STtBQUNILENBQUM7QUFiRCw0Q0FhQztBQUVELE1BQU0sZUFBZ0IsU0FBUSxLQUFLO0lBQ2pDLFlBQVksT0FBZTtRQUN6QixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDaEI7Q0FDRjtBQUVEOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBQ0gsU0FBZ0IsaUNBQWlDLENBQUMsWUFBb0IsRUFBRSxVQUF1QjtJQUM3RixJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDOUIsT0FBTyxZQUFZLENBQUM7S0FDckI7SUFFRCxNQUFNLGNBQWMsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7UUFDdEQsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDbEUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7SUFFeEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztJQUNwQyxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksWUFBWSxLQUFLLGNBQWMsRUFBRTtRQUNwRSxPQUFPLEdBQUcsWUFBWSxHQUFHLENBQUM7S0FDM0I7SUFFRCxPQUFPLEdBQUcsWUFBWSxHQUFHLE1BQU0sR0FBRyxDQUFDO0FBQ3JDLENBQUM7QUFmRCw4RUFlQztBQUVELFNBQWdCLGlCQUFpQixDQUFDLFNBQW9CLEVBQUUsWUFBb0I7SUFDMUUsT0FBTyxZQUFLLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUNuQyxPQUFPLEVBQUUsRUFBRTtRQUNYLE1BQU0sRUFBRSxFQUFFO1FBQ1YsT0FBTyxFQUFFLFNBQVM7UUFDbEIsUUFBUSxFQUFFLFlBQVk7UUFDdEIsWUFBWSxFQUFFLFlBQVk7S0FDM0IsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQVJELDhDQVFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgSUhvc3RlZFpvbmUgfSBmcm9tICcuL2hvc3RlZC16b25lLXJlZic7XG5cbi8qKlxuICogVmFsaWRhdGVzIGEgem9uZSBuYW1lIGlzIHZhbGlkIGJ5IFJvdXRlNTMgc3BlY2lmYyBuYW1pbmcgcnVsZXMsXG4gKiBhbmQgdGhhdCB0aGVyZSBpcyBubyB0cmFpbGluZyBkb3QgaW4gdGhlIG5hbWUuXG4gKlxuICogQHBhcmFtIHpvbmVOYW1lIHRoZSB6b25lIG5hbWUgdG8gYmUgdmFsaWRhdGVkLlxuICogQHJldHVybnMgK3pvbmVOYW1lK1xuICogQHRocm93cyBWYWxpZGF0aW9uRXJyb3IgaWYgdGhlIG5hbWUgaXMgbm90IHZhbGlkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVab25lTmFtZSh6b25lTmFtZTogc3RyaW5nKSB7XG4gIGlmICh6b25lTmFtZS5lbmRzV2l0aCgnLicpKSB7XG4gICAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcignem9uZSBuYW1lIG11c3Qgbm90IGVuZCB3aXRoIGEgdHJhaWxpbmcgZG90Jyk7XG4gIH1cbiAgaWYgKHpvbmVOYW1lLmxlbmd0aCA+IDI1NSkge1xuICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoJ3pvbmUgbmFtZSBjYW5ub3QgYmUgbW9yZSB0aGFuIDI1NSBieXRlcyBsb25nJyk7XG4gIH1cbiAgaWYgKHpvbmVOYW1lLnNwbGl0KCcuJykuZmluZChsYWJlbCA9PiBsYWJlbC5sZW5ndGggPiA2MykpIHtcbiAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKCd6b25lIG5hbWUgbGFiZWxzIGNhbm5vdCBiZSBtb3JlIHRoYW4gNjMgYnl0ZXMgbG9uZycpO1xuICB9XG4gIGlmICghem9uZU5hbWUubWF0Y2goL15bYS16MC05IVwiIyQlJicoKSorLC86Ozw9Pj9AW1xcXFxcXF1eX2B7fH1+Li1dKyQvaSkpIHtcbiAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKCd6b25lIG5hbWVzIGNhbiBvbmx5IGNvbnRhaW4gYS16LCAwLTksIC0sICEgXCIgIyAkICUgJiBcXCcgKCApICogKyAsIC0gLyA6IDsgPCA9ID4gPyBAIFsgXFwgXSBeIF8gYCB7IHwgfSB+IC4nKTtcbiAgfVxufVxuXG5jbGFzcyBWYWxpZGF0aW9uRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2U6IHN0cmluZykge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICB9XG59XG5cbi8qKlxuICogUm91dGU1MyByZXF1aXJlcyB0aGUgcmVjb3JkIG5hbWVzIGFyZSBzcGVjaWZpZWQgYXMgZnVsbHkgcXVhbGlmaWVkIG5hbWVzLCBidXQgdGhpc1xuICogZm9yY2VzIGxvdHMgb2YgcmVkdW5kYW50IHdvcmsgb24gdGhlIHVzZXIgKHJlcGVhdGluZyB0aGUgem9uZSBuYW1lIG92ZXIgYW5kIG92ZXIpLlxuICogVGhpcyBmdW5jdGlvbiBhbGxvd3MgdGhlIHVzZXIgdG8gYmUgbGF6aWVyIGFuZCBvZmZlcnMgYSBuaWNlciBleHBlcmllbmNlLCBieVxuICogcXVhbGlmeWluZyByZWxhdGl2ZSBuYW1lcyBhcHByb3ByaWF0ZWx5OlxuICpcbiAqIEBwYXJhbSBwcm92aWRlZE5hbWUgdGhlIHVzZXItc3BlY2lmaWVkIG5hbWUgb2YgdGhlIHJlY29yZC5cbiAqIEBwYXJhbSB6b25lTmFtZSAgIHRoZSBmdWxseS1xdWFsaWZpZWQgbmFtZSBvZiB0aGUgem9uZSB0aGUgcmVjb3JkIHdpbGwgYmUgY3JlYXRlZCBpbi5cbiAqXG4gKiBAcmV0dXJucyA8dWw+XG4gKiAgICAgICAgPGxpPklmICtwcm92aWRlZE5hbWUrIGVuZHMgd2l0aCBhICsuKywgdXNlIGl0IGFzLWlzPC9saT5cbiAqICAgICAgICA8bGk+SWYgK3Byb3ZpZGVkTmFtZSsgZW5kcyB3aXRoIG9yIGVxdWFscyArem9uZU5hbWUrLCBhcHBlbmQgYSB0cmFpbGluZyArLis8L2xpPlxuICogICAgICAgIDxsaT5PdGhlcndpc2UsIGFwcGVuZCArLissICt6b25lTmFtZSsgYW5kIGEgdHJhaWxpbmcgKy4rPC9saT5cbiAqICAgICAgPC91bD5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRldGVybWluZUZ1bGx5UXVhbGlmaWVkRG9tYWluTmFtZShwcm92aWRlZE5hbWU6IHN0cmluZywgaG9zdGVkWm9uZTogSUhvc3RlZFpvbmUpOiBzdHJpbmcge1xuICBpZiAocHJvdmlkZWROYW1lLmVuZHNXaXRoKCcuJykpIHtcbiAgICByZXR1cm4gcHJvdmlkZWROYW1lO1xuICB9XG5cbiAgY29uc3QgaG9zdGVkWm9uZU5hbWUgPSBob3N0ZWRab25lLnpvbmVOYW1lLmVuZHNXaXRoKCcuJylcbiAgICA/IGhvc3RlZFpvbmUuem9uZU5hbWUuc3Vic3RyaW5nKDAsIGhvc3RlZFpvbmUuem9uZU5hbWUubGVuZ3RoIC0gMSlcbiAgICA6IGhvc3RlZFpvbmUuem9uZU5hbWU7XG5cbiAgY29uc3Qgc3VmZml4ID0gYC4ke2hvc3RlZFpvbmVOYW1lfWA7XG4gIGlmIChwcm92aWRlZE5hbWUuZW5kc1dpdGgoc3VmZml4KSB8fCBwcm92aWRlZE5hbWUgPT09IGhvc3RlZFpvbmVOYW1lKSB7XG4gICAgcmV0dXJuIGAke3Byb3ZpZGVkTmFtZX0uYDtcbiAgfVxuXG4gIHJldHVybiBgJHtwcm92aWRlZE5hbWV9JHtzdWZmaXh9LmA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlSG9zdGVkWm9uZUFybihjb25zdHJ1Y3Q6IENvbnN0cnVjdCwgaG9zdGVkWm9uZUlkOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gU3RhY2sub2YoY29uc3RydWN0KS5mb3JtYXRBcm4oe1xuICAgIGFjY291bnQ6ICcnLFxuICAgIHJlZ2lvbjogJycsXG4gICAgc2VydmljZTogJ3JvdXRlNTMnLFxuICAgIHJlc291cmNlOiAnaG9zdGVkem9uZScsXG4gICAgcmVzb3VyY2VOYW1lOiBob3N0ZWRab25lSWQsXG4gIH0pO1xufVxuIl19
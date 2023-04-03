"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPoolEmail = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const punycode_1 = require("punycode/");
/**
 * Configure how Cognito sends emails
 */
class UserPoolEmail {
    /**
     * Send email using Cognito
     */
    static withCognito(replyTo) {
        return new CognitoEmail(replyTo);
    }
    /**
     * Send email using SES
     */
    static withSES(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cognito_UserPoolSESOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.withSES);
            }
            throw error;
        }
        return new SESEmail(options);
    }
}
exports.UserPoolEmail = UserPoolEmail;
_a = JSII_RTTI_SYMBOL_1;
UserPoolEmail[_a] = { fqn: "@aws-cdk/aws-cognito.UserPoolEmail", version: "0.0.0" };
class CognitoEmail extends UserPoolEmail {
    constructor(replyTo) {
        super();
        this.replyTo = replyTo;
    }
    _bind(_scope) {
        return {
            replyToEmailAddress: encodeAndTest(this.replyTo),
            emailSendingAccount: 'COGNITO_DEFAULT',
        };
    }
}
class SESEmail extends UserPoolEmail {
    constructor(options) {
        super();
        this.options = options;
    }
    _bind(scope) {
        const region = core_1.Stack.of(scope).region;
        if (core_1.Token.isUnresolved(region) && !this.options.sesRegion) {
            throw new Error('Your stack region cannot be determined so "sesRegion" is required in SESOptions');
        }
        let from = encodeAndTest(this.options.fromEmail);
        if (this.options.fromName) {
            const fromName = formatFromName(this.options.fromName);
            from = `${fromName} <${from}>`;
        }
        if (this.options.sesVerifiedDomain) {
            const domainFromEmail = this.options.fromEmail.split('@').pop();
            if (domainFromEmail !== this.options.sesVerifiedDomain) {
                throw new Error('"fromEmail" contains a different domain than the "sesVerifiedDomain"');
            }
        }
        return {
            from,
            replyToEmailAddress: encodeAndTest(this.options.replyTo),
            configurationSet: this.options.configurationSetName,
            emailSendingAccount: 'DEVELOPER',
            sourceArn: core_1.Stack.of(scope).formatArn({
                service: 'ses',
                resource: 'identity',
                resourceName: encodeAndTest(this.options.sesVerifiedDomain ?? this.options.fromEmail),
                region: this.options.sesRegion ?? region,
            }),
        };
    }
}
function encodeAndTest(input) {
    if (input) {
        const local = input.split('@')[0];
        if (!/[\p{ASCII}]+/u.test(local)) {
            throw new Error('the local part of the email address must use ASCII characters only');
        }
        return punycode_1.toASCII(input);
    }
    else {
        return undefined;
    }
}
/**
 * Formats `fromName` to comply RFC 5322
 *
 * @see https://www.rfc-editor.org/rfc/rfc5322#section-3.4
 */
function formatFromName(fromName) {
    // mime encode for non US-ASCII characters
    // see RFC 2047 for details https://www.rfc-editor.org/rfc/rfc2047
    if (!isAscii(fromName)) {
        const base64Name = Buffer.from(fromName, 'utf-8').toString('base64');
        return `=?UTF-8?B?${base64Name}?=`;
    }
    // makes a quoted-string unless fromName is a phrase (only atext and space)
    // or a quoted-string already
    if (!(isSimplePhrase(fromName) || isQuotedString(fromName))) {
        // in quoted-string, `\` and `"` should be escaped by `\`
        // e.g. `"foo \"bar\" \\baz"`
        const quotedName = fromName.replace(/[\\"]/g, (ch) => `\\${ch}`);
        return `"${quotedName}"`;
    }
    // otherwise, returns as is
    return fromName;
}
/**
 * Returns whether the input is a printable US-ASCII string
 */
function isAscii(input) {
    // U+0020 (space) - U+007E (`~`)
    return /^[\u0020-\u007E]+$/u.test(input);
}
/**
 * Returns whether the input is a phrase excluding quoted-string
 *
 * @see https://www.rfc-editor.org/rfc/rfc5322#section-3.2
 */
function isSimplePhrase(input) {
    return /^[\w !#$%&'*+-\/=?^_`{|}~]+$/.test(input);
}
/**
 * Returns whether the input is already a quoted-string
 *
 * @see https://www.rfc-editor.org/rfc/rfc5322#section-3.2.4
 */
function isQuotedString(input) {
    // in quoted-string, `\` and `"` should be esacaped by `\`
    //
    // match: `"foo.bar"` / `"foo \"bar\""` / `"foo \\ bar"`
    // not match: `"bare " dquote"` / `"unclosed escape \"` / `"unclosed dquote`
    return /^"(?:[^\\"]|\\.)*"$/.test(input);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1wb29sLWVtYWlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlci1wb29sLWVtYWlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUE2QztBQUU3Qyx3Q0FBc0Q7QUE4R3REOztHQUVHO0FBQ0gsTUFBc0IsYUFBYTtJQUNqQzs7T0FFRztJQUNJLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBZ0I7UUFDeEMsT0FBTyxJQUFJLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNsQztJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUEyQjs7Ozs7Ozs7OztRQUMvQyxPQUFPLElBQUksUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQzlCOztBQWJILHNDQXVCQzs7O0FBRUQsTUFBTSxZQUFhLFNBQVEsYUFBYTtJQUN0QyxZQUE2QixPQUFnQjtRQUMzQyxLQUFLLEVBQUUsQ0FBQztRQURtQixZQUFPLEdBQVAsT0FBTyxDQUFTO0tBRTVDO0lBRU0sS0FBSyxDQUFDLE1BQWlCO1FBQzVCLE9BQU87WUFDTCxtQkFBbUIsRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUNoRCxtQkFBbUIsRUFBRSxpQkFBaUI7U0FDdkMsQ0FBQztLQUVIO0NBQ0Y7QUFFRCxNQUFNLFFBQVMsU0FBUSxhQUFhO0lBQ2xDLFlBQTZCLE9BQTJCO1FBQ3RELEtBQUssRUFBRSxDQUFDO1FBRG1CLFlBQU8sR0FBUCxPQUFPLENBQW9CO0tBRXZEO0lBRU0sS0FBSyxDQUFDLEtBQWdCO1FBQzNCLE1BQU0sTUFBTSxHQUFHLFlBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBRXRDLElBQUksWUFBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFO1lBQ3pELE1BQU0sSUFBSSxLQUFLLENBQUMsaUZBQWlGLENBQUMs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cUJBQXFCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzNDLENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsU0FBUyxjQUFjLENBQUMsS0FBYTtJQUNuQyxPQUFPLDhCQUE4QixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNwRCxDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQVMsY0FBYyxDQUFDLEtBQWE7SUFDbkMsMERBQTBEO0lBQzFELEVBQUU7SUFDRix3REFBd0Q7SUFDeEQsNEVBQTRFO0lBQzVFLE9BQU8scUJBQXFCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzNDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdGFjaywgVG9rZW4gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgdG9BU0NJSSBhcyBwdW55Y29kZUVuY29kZSB9IGZyb20gJ3B1bnljb2RlLyc7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBmb3IgQ29nbml0byBzZW5kaW5nIGVtYWlscyB2aWEgQW1hem9uIFNFU1xuICovXG5leHBvcnQgaW50ZXJmYWNlIFVzZXJQb29sU0VTT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgdmVyaWZpZWQgQW1hem9uIFNFUyBlbWFpbCBhZGRyZXNzIHRoYXQgQ29nbml0byBzaG91bGRcbiAgICogdXNlIHRvIHNlbmQgZW1haWxzLlxuICAgKlxuICAgKiBUaGUgZW1haWwgYWRkcmVzcyB1c2VkIG11c3QgYmUgYSB2ZXJpZmllZCBlbWFpbCBhZGRyZXNzXG4gICAqIGluIEFtYXpvbiBTRVMgYW5kIG11c3QgYmUgY29uZmlndXJlZCB0byBhbGxvdyBDb2duaXRvIHRvXG4gICAqIHNlbmQgZW1haWxzLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2duaXRvL2xhdGVzdC9kZXZlbG9wZXJndWlkZS91c2VyLXBvb2wtZW1haWwuaHRtbFxuICAgKi9cbiAgcmVhZG9ubHkgZnJvbUVtYWlsOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEFuIG9wdGlvbmFsIG5hbWUgdGhhdCBzaG91bGQgYmUgdXNlZCBhcyB0aGUgc2VuZGVyJ3MgbmFtZVxuICAgKiBhbG9uZyB3aXRoIHRoZSBlbWFpbC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBuYW1lXG4gICAqL1xuICByZWFkb25seSBmcm9tTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGRlc3RpbmF0aW9uIHRvIHdoaWNoIHRoZSByZWNlaXZlciBvZiB0aGUgZW1haWwgc2hvdWxkIHJlcGxveSB0by5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBzYW1lIGFzIHRoZSBmcm9tRW1haWxcbiAgICovXG4gIHJlYWRvbmx5IHJlcGx5VG8/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIGEgY29uZmlndXJhdGlvbiBzZXQgaW4gQW1hem9uIFNFUyB0aGF0IHNob3VsZFxuICAgKiBiZSBhcHBsaWVkIHRvIGVtYWlscyBzZW50IHZpYSBDb2duaXRvLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWNvZ25pdG8tdXNlcnBvb2wtZW1haWxjb25maWd1cmF0aW9uLmh0bWwjY2ZuLWNvZ25pdG8tdXNlcnBvb2wtZW1haWxjb25maWd1cmF0aW9uLWNvbmZpZ3VyYXRpb25zZXRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBjb25maWd1cmF0aW9uIHNldFxuICAgKi9cbiAgcmVhZG9ubHkgY29uZmlndXJhdGlvblNldE5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJlcXVpcmVkIGlmIHRoZSBVc2VyUG9vbCByZWdpb24gaXMgZGlmZmVyZW50IHRoYW4gdGhlIFNFUyByZWdpb24uXG4gICAqXG4gICAqIElmIHNlbmRpbmcgZW1haWxzIHdpdGggYSBBbWF6b24gU0VTIHZlcmlmaWVkIGVtYWlsIGFkZHJlc3MsXG4gICAqIGFuZCB0aGUgcmVnaW9uIHRoYXQgU0VTIGlzIGNvbmZpZ3VyZWQgaXMgZGlmZmVyZW50IHRoYW4gdGhlXG4gICAqIHJlZ2lvbiBpbiB3aGljaCB0aGUgVXNlclBvb2wgaXMgZGVwbG95ZWQsIHlvdSBtdXN0IHNwZWNpZnkgdGhhdFxuICAgKiByZWdpb24gaGVyZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBUaGUgc2FtZSByZWdpb24gYXMgdGhlIENvZ25pdG8gVXNlclBvb2xcbiAgICovXG4gIHJlYWRvbmx5IHNlc1JlZ2lvbj86IHN0cmluZztcblxuICAvKipcbiAgICogU0VTIFZlcmlmaWVkIGN1c3RvbSBkb21haW4gdG8gYmUgdXNlZCB0byB2ZXJpZnkgdGhlIGlkZW50aXR5XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gZG9tYWluXG4gICAqL1xuICByZWFkb25seSBzZXNWZXJpZmllZERvbWFpbj86IHN0cmluZ1xufVxuXG4vKipcbiAqIFJlc3VsdCBvZiBiaW5kaW5nIGVtYWlsIHNldHRpbmdzIHdpdGggYSB1c2VyIHBvb2xcbiAqL1xuaW50ZXJmYWNlIFVzZXJQb29sRW1haWxDb25maWcge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGNvbmZpZ3VyYXRpb24gc2V0IGluIFNFUy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBub25lXG4gICAqL1xuICByZWFkb25seSBjb25maWd1cmF0aW9uU2V0Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgd2hldGhlciB0byB1c2UgQ29nbml0bydzIGJ1aWx0IGluIGVtYWlsIGZ1bmN0aW9uYWxpdHlcbiAgICogb3IgU0VTLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIENvZ25pdG8gYnVpbHQgaW4gZW1haWwgZnVuY3Rpb25hbGl0eVxuICAgKi9cbiAgcmVhZG9ubHkgZW1haWxTZW5kaW5nQWNjb3VudD86IHN0cmluZztcblxuICAvKipcbiAgICogSWRlbnRpZmllcyBlaXRoZXIgdGhlIHNlbmRlcidzIGVtYWlsIGFkZHJlc3Mgb3IgdGhlIHNlbmRlcidzXG4gICAqIG5hbWUgd2l0aCB0aGVpciBlbWFpbCBhZGRyZXNzLlxuICAgKlxuICAgKiBJZiBlbWFpbFNlbmRpbmdBY2NvdW50IGlzIERFVkVMT1BFUiB0aGVuIHRoaXMgY2Fubm90IGJlIHNwZWNpZmllZC5cbiAgICpcbiAgICogQGRlZmF1bHQgJ25vLXJlcGx5QHZlcmlmaWNhdGlvbmVtYWlsLmNvbSdcbiAgICovXG4gIHJlYWRvbmx5IGZyb20/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBkZXN0aW5hdGlvbiB0byB3aGljaCB0aGUgcmVjZWl2ZXIgb2YgdGhlIGVtYWlsIHNob3VsZCByZXBseSB0by5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBzYW1lIGFzIGBmcm9tYFxuICAgKi9cbiAgcmVhZG9ubHkgcmVwbHlUb0VtYWlsQWRkcmVzcz86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIEFSTiBvZiBhIHZlcmlmaWVkIGVtYWlsIGFkZHJlc3MgaW4gQW1hem9uIFNFUy5cbiAgICpcbiAgICogcmVxdWlyZWQgaWYgZW1haWxTZW5kaW5nQWNjb3VudCBpcyBERVZFTE9QRVIgb3IgaWZcbiAgICogJ2Zyb20nIGlzIHByb3ZpZGVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IHNvdXJjZUFybj86IHN0cmluZztcbn1cblxuLyoqXG4gKiBDb25maWd1cmUgaG93IENvZ25pdG8gc2VuZHMgZW1haWxzXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBVc2VyUG9vbEVtYWlsIHtcbiAgLyoqXG4gICAqIFNlbmQgZW1haWwgdXNpbmcgQ29nbml0b1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyB3aXRoQ29nbml0byhyZXBseVRvPzogc3RyaW5nKTogVXNlclBvb2xFbWFpbCB7XG4gICAgcmV0dXJuIG5ldyBDb2duaXRvRW1haWwocmVwbHlUbyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBlbWFpbCB1c2luZyBTRVNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgd2l0aFNFUyhvcHRpb25zOiBVc2VyUG9vbFNFU09wdGlvbnMpOiBVc2VyUG9vbEVtYWlsIHtcbiAgICByZXR1cm4gbmV3IFNFU0VtYWlsKG9wdGlvbnMpO1xuICB9XG5cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZW1haWwgY29uZmlndXJhdGlvbiBmb3IgYSBDb2duaXRvIFVzZXJQb29sXG4gICAqIHRoYXQgY29udHJvbHMgaG93IENvZ25pdG8gd2lsbCBzZW5kIGVtYWlsc1xuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCBfYmluZChzY29wZTogQ29uc3RydWN0KTogVXNlclBvb2xFbWFpbENvbmZpZztcblxufVxuXG5jbGFzcyBDb2duaXRvRW1haWwgZXh0ZW5kcyBVc2VyUG9vbEVtYWlsIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSByZXBseVRvPzogc3RyaW5nKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIHB1YmxpYyBfYmluZChfc2NvcGU6IENvbnN0cnVjdCk6IFVzZXJQb29sRW1haWxDb25maWcge1xuICAgIHJldHVybiB7XG4gICAgICByZXBseVRvRW1haWxBZGRyZXNzOiBlbmNvZGVBbmRUZXN0KHRoaXMucmVwbHlUbyksXG4gICAgICBlbWFpbFNlbmRpbmdBY2NvdW50OiAnQ09HTklUT19ERUZBVUxUJyxcbiAgICB9O1xuXG4gIH1cbn1cblxuY2xhc3MgU0VTRW1haWwgZXh0ZW5kcyBVc2VyUG9vbEVtYWlsIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBvcHRpb25zOiBVc2VyUG9vbFNFU09wdGlvbnMpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgcHVibGljIF9iaW5kKHNjb3BlOiBDb25zdHJ1Y3QpOiBVc2VyUG9vbEVtYWlsQ29uZmlnIHtcbiAgICBjb25zdCByZWdpb24gPSBTdGFjay5vZihzY29wZSkucmVnaW9uO1xuXG4gICAgaWYgKFRva2VuLmlzVW5yZXNvbHZlZChyZWdpb24pICYmICF0aGlzLm9wdGlvbnMuc2VzUmVnaW9uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdXIgc3RhY2sgcmVnaW9uIGNhbm5vdCBiZSBkZXRlcm1pbmVkIHNvIFwic2VzUmVnaW9uXCIgaXMgcmVxdWlyZWQgaW4gU0VTT3B0aW9ucycpO1xuICAgIH1cblxuICAgIGxldCBmcm9tID0gZW5jb2RlQW5kVGVzdCh0aGlzLm9wdGlvbnMuZnJvbUVtYWlsKTtcbiAgICBpZiAodGhpcy5vcHRpb25zLmZyb21OYW1lKSB7XG4gICAgICBjb25zdCBmcm9tTmFtZSA9IGZvcm1hdEZyb21OYW1lKHRoaXMub3B0aW9ucy5mcm9tTmFtZSk7XG4gICAgICBmcm9tID0gYCR7ZnJvbU5hbWV9IDwke2Zyb219PmA7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5zZXNWZXJpZmllZERvbWFpbikge1xuICAgICAgY29uc3QgZG9tYWluRnJvbUVtYWlsID0gdGhpcy5vcHRpb25zLmZyb21FbWFpbC5zcGxpdCgnQCcpLnBvcCgpO1xuICAgICAgaWYgKGRvbWFpbkZyb21FbWFpbCAhPT0gdGhpcy5vcHRpb25zLnNlc1ZlcmlmaWVkRG9tYWluKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignXCJmcm9tRW1haWxcIiBjb250YWlucyBhIGRpZmZlcmVudCBkb21haW4gdGhhbiB0aGUgXCJzZXNWZXJpZmllZERvbWFpblwiJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGZyb20sXG4gICAgICByZXBseVRvRW1haWxBZGRyZXNzOiBlbmNvZGVBbmRUZXN0KHRoaXMub3B0aW9ucy5yZXBseVRvKSxcbiAgICAgIGNvbmZpZ3VyYXRpb25TZXQ6IHRoaXMub3B0aW9ucy5jb25maWd1cmF0aW9uU2V0TmFtZSxcbiAgICAgIGVtYWlsU2VuZGluZ0FjY291bnQ6ICdERVZFTE9QRVInLFxuICAgICAgc291cmNlQXJuOiBTdGFjay5vZihzY29wZSkuZm9ybWF0QXJuKHtcbiAgICAgICAgc2VydmljZTogJ3NlcycsXG4gICAgICAgIHJlc291cmNlOiAnaWRlbnRpdHknLFxuICAgICAgICByZXNvdXJjZU5hbWU6IGVuY29kZUFuZFRlc3QodGhpcy5vcHRpb25zLnNlc1ZlcmlmaWVkRG9tYWluID8/IHRoaXMub3B0aW9ucy5mcm9tRW1haWwpLFxuICAgICAgICByZWdpb246IHRoaXMub3B0aW9ucy5zZXNSZWdpb24gPz8gcmVnaW9uLFxuICAgICAgfSksXG4gICAgfTtcbiAgfVxufVxuXG5mdW5jdGlvbiBlbmNvZGVBbmRUZXN0KGlucHV0OiBzdHJpbmcgfCB1bmRlZmluZWQpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICBpZiAoaW5wdXQpIHtcbiAgICBjb25zdCBsb2NhbCA9IGlucHV0LnNwbGl0KCdAJylbMF07XG4gICAgaWYgKCEvW1xccHtBU0NJSX1dKy91LnRlc3QobG9jYWwpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3RoZSBsb2NhbCBwYXJ0IG9mIHRoZSBlbWFpbCBhZGRyZXNzIG11c3QgdXNlIEFTQ0lJIGNoYXJhY3RlcnMgb25seScpO1xuICAgIH1cbiAgICByZXR1cm4gcHVueWNvZGVFbmNvZGUoaW5wdXQpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cblxuLyoqXG4gKiBGb3JtYXRzIGBmcm9tTmFtZWAgdG8gY29tcGx5IFJGQyA1MzIyXG4gKlxuICogQHNlZSBodHRwczovL3d3dy5yZmMtZWRpdG9yLm9yZy9yZmMvcmZjNTMyMiNzZWN0aW9uLTMuNFxuICovXG5mdW5jdGlvbiBmb3JtYXRGcm9tTmFtZShmcm9tTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgLy8gbWltZSBlbmNvZGUgZm9yIG5vbiBVUy1BU0NJSSBjaGFyYWN0ZXJzXG4gIC8vIHNlZSBSRkMgMjA0NyBmb3IgZGV0YWlscyBodHRwczovL3d3dy5yZmMtZWRpdG9yLm9yZy9yZmMvcmZjMjA0N1xuICBpZiAoIWlzQXNjaWkoZnJvbU5hbWUpKSB7XG4gICAgY29uc3QgYmFzZTY0TmFtZSA9IEJ1ZmZlci5mcm9tKGZyb21OYW1lLCAndXRmLTgnKS50b1N0cmluZygnYmFzZTY0Jyk7XG4gICAgcmV0dXJuIGA9P1VURi04P0I/JHtiYXNlNjROYW1lfT89YDtcbiAgfVxuXG4gIC8vIG1ha2VzIGEgcXVvdGVkLXN0cmluZyB1bmxlc3MgZnJvbU5hbWUgaXMgYSBwaHJhc2UgKG9ubHkgYXRleHQgYW5kIHNwYWNlKVxuICAvLyBvciBhIHF1b3RlZC1zdHJpbmcgYWxyZWFkeVxuICBpZiAoIShpc1NpbXBsZVBocmFzZShmcm9tTmFtZSkgfHwgaXNRdW90ZWRTdHJpbmcoZnJvbU5hbWUpKSkge1xuICAgIC8vIGluIHF1b3RlZC1zdHJpbmcsIGBcXGAgYW5kIGBcImAgc2hvdWxkIGJlIGVzY2FwZWQgYnkgYFxcYFxuICAgIC8vIGUuZy4gYFwiZm9vIFxcXCJiYXJcXFwiIFxcXFxiYXpcImBcbiAgICBjb25zdCBxdW90ZWROYW1lID0gZnJvbU5hbWUucmVwbGFjZSgvW1xcXFxcIl0vZywgKGNoKSA9PiBgXFxcXCR7Y2h9YCk7XG4gICAgcmV0dXJuIGBcIiR7cXVvdGVkTmFtZX1cImA7XG4gIH1cblxuICAvLyBvdGhlcndpc2UsIHJldHVybnMgYXMgaXNcbiAgcmV0dXJuIGZyb21OYW1lO1xufVxuXG4vKipcbiAqIFJldHVybnMgd2hldGhlciB0aGUgaW5wdXQgaXMgYSBwcmludGFibGUgVVMtQVNDSUkgc3RyaW5nXG4gKi9cbmZ1bmN0aW9uIGlzQXNjaWkoaW5wdXQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAvLyBVKzAwMjAgKHNwYWNlKSAtIFUrMDA3RSAoYH5gKVxuICByZXR1cm4gL15bXFx1MDAyMC1cXHUwMDdFXSskL3UudGVzdChpbnB1dCk7XG59XG5cbi8qKlxuICogUmV0dXJucyB3aGV0aGVyIHRoZSBpbnB1dCBpcyBhIHBocmFzZSBleGNsdWRpbmcgcXVvdGVkLXN0cmluZ1xuICpcbiAqIEBzZWUgaHR0cHM6Ly93d3cucmZjLWVkaXRvci5vcmcvcmZjL3JmYzUzMjIjc2VjdGlvbi0zLjJcbiAqL1xuZnVuY3Rpb24gaXNTaW1wbGVQaHJhc2UoaW5wdXQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gL15bXFx3ICEjJCUmJyorLVxcLz0/Xl9ge3x9fl0rJC8udGVzdChpbnB1dCk7XG59XG5cbi8qKlxuICogUmV0dXJucyB3aGV0aGVyIHRoZSBpbnB1dCBpcyBhbHJlYWR5IGEgcXVvdGVkLXN0cmluZ1xuICpcbiAqIEBzZWUgaHR0cHM6Ly93d3cucmZjLWVkaXRvci5vcmcvcmZjL3JmYzUzMjIjc2VjdGlvbi0zLjIuNFxuICovXG5mdW5jdGlvbiBpc1F1b3RlZFN0cmluZyhpbnB1dDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIC8vIGluIHF1b3RlZC1zdHJpbmcsIGBcXGAgYW5kIGBcImAgc2hvdWxkIGJlIGVzYWNhcGVkIGJ5IGBcXGBcbiAgLy9cbiAgLy8gbWF0Y2g6IGBcImZvby5iYXJcImAgLyBgXCJmb28gXFxcImJhclxcXCJcImAgLyBgXCJmb28gXFxcXCBiYXJcImBcbiAgLy8gbm90IG1hdGNoOiBgXCJiYXJlIFwiIGRxdW90ZVwiYCAvIGBcInVuY2xvc2VkIGVzY2FwZSBcXFwiYCAvIGBcInVuY2xvc2VkIGRxdW90ZWBcbiAgcmV0dXJuIC9eXCIoPzpbXlxcXFxcIl18XFxcXC4pKlwiJC8udGVzdChpbnB1dCk7XG59XG4iXX0=
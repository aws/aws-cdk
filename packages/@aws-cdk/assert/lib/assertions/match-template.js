"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchTemplate = exports.beASupersetOfTemplate = exports.exactlyMatchTemplate = exports.MatchStyle = void 0;
const cfnDiff = require("@aws-cdk/cloudformation-diff");
const assertion_1 = require("../assertion");
var MatchStyle;
(function (MatchStyle) {
    /** Requires an exact match */
    MatchStyle["EXACT"] = "exactly";
    /** Allows any change that does not cause a resource replacement */
    MatchStyle["NO_REPLACES"] = "no replaces";
    /** Allows additions, but no updates */
    MatchStyle["SUPERSET"] = "superset";
})(MatchStyle = exports.MatchStyle || (exports.MatchStyle = {}));
function exactlyMatchTemplate(template) {
    return matchTemplate(template, MatchStyle.EXACT);
}
exports.exactlyMatchTemplate = exactlyMatchTemplate;
function beASupersetOfTemplate(template) {
    return matchTemplate(template, MatchStyle.SUPERSET);
}
exports.beASupersetOfTemplate = beASupersetOfTemplate;
function matchTemplate(template, matchStyle = MatchStyle.EXACT) {
    return new StackMatchesTemplateAssertion(template, matchStyle);
}
exports.matchTemplate = matchTemplate;
class StackMatchesTemplateAssertion extends assertion_1.Assertion {
    constructor(template, matchStyle) {
        super();
        this.template = template;
        this.matchStyle = matchStyle;
    }
    assertOrThrow(inspector) {
        if (!this.assertUsing(inspector)) {
            // The details have already been printed, so don't generate a huge error message
            throw new Error('Template comparison produced unacceptable match');
        }
    }
    assertUsing(inspector) {
        const diff = cfnDiff.diffTemplate(this.template, inspector.value);
        const acceptable = this.isDiffAcceptable(diff);
        if (!acceptable) {
            // Print the diff
            cfnDiff.formatDifferences(process.stderr, diff);
            // Print the actual template
            process.stdout.write('--------------------------------------------------------------------------------------\n');
            process.stdout.write(JSON.stringify(inspector.value, undefined, 2) + '\n');
        }
        return acceptable;
    }
    isDiffAcceptable(diff) {
        switch (this.matchStyle) {
            case MatchStyle.EXACT:
                return diff.differenceCount === 0;
            case MatchStyle.NO_REPLACES:
                for (const change of Object.values(diff.resources.changes)) {
                    if (change.changeImpact === cfnDiff.ResourceImpact.MAY_REPLACE) {
                        return false;
                    }
                    if (change.changeImpact === cfnDiff.ResourceImpact.WILL_REPLACE) {
                        return false;
                    }
                }
                for (const change of Object.values(diff.parameters.changes)) {
                    if (change.isUpdate) {
                        return false;
                    }
                }
                for (const change of Object.values(diff.outputs.changes)) {
                    if (change.isUpdate) {
                        return false;
                    }
                }
                return true;
            case MatchStyle.SUPERSET:
                for (const change of Object.values(diff.resources.changes)) {
                    if (change.changeImpact !== cfnDiff.ResourceImpact.WILL_CREATE) {
                        return false;
                    }
                }
                for (const change of Object.values(diff.parameters.changes)) {
                    if (!change.isAddition) {
                        return false;
                    }
                }
                for (const change of Object.values(diff.outputs.changes)) {
                    if (!change.isAddition) {
                        return false;
                    }
                }
                return true;
        }
    }
    get description() {
        return `template (${this.matchStyle}): ${JSON.stringify(this.template, null, 2)}`;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0Y2gtdGVtcGxhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYXRjaC10ZW1wbGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx3REFBd0Q7QUFDeEQsNENBQXlDO0FBR3pDLElBQVksVUFPWDtBQVBELFdBQVksVUFBVTtJQUNwQiw4QkFBOEI7SUFDOUIsK0JBQWlCLENBQUE7SUFDakIsbUVBQW1FO0lBQ25FLHlDQUEyQixDQUFBO0lBQzNCLHVDQUF1QztJQUN2QyxtQ0FBcUIsQ0FBQTtBQUN2QixDQUFDLEVBUFcsVUFBVSxHQUFWLGtCQUFVLEtBQVYsa0JBQVUsUUFPckI7QUFFRCxTQUFnQixvQkFBb0IsQ0FBQyxRQUFnQztJQUNuRSxPQUFPLGFBQWEsQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25ELENBQUM7QUFGRCxvREFFQztBQUVELFNBQWdCLHFCQUFxQixDQUFDLFFBQWdDO0lBQ3BFLE9BQU8sYUFBYSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDdEQsQ0FBQztBQUZELHNEQUVDO0FBRUQsU0FBZ0IsYUFBYSxDQUMzQixRQUFnQyxFQUNoQyxhQUF5QixVQUFVLENBQUMsS0FBSztJQUN6QyxPQUFPLElBQUksNkJBQTZCLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ2pFLENBQUM7QUFKRCxzQ0FJQztBQUVELE1BQU0sNkJBQThCLFNBQVEscUJBQXlCO0lBQ25FLFlBQ21CLFFBQWdDLEVBQ2hDLFVBQXNCO1FBQ3ZDLEtBQUssRUFBRSxDQUFDO1FBRlMsYUFBUSxHQUFSLFFBQVEsQ0FBd0I7UUFDaEMsZUFBVSxHQUFWLFVBQVUsQ0FBWTtJQUV6QyxDQUFDO0lBRU0sYUFBYSxDQUFDLFNBQXlCO1FBQzVDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ2hDLGdGQUFnRjtZQUNoRixNQUFNLElBQUks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O0lBRUQsSUFBVyxXQUFXO1FBQ3BCLE9BQU8sYUFBYSxJQUFJLENBQUMsVUFBVSxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNwRixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZm5EaWZmIGZyb20gJ0Bhd3MtY2RrL2Nsb3VkZm9ybWF0aW9uLWRpZmYnO1xuaW1wb3J0IHsgQXNzZXJ0aW9uIH0gZnJvbSAnLi4vYXNzZXJ0aW9uJztcbmltcG9ydCB7IFN0YWNrSW5zcGVjdG9yIH0gZnJvbSAnLi4vaW5zcGVjdG9yJztcblxuZXhwb3J0IGVudW0gTWF0Y2hTdHlsZSB7XG4gIC8qKiBSZXF1aXJlcyBhbiBleGFjdCBtYXRjaCAqL1xuICBFWEFDVCA9ICdleGFjdGx5JyxcbiAgLyoqIEFsbG93cyBhbnkgY2hhbmdlIHRoYXQgZG9lcyBub3QgY2F1c2UgYSByZXNvdXJjZSByZXBsYWNlbWVudCAqL1xuICBOT19SRVBMQUNFUyA9ICdubyByZXBsYWNlcycsXG4gIC8qKiBBbGxvd3MgYWRkaXRpb25zLCBidXQgbm8gdXBkYXRlcyAqL1xuICBTVVBFUlNFVCA9ICdzdXBlcnNldCdcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4YWN0bHlNYXRjaFRlbXBsYXRlKHRlbXBsYXRlOiB7IFtrZXk6IHN0cmluZ106IGFueSB9KSB7XG4gIHJldHVybiBtYXRjaFRlbXBsYXRlKHRlbXBsYXRlLCBNYXRjaFN0eWxlLkVYQUNUKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJlQVN1cGVyc2V0T2ZUZW1wbGF0ZSh0ZW1wbGF0ZTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSkge1xuICByZXR1cm4gbWF0Y2hUZW1wbGF0ZSh0ZW1wbGF0ZSwgTWF0Y2hTdHlsZS5TVVBFUlNFVCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXRjaFRlbXBsYXRlKFxuICB0ZW1wbGF0ZTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSxcbiAgbWF0Y2hTdHlsZTogTWF0Y2hTdHlsZSA9IE1hdGNoU3R5bGUuRVhBQ1QpOiBBc3NlcnRpb248U3RhY2tJbnNwZWN0b3I+IHtcbiAgcmV0dXJuIG5ldyBTdGFja01hdGNoZXNUZW1wbGF0ZUFzc2VydGlvbih0ZW1wbGF0ZSwgbWF0Y2hTdHlsZSk7XG59XG5cbmNsYXNzIFN0YWNrTWF0Y2hlc1RlbXBsYXRlQXNzZXJ0aW9uIGV4dGVuZHMgQXNzZXJ0aW9uPFN0YWNrSW5zcGVjdG9yPiB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgdGVtcGxhdGU6IHsgW2tleTogc3RyaW5nXTogYW55IH0sXG4gICAgcHJpdmF0ZSByZWFkb25seSBtYXRjaFN0eWxlOiBNYXRjaFN0eWxlKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlcnRPclRocm93KGluc3BlY3RvcjogU3RhY2tJbnNwZWN0b3IpIHtcbiAgICBpZiAoIXRoaXMuYXNzZXJ0VXNpbmcoaW5zcGVjdG9yKSkge1xuICAgICAgLy8gVGhlIGRldGFpbHMgaGF2ZSBhbHJlYWR5IGJlZW4gcHJpbnRlZCwgc28gZG9uJ3QgZ2VuZXJhdGUgYSBodWdlIGVycm9yIG1lc3NhZ2VcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGVtcGxhdGUgY29tcGFyaXNvbiBwcm9kdWNlZCB1bmFjY2VwdGFibGUgbWF0Y2gnKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYXNzZXJ0VXNpbmcoaW5zcGVjdG9yOiBTdGFja0luc3BlY3Rvcik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGRpZmYgPSBjZm5EaWZmLmRpZmZUZW1wbGF0ZSh0aGlzLnRlbXBsYXRlLCBpbnNwZWN0b3IudmFsdWUpO1xuICAgIGNvbnN0IGFjY2VwdGFibGUgPSB0aGlzLmlzRGlmZkFjY2VwdGFibGUoZGlmZik7XG4gICAgaWYgKCFhY2NlcHRhYmxlKSB7XG4gICAgICAvLyBQcmludCB0aGUgZGlmZlxuICAgICAgY2ZuRGlmZi5mb3JtYXREaWZmZXJlbmNlcyhwcm9jZXNzLnN0ZGVyciwgZGlmZik7XG5cbiAgICAgIC8vIFByaW50IHRoZSBhY3R1YWwgdGVtcGxhdGVcbiAgICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxcbicpO1xuICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoSlNPTi5zdHJpbmdpZnkoaW5zcGVjdG9yLnZhbHVlLCB1bmRlZmluZWQsIDIpICsgJ1xcbicpO1xuICAgIH1cblxuICAgIHJldHVybiBhY2NlcHRhYmxlO1xuICB9XG5cbiAgcHJpdmF0ZSBpc0RpZmZBY2NlcHRhYmxlKGRpZmY6IGNmbkRpZmYuVGVtcGxhdGVEaWZmKTogYm9vbGVhbiB7XG4gICAgc3dpdGNoICh0aGlzLm1hdGNoU3R5bGUpIHtcbiAgICAgIGNhc2UgTWF0Y2hTdHlsZS5FWEFDVDpcbiAgICAgICAgcmV0dXJuIGRpZmYuZGlmZmVyZW5jZUNvdW50ID09PSAwO1xuICAgICAgY2FzZSBNYXRjaFN0eWxlLk5PX1JFUExBQ0VTOlxuICAgICAgICBmb3IgKGNvbnN0IGNoYW5nZSBvZiBPYmplY3QudmFsdWVzKGRpZmYucmVzb3VyY2VzLmNoYW5nZXMpKSB7XG4gICAgICAgICAgaWYgKGNoYW5nZS5jaGFuZ2VJbXBhY3QgPT09IGNmbkRpZmYuUmVzb3VyY2VJbXBhY3QuTUFZX1JFUExBQ0UpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgICAgICAgaWYgKGNoYW5nZS5jaGFuZ2VJbXBhY3QgPT09IGNmbkRpZmYuUmVzb3VyY2VJbXBhY3QuV0lMTF9SRVBMQUNFKSB7IHJldHVybiBmYWxzZTsgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBjaGFuZ2Ugb2YgT2JqZWN0LnZhbHVlcyhkaWZmLnBhcmFtZXRlcnMuY2hhbmdlcykpIHtcbiAgICAgICAgICBpZiAoY2hhbmdlLmlzVXBkYXRlKSB7IHJldHVybiBmYWxzZTsgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBjaGFuZ2Ugb2YgT2JqZWN0LnZhbHVlcyhkaWZmLm91dHB1dHMuY2hhbmdlcykpIHtcbiAgICAgICAgICBpZiAoY2hhbmdlLmlzVXBkYXRlKSB7IHJldHVybiBmYWxzZTsgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgY2FzZSBNYXRjaFN0eWxlLlNVUEVSU0VUOlxuICAgICAgICBmb3IgKGNvbnN0IGNoYW5nZSBvZiBPYmplY3QudmFsdWVzKGRpZmYucmVzb3VyY2VzLmNoYW5nZXMpKSB7XG4gICAgICAgICAgaWYgKGNoYW5nZS5jaGFuZ2VJbXBhY3QgIT09IGNmbkRpZmYuUmVzb3VyY2VJbXBhY3QuV0lMTF9DUkVBVEUpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IGNoYW5nZSBvZiBPYmplY3QudmFsdWVzKGRpZmYucGFyYW1ldGVycy5jaGFuZ2VzKSkge1xuICAgICAgICAgIGlmICghY2hhbmdlLmlzQWRkaXRpb24pIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IGNoYW5nZSBvZiBPYmplY3QudmFsdWVzKGRpZmYub3V0cHV0cy5jaGFuZ2VzKSkge1xuICAgICAgICAgIGlmICghY2hhbmdlLmlzQWRkaXRpb24pIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZ2V0IGRlc2NyaXB0aW9uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGB0ZW1wbGF0ZSAoJHt0aGlzLm1hdGNoU3R5bGV9KTogJHtKU09OLnN0cmluZ2lmeSh0aGlzLnRlbXBsYXRlLCBudWxsLCAyKX1gO1xuICB9XG59XG4iXX0=
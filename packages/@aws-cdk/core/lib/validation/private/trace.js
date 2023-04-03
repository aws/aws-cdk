"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportTrace = void 0;
const STARTER_LINE = '└── ';
const VERTICAL_LINE = '│';
/**
 * Utility class to generate the construct stack trace
 * for a report
 */
class ReportTrace {
    constructor(tree) {
        this.tree = tree;
    }
    /**
     * Return a JSON representation of the construct trace
     */
    formatJson(constructPath) {
        return this.trace(constructPath);
    }
    /**
     * This will render something like this:
     *
     *   Creation Stack:
     *     └──  MyStack (MyStack)
     *          │ Library: aws-cdk-lib.Stack
     *          │ Library Version: 2.50.0
     *          │ Location: Object.<anonymous> (/home/hallcor/tmp/cdk-tmp-app/src/main.ts:25:20)
     *          └──  MyCustomL3Construct (MyStack/MyCustomL3Construct)
     *               │ Library: N/A - (Local Construct)
     *               │ Library Version: N/A
     *               │ Location: new MyStack (/home/hallcor/tmp/cdk-tmp-app/src/main.ts:15:20)
     *               └──  Bucket (MyStack/MyCustomL3Construct/Bucket)
     *                    │ Library: aws-cdk-lib/aws-s3.Bucket
     *                    │ Library Version: 2.50.0
     *                    │ Location: new MyCustomL3Construct (/home/hallcor/tmp/cdk-tmp-app/src/main.ts:9:20)/
     */
    formatPrettyPrinted(constructPath) {
        const trace = this.formatJson(constructPath);
        return this.renderPrettyPrintedTraceInfo(trace);
    }
    renderPrettyPrintedTraceInfo(info, indent, start = STARTER_LINE) {
        const notAvailableMessage = '\tConstruct trace not available. Rerun with `--debug` to see trace information';
        if (info) {
            const indentation = indent ?? ' '.repeat(STARTER_LINE.length + 1);
            const result = [
                `${start} ${info?.id} (${info?.path})`,
                `${indentation}${VERTICAL_LINE} Construct: ${info?.construct}`,
                `${indentation}${VERTICAL_LINE} Library Version: ${info?.libraryVersion}`,
                `${indentation}${VERTICAL_LINE} Location: ${info?.location}`,
                ...info?.child ? [this.renderPrettyPrintedTraceInfo(info?.child, ' '.repeat(indentation.length + STARTER_LINE.length + 1), indentation + STARTER_LINE)] : [],
            ];
            return result.join('\n\t');
        }
        return notAvailableMessage;
    }
    trace(constructPath) {
        if (constructPath) {
            const treeNode = this.tree.getTreeNode(constructPath);
            if (treeNode) {
                return this.tree.getTrace(treeNode);
            }
        }
        return;
    }
}
exports.ReportTrace = ReportTrace;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0cmFjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUM7QUFDNUIsTUFBTSxhQUFhLEdBQUcsR0FBRyxDQUFDO0FBRTFCOzs7R0FHRztBQUNILE1BQWEsV0FBVztJQUN0QixZQUE2QixJQUFtQjtRQUFuQixTQUFJLEdBQUosSUFBSSxDQUFlO0lBQUcsQ0FBQztJQUVwRDs7T0FFRztJQUNJLFVBQVUsQ0FBQyxhQUFzQjtRQUN0QyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7O09BZ0JHO0lBQ0ksbUJBQW1CLENBQUMsYUFBc0I7UUFDL0MsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUM3QyxPQUFPLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRU8sNEJBQTRCLENBQUMsSUFBcUIsRUFBRSxNQUFlLEVBQUUsUUFBZ0IsWUFBWTtRQUN2RyxNQUFNLG1CQUFtQixHQUFHLGdGQUFnRixDQUFDO1FBQzdHLElBQUksSUFBSSxFQUFFO1lBQ1IsTUFBTSxXQUFXLEdBQUcsTUFBTSxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoRSxNQUFNLE1BQU0sR0FBYTtnQkFDdkIsR0FBRyxLQUFLLElBQUksSUFBSSxFQUFFLEVBQUUsS0FBSyxJQUFJLEVBQUUsSUFBSSxHQUFHO2dCQUN0QyxHQUFHLFdBQVcsR0FBRyxhQUFhLGVBQWUsSUFBSSxFQUFFLFNBQVMsRUFBRTtnQkFDOUQsR0FBRyxXQUFXLEdBQUcsYUFBYSxxQkFBcUIsSUFBSSxFQUFFLGNBQWMsRUFBRTtnQkFDekUsR0FBRyxXQUFXLEdBQUcsYUFBYSxjQUFjLElBQUksRUFBRSxRQUFRLEVBQUU7Z0JBQzVELEdBQUcsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUMsWUFBWSxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsRUFBRSxXQUFXLEdBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTthQUN2SixDQUFDO1lBQ0YsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzVCO1FBQ0QsT0FBTyxtQkFBbUIsQ0FBQztJQUM3QixDQUFDO0lBRU8sS0FBSyxDQUFDLGFBQXNCO1FBQ2xDLElBQUksYUFBYSxFQUFFO1lBQ2pCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3RELElBQUksUUFBUSxFQUFFO2dCQUNaLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDckM7U0FDRjtRQUNELE9BQU87SUFDVCxDQUFDO0NBQ0Y7QUF6REQsa0NBeURDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0VHJlZSwgQ29uc3RydWN0VHJhY2UgfSBmcm9tICcuL2NvbnN0cnVjdC10cmVlJztcblxuY29uc3QgU1RBUlRFUl9MSU5FID0gJ+KUlOKUgOKUgCAnO1xuY29uc3QgVkVSVElDQUxfTElORSA9ICfilIInO1xuXG4vKipcbiAqIFV0aWxpdHkgY2xhc3MgdG8gZ2VuZXJhdGUgdGhlIGNvbnN0cnVjdCBzdGFjayB0cmFjZVxuICogZm9yIGEgcmVwb3J0XG4gKi9cbmV4cG9ydCBjbGFzcyBSZXBvcnRUcmFjZSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgdHJlZTogQ29uc3RydWN0VHJlZSkge31cblxuICAvKipcbiAgICogUmV0dXJuIGEgSlNPTiByZXByZXNlbnRhdGlvbiBvZiB0aGUgY29uc3RydWN0IHRyYWNlXG4gICAqL1xuICBwdWJsaWMgZm9ybWF0SnNvbihjb25zdHJ1Y3RQYXRoPzogc3RyaW5nKTogQ29uc3RydWN0VHJhY2UgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLnRyYWNlKGNvbnN0cnVjdFBhdGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgd2lsbCByZW5kZXIgc29tZXRoaW5nIGxpa2UgdGhpczpcbiAgICpcbiAgICogICBDcmVhdGlvbiBTdGFjazpcbiAgICogICAgIOKUlOKUgOKUgCAgTXlTdGFjayAoTXlTdGFjaylcbiAgICogICAgICAgICAg4pSCIExpYnJhcnk6IGF3cy1jZGstbGliLlN0YWNrXG4gICAqICAgICAgICAgIOKUgiBMaWJyYXJ5IFZlcnNpb246IDIuNTAuMFxuICAgKiAgICAgICAgICDilIIgTG9jYXRpb246IE9iamVjdC48YW5vbnltb3VzPiAoL2hvbWUvaGFsbGNvci90bXAvY2RrLXRtcC1hcHAvc3JjL21haW4udHM6MjU6MjApXG4gICAqICAgICAgICAgIOKUlOKUgOKUgCAgTXlDdXN0b21MM0NvbnN0cnVjdCAoTXlTdGFjay9NeUN1c3RvbUwzQ29uc3RydWN0KVxuICAgKiAgICAgICAgICAgICAgIOKUgiBMaWJyYXJ5OiBOL0EgLSAoTG9jYWwgQ29uc3RydWN0KVxuICAgKiAgICAgICAgICAgICAgIOKUgiBMaWJyYXJ5IFZlcnNpb246IE4vQVxuICAgKiAgICAgICAgICAgICAgIOKUgiBMb2NhdGlvbjogbmV3IE15U3RhY2sgKC9ob21lL2hhbGxjb3IvdG1wL2Nkay10bXAtYXBwL3NyYy9tYWluLnRzOjE1OjIwKVxuICAgKiAgICAgICAgICAgICAgIOKUlOKUgOKUgCAgQnVja2V0IChNeVN0YWNrL015Q3VzdG9tTDNDb25zdHJ1Y3QvQnVja2V0KVxuICAgKiAgICAgICAgICAgICAgICAgICAg4pSCIExpYnJhcnk6IGF3cy1jZGstbGliL2F3cy1zMy5CdWNrZXRcbiAgICogICAgICAgICAgICAgICAgICAgIOKUgiBMaWJyYXJ5IFZlcnNpb246IDIuNTAuMFxuICAgKiAgICAgICAgICAgICAgICAgICAg4pSCIExvY2F0aW9uOiBuZXcgTXlDdXN0b21MM0NvbnN0cnVjdCAoL2hvbWUvaGFsbGNvci90bXAvY2RrLXRtcC1hcHAvc3JjL21haW4udHM6OToyMCkvXG4gICAqL1xuICBwdWJsaWMgZm9ybWF0UHJldHR5UHJpbnRlZChjb25zdHJ1Y3RQYXRoPzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCB0cmFjZSA9IHRoaXMuZm9ybWF0SnNvbihjb25zdHJ1Y3RQYXRoKTtcbiAgICByZXR1cm4gdGhpcy5yZW5kZXJQcmV0dHlQcmludGVkVHJhY2VJbmZvKHRyYWNlKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyUHJldHR5UHJpbnRlZFRyYWNlSW5mbyhpbmZvPzogQ29uc3RydWN0VHJhY2UsIGluZGVudD86IHN0cmluZywgc3RhcnQ6IHN0cmluZyA9IFNUQVJURVJfTElORSk6IHN0cmluZyB7XG4gICAgY29uc3Qgbm90QXZhaWxhYmxlTWVzc2FnZSA9ICdcXHRDb25zdHJ1Y3QgdHJhY2Ugbm90IGF2YWlsYWJsZS4gUmVydW4gd2l0aCBgLS1kZWJ1Z2AgdG8gc2VlIHRyYWNlIGluZm9ybWF0aW9uJztcbiAgICBpZiAoaW5mbykge1xuICAgICAgY29uc3QgaW5kZW50YXRpb24gPSBpbmRlbnQgPz8gJyAnLnJlcGVhdChTVEFSVEVSX0xJTkUubGVuZ3RoKzEpO1xuICAgICAgY29uc3QgcmVzdWx0OiBzdHJpbmdbXSA9IFtcbiAgICAgICAgYCR7c3RhcnR9ICR7aW5mbz8uaWR9ICgke2luZm8/LnBhdGh9KWAsXG4gICAgICAgIGAke2luZGVudGF0aW9ufSR7VkVSVElDQUxfTElORX0gQ29uc3RydWN0OiAke2luZm8/LmNvbnN0cnVjdH1gLFxuICAgICAgICBgJHtpbmRlbnRhdGlvbn0ke1ZFUlRJQ0FMX0xJTkV9IExpYnJhcnkgVmVyc2lvbjogJHtpbmZvPy5saWJyYXJ5VmVyc2lvbn1gLFxuICAgICAgICBgJHtpbmRlbnRhdGlvbn0ke1ZFUlRJQ0FMX0xJTkV9IExvY2F0aW9uOiAke2luZm8/LmxvY2F0aW9ufWAsXG4gICAgICAgIC4uLmluZm8/LmNoaWxkID8gW3RoaXMucmVuZGVyUHJldHR5UHJpbnRlZFRyYWNlSW5mbyhpbmZvPy5jaGlsZCwgJyAnLnJlcGVhdChpbmRlbnRhdGlvbi5sZW5ndGgrU1RBUlRFUl9MSU5FLmxlbmd0aCsxKSwgaW5kZW50YXRpb24rU1RBUlRFUl9MSU5FKV0gOiBbXSxcbiAgICAgIF07XG4gICAgICByZXR1cm4gcmVzdWx0LmpvaW4oJ1xcblxcdCcpO1xuICAgIH1cbiAgICByZXR1cm4gbm90QXZhaWxhYmxlTWVzc2FnZTtcbiAgfVxuXG4gIHByaXZhdGUgdHJhY2UoY29uc3RydWN0UGF0aD86IHN0cmluZyk6IENvbnN0cnVjdFRyYWNlIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoY29uc3RydWN0UGF0aCkge1xuICAgICAgY29uc3QgdHJlZU5vZGUgPSB0aGlzLnRyZWUuZ2V0VHJlZU5vZGUoY29uc3RydWN0UGF0aCk7XG4gICAgICBpZiAodHJlZU5vZGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJlZS5nZXRUcmFjZSh0cmVlTm9kZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxufVxuIl19
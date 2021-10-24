"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannedMetricsGenerator = void 0;
const cfnspec = require("@aws-cdk/cfnspec");
const codemaker_1 = require("codemaker");
/**
 * Generate default prop sets for canned metric
 *
 * We don't generate `cloudwatch.Metric` objects directly (because we can't
 * guarantee that all packages already properly depend on
 * `@aws-cdk/aws-cloudwatch`).
 *
 * Instead, we generate functions that return the set of properties that should
 * be passed to a `cloudwatch.Metric` to construct it.
 *
 * ----------------------------------------------------------
 *
 * Generates code similar to the following:
 *
 * ```
 * export class <Namespace>Metrics {
 *   public static <metric><statistic>(<dimensions>): Props {
 *     // ...
 *   }
 * }
 * ```
 */
class CannedMetricsGenerator {
    constructor(moduleName, namespace) {
        this.namespace = namespace;
        this.code = new codemaker_1.CodeMaker({ indentationLevel: 2 });
        this.outputFile = `${moduleName}-canned-metrics.generated.ts`;
        this.code.openFile(this.outputFile);
        this.code.line(`// Copyright 2012-${new Date().getFullYear()} Amazon.com, Inc. or its affiliates. All Rights Reserved.`);
        this.code.line();
        this.code.line('/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control');
        this.code.line();
    }
    generate() {
        let emittedOverloads = false;
        const namespaces = groupByNamespace(cfnspec.cannedMetricsForService(this.namespace));
        for (const [namespace, metrics] of Object.entries(namespaces)) {
            this.code.openBlock(`export class ${namespace}Metrics`);
            for (const metric of metrics) {
                const functionName = this.functionName(metric);
                if (metric.dimensions.length > 1) {
                    emittedOverloads = true;
                    // Generate overloads for every possible dimensions type
                    for (const dims of metric.dimensions) {
                        const dimsType = dimensionsType(dims);
                        this.code.line(`public static ${functionName}(dimensions: ${dimsType}): MetricWithDims<${dimsType}>;`);
                    }
                    this.code.openBlock(`public static ${functionName}(dimensions: any)`);
                }
                else {
                    // Else just the one type
                    this.code.openBlock(`public static ${functionName}(dimensions: ${dimensionsType(metric.dimensions[0])})`);
                }
                this.code.line('return {');
                this.code.line(`  namespace: '${metric.namespace}',`);
                this.code.line(`  metricName: '${metric.metricName}',`);
                this.code.line('  dimensions,');
                this.code.line(`  statistic: '${metric.defaultStat}',`);
                this.code.line('};');
                this.code.closeBlock();
            }
            this.code.closeBlock();
        }
        if (emittedOverloads) {
            this.emitTypeDef();
        }
        return Object.keys(namespaces).length > 0;
    }
    /**
     * Saves the generated file.
     */
    async save(dir) {
        this.code.closeFile(this.outputFile);
        return this.code.save(dir);
    }
    functionName(metric) {
        return makeIdentifier(codemaker_1.toCamelCase(`${metric.metricName}${metric.defaultStat}`));
    }
    emitTypeDef() {
        this.code.line('type MetricWithDims<D> = { namespace: string, metricName: string, statistic: string, dimensions: D };');
    }
}
exports.CannedMetricsGenerator = CannedMetricsGenerator;
/**
 * If not a valid identifier, prefix with a '_'
 */
function makeIdentifier(s) {
    // Strip invalid characters from identifier
    s = s.replace(/([^a-zA-Z0-9_])/g, '');
    // If it doesn't start with an alpha char, prefix with _
    s = s.replace(/^([^a-zA-Z_])/, '_$1');
    return s;
}
/**
 * Return an anonymous TypeScript type that would accept the given dimensions
 */
function dimensionsType(dims) {
    return `{ ${dims.map(d => `${d}: string`).join(', ')} }`;
}
function groupByNamespace(metrics) {
    var _a;
    const ret = {};
    for (const metric of metrics) {
        // Always starts with 'AWS/' (except when it doesn't, looking at you `CloudWatchSynthetics`)
        const namespace = metric.namespace.replace(/^AWS\//, '');
        ((_a = ret[namespace]) !== null && _a !== void 0 ? _a : (ret[namespace] = [])).push(metric);
    }
    return ret;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FubmVkLW1ldHJpY3MtZ2VuZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2FubmVkLW1ldHJpY3MtZ2VuZXJhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDRDQUE0QztBQUM1Qyx5Q0FBbUQ7QUFHbkQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFCRztBQUNILE1BQWEsc0JBQXNCO0lBSWpDLFlBQVksVUFBa0IsRUFBbUIsU0FBaUI7UUFBakIsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUhqRCxTQUFJLEdBQUcsSUFBSSxxQkFBUyxDQUFDLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUk3RCxJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsVUFBVSw4QkFBOEIsQ0FBQztRQUM5RCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFcEMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXFCLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLDJEQUEyRCxDQUFDLENBQUM7UUFDekgsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnR0FBZ0csQ0FBQyxDQUFDO1FBQ2pILElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUVNLFFBQVE7UUFDYixJQUFJLGdCQUFnQixHQUFHLEtBQUssQ0FBQztRQUU3QixNQUFNLFVBQVUsR0FBRyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDckYsS0FBSyxNQUFNLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDN0QsSUFBSSxDQUFD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LEtBQUssQ0FBQyxDQUFDO0lBQ3RDLE9BQU8sQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQUVEOztHQUVHO0FBQ0gsU0FBUyxjQUFjLENBQUMsSUFBYztJQUNwQyxPQUFPLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztBQUMzRCxDQUFDO0FBRUQsU0FBUyxnQkFBZ0IsQ0FBQyxPQUErQjs7SUFDdkQsTUFBTSxHQUFHLEdBQTJDLEVBQUUsQ0FBQztJQUN2RCxLQUFLLE1BQU0sTUFBTSxJQUFJLE9BQU8sRUFBRTtRQUM1Qiw0RkFBNEY7UUFDNUYsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3pELE9BQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxtQ0FBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUN4RDtJQUNELE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNmbnNwZWMgZnJvbSAnQGF3cy1jZGsvY2Zuc3BlYyc7XG5pbXBvcnQgeyBDb2RlTWFrZXIsIHRvQ2FtZWxDYXNlIH0gZnJvbSAnY29kZW1ha2VyJztcblxuXG4vKipcbiAqIEdlbmVyYXRlIGRlZmF1bHQgcHJvcCBzZXRzIGZvciBjYW5uZWQgbWV0cmljXG4gKlxuICogV2UgZG9uJ3QgZ2VuZXJhdGUgYGNsb3Vkd2F0Y2guTWV0cmljYCBvYmplY3RzIGRpcmVjdGx5IChiZWNhdXNlIHdlIGNhbid0XG4gKiBndWFyYW50ZWUgdGhhdCBhbGwgcGFja2FnZXMgYWxyZWFkeSBwcm9wZXJseSBkZXBlbmQgb25cbiAqIGBAYXdzLWNkay9hd3MtY2xvdWR3YXRjaGApLlxuICpcbiAqIEluc3RlYWQsIHdlIGdlbmVyYXRlIGZ1bmN0aW9ucyB0aGF0IHJldHVybiB0aGUgc2V0IG9mIHByb3BlcnRpZXMgdGhhdCBzaG91bGRcbiAqIGJlIHBhc3NlZCB0byBhIGBjbG91ZHdhdGNoLk1ldHJpY2AgdG8gY29uc3RydWN0IGl0LlxuICpcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqXG4gKiBHZW5lcmF0ZXMgY29kZSBzaW1pbGFyIHRvIHRoZSBmb2xsb3dpbmc6XG4gKlxuICogYGBgXG4gKiBleHBvcnQgY2xhc3MgPE5hbWVzcGFjZT5NZXRyaWNzIHtcbiAqICAgcHVibGljIHN0YXRpYyA8bWV0cmljPjxzdGF0aXN0aWM+KDxkaW1lbnNpb25zPik6IFByb3BzIHtcbiAqICAgICAvLyAuLi5cbiAqICAgfVxuICogfVxuICogYGBgXG4gKi9cbmV4cG9ydCBjbGFzcyBDYW5uZWRNZXRyaWNzR2VuZXJhdG9yIHtcbiAgcHJpdmF0ZSByZWFkb25seSBjb2RlID0gbmV3IENvZGVNYWtlcih7IGluZGVudGF0aW9uTGV2ZWw6IDIgfSk7XG4gIHByaXZhdGUgcmVhZG9ubHkgb3V0cHV0RmlsZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKG1vZHVsZU5hbWU6IHN0cmluZywgcHJpdmF0ZSByZWFkb25seSBuYW1lc3BhY2U6IHN0cmluZykge1xuICAgIHRoaXMub3V0cHV0RmlsZSA9IGAke21vZHVsZU5hbWV9LWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZC50c2A7XG4gICAgdGhpcy5jb2RlLm9wZW5GaWxlKHRoaXMub3V0cHV0RmlsZSk7XG5cbiAgICB0aGlzLmNvZGUubGluZShgLy8gQ29weXJpZ2h0IDIwMTItJHtuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCl9IEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuYCk7XG4gICAgdGhpcy5jb2RlLmxpbmUoKTtcbiAgICB0aGlzLmNvZGUubGluZSgnLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqLyAvLyBUaGlzIGlzIGdlbmVyYXRlZCBjb2RlIC0gbGluZSBsZW5ndGhzIGFyZSBkaWZmaWN1bHQgdG8gY29udHJvbCcpO1xuICAgIHRoaXMuY29kZS5saW5lKCk7XG4gIH1cblxuICBwdWJsaWMgZ2VuZXJhdGUoKTogYm9vbGVhbiB7XG4gICAgbGV0IGVtaXR0ZWRPdmVybG9hZHMgPSBmYWxzZTtcblxuICAgIGNvbnN0IG5hbWVzcGFjZXMgPSBncm91cEJ5TmFtZXNwYWNlKGNmbnNwZWMuY2FubmVkTWV0cmljc0ZvclNlcnZpY2UodGhpcy5uYW1lc3BhY2UpKTtcbiAgICBmb3IgKGNvbnN0IFtuYW1lc3BhY2UsIG1ldHJpY3NdIG9mIE9iamVjdC5lbnRyaWVzKG5hbWVzcGFjZXMpKSB7XG4gICAgICB0aGlzLmNvZGUub3BlbkJsb2NrKGBleHBvcnQgY2xhc3MgJHtuYW1lc3BhY2V9TWV0cmljc2ApO1xuXG4gICAgICBmb3IgKGNvbnN0IG1ldHJpYyBvZiBtZXRyaWNzKSB7XG4gICAgICAgIGNvbnN0IGZ1bmN0aW9uTmFtZSA9IHRoaXMuZnVuY3Rpb25OYW1lKG1ldHJpYyk7XG5cbiAgICAgICAgaWYgKG1ldHJpYy5kaW1lbnNpb25zLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICBlbWl0dGVkT3ZlcmxvYWRzID0gdHJ1ZTtcbiAgICAgICAgICAvLyBHZW5lcmF0ZSBvdmVybG9hZHMgZm9yIGV2ZXJ5IHBvc3NpYmxlIGRpbWVuc2lvbnMgdHlwZVxuICAgICAgICAgIGZvciAoY29uc3QgZGltcyBvZiBtZXRyaWMuZGltZW5zaW9ucykge1xuICAgICAgICAgICAgY29uc3QgZGltc1R5cGUgPSBkaW1lbnNpb25zVHlwZShkaW1zKTtcbiAgICAgICAgICAgIHRoaXMuY29kZS5saW5lKGBwdWJsaWMgc3RhdGljICR7ZnVuY3Rpb25OYW1lfShkaW1lbnNpb25zOiAke2RpbXNUeXBlfSk6IE1ldHJpY1dpdGhEaW1zPCR7ZGltc1R5cGV9PjtgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5jb2RlLm9wZW5CbG9jayhgcHVibGljIHN0YXRpYyAke2Z1bmN0aW9uTmFtZX0oZGltZW5zaW9uczogYW55KWApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIEVsc2UganVzdCB0aGUgb25lIHR5cGVcbiAgICAgICAgICB0aGlzLmNvZGUub3BlbkJsb2NrKGBwdWJsaWMgc3RhdGljICR7ZnVuY3Rpb25OYW1lfShkaW1lbnNpb25zOiAke2RpbWVuc2lvbnNUeXBlKG1ldHJpYy5kaW1lbnNpb25zWzBdKX0pYCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvZGUubGluZSgncmV0dXJuIHsnKTtcbiAgICAgICAgdGhpcy5jb2RlLmxpbmUoYCAgbmFtZXNwYWNlOiAnJHttZXRyaWMubmFtZXNwYWNlfScsYCk7XG4gICAgICAgIHRoaXMuY29kZS5saW5lKGAgIG1ldHJpY05hbWU6ICcke21ldHJpYy5tZXRyaWNOYW1lfScsYCk7XG4gICAgICAgIHRoaXMuY29kZS5saW5lKCcgIGRpbWVuc2lvbnMsJyk7XG4gICAgICAgIHRoaXMuY29kZS5saW5lKGAgIHN0YXRpc3RpYzogJyR7bWV0cmljLmRlZmF1bHRTdGF0fScsYCk7XG4gICAgICAgIHRoaXMuY29kZS5saW5lKCd9OycpO1xuICAgICAgICB0aGlzLmNvZGUuY2xvc2VCbG9jaygpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNvZGUuY2xvc2VCbG9jaygpO1xuICAgIH1cblxuICAgIGlmIChlbWl0dGVkT3ZlcmxvYWRzKSB7XG4gICAgICB0aGlzLmVtaXRUeXBlRGVmKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKG5hbWVzcGFjZXMpLmxlbmd0aCA+IDA7XG4gIH1cblxuICAvKipcbiAgICogU2F2ZXMgdGhlIGdlbmVyYXRlZCBmaWxlLlxuICAgKi9cbiAgcHVibGljIGFzeW5jIHNhdmUoZGlyOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgdGhpcy5jb2RlLmNsb3NlRmlsZSh0aGlzLm91dHB1dEZpbGUpO1xuICAgIHJldHVybiB0aGlzLmNvZGUuc2F2ZShkaXIpO1xuICB9XG5cbiAgcHJpdmF0ZSBmdW5jdGlvbk5hbWUobWV0cmljOiBjZm5zcGVjLkNhbm5lZE1ldHJpYykge1xuICAgIHJldHVybiBtYWtlSWRlbnRpZmllcih0b0NhbWVsQ2FzZShgJHttZXRyaWMubWV0cmljTmFtZX0ke21ldHJpYy5kZWZhdWx0U3RhdH1gKSk7XG4gIH1cblxuICBwcml2YXRlIGVtaXRUeXBlRGVmKCkge1xuICAgIHRoaXMuY29kZS5saW5lKCd0eXBlIE1ldHJpY1dpdGhEaW1zPEQ+ID0geyBuYW1lc3BhY2U6IHN0cmluZywgbWV0cmljTmFtZTogc3RyaW5nLCBzdGF0aXN0aWM6IHN0cmluZywgZGltZW5zaW9uczogRCB9OycpO1xuICB9XG59XG5cbi8qKlxuICogSWYgbm90IGEgdmFsaWQgaWRlbnRpZmllciwgcHJlZml4IHdpdGggYSAnXydcbiAqL1xuZnVuY3Rpb24gbWFrZUlkZW50aWZpZXIoczogc3RyaW5nKSB7XG4gIC8vIFN0cmlwIGludmFsaWQgY2hhcmFjdGVycyBmcm9tIGlkZW50aWZpZXJcbiAgcyA9IHMucmVwbGFjZSgvKFteYS16QS1aMC05X10pL2csICcnKTtcbiAgLy8gSWYgaXQgZG9lc24ndCBzdGFydCB3aXRoIGFuIGFscGhhIGNoYXIsIHByZWZpeCB3aXRoIF9cbiAgcyA9IHMucmVwbGFjZSgvXihbXmEtekEtWl9dKS8sICdfJDEnKTtcbiAgcmV0dXJuIHM7XG59XG5cbi8qKlxuICogUmV0dXJuIGFuIGFub255bW91cyBUeXBlU2NyaXB0IHR5cGUgdGhhdCB3b3VsZCBhY2NlcHQgdGhlIGdpdmVuIGRpbWVuc2lvbnNcbiAqL1xuZnVuY3Rpb24gZGltZW5zaW9uc1R5cGUoZGltczogc3RyaW5nW10pIHtcbiAgcmV0dXJuIGB7ICR7ZGltcy5tYXAoZCA9PiBgJHtkfTogc3RyaW5nYCkuam9pbignLCAnKX0gfWA7XG59XG5cbmZ1bmN0aW9uIGdyb3VwQnlOYW1lc3BhY2UobWV0cmljczogY2Zuc3BlYy5DYW5uZWRNZXRyaWNbXSk6IFJlY29yZDxzdHJpbmcsIGNmbnNwZWMuQ2FubmVkTWV0cmljW10+IHtcbiAgY29uc3QgcmV0OiBSZWNvcmQ8c3RyaW5nLCBjZm5zcGVjLkNhbm5lZE1ldHJpY1tdPiA9IHt9O1xuICBmb3IgKGNvbnN0IG1ldHJpYyBvZiBtZXRyaWNzKSB7XG4gICAgLy8gQWx3YXlzIHN0YXJ0cyB3aXRoICdBV1MvJyAoZXhjZXB0IHdoZW4gaXQgZG9lc24ndCwgbG9va2luZyBhdCB5b3UgYENsb3VkV2F0Y2hTeW50aGV0aWNzYClcbiAgICBjb25zdCBuYW1lc3BhY2UgPSBtZXRyaWMubmFtZXNwYWNlLnJlcGxhY2UoL15BV1NcXC8vLCAnJyk7XG4gICAgKHJldFtuYW1lc3BhY2VdID8/IChyZXRbbmFtZXNwYWNlXSA9IFtdKSkucHVzaChtZXRyaWMpO1xuICB9XG4gIHJldHVybiByZXQ7XG59Il19
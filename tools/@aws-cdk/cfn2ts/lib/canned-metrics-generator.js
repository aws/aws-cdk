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
                this.code.line('  dimensionsMap: dimensions,');
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
        return makeIdentifier((0, codemaker_1.toCamelCase)(`${metric.metricName}${metric.defaultStat}`));
    }
    emitTypeDef() {
        this.code.line('type MetricWithDims<D> = { namespace: string, metricName: string, statistic: string, dimensionsMap: D };');
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
    return `{ ${dims.map(d => `${escapeIdentifier(d)}: string`).join(', ')} }`;
}
/**
 * Escape identifiers
 *
 * Most services choose nice and neat ASCII characters for their dimension
 * names, but of course you know some won't.
 */
function escapeIdentifier(ident) {
    return ident.match(/[^a-zA-Z0-9]/) ? `'${ident}'` : ident;
}
function groupByNamespace(metrics) {
    const ret = {};
    for (const metric of metrics) {
        const namespace = sanitizeNamespace(metric.namespace);
        (ret[namespace] ?? (ret[namespace] = [])).push(metric);
    }
    return ret;
}
/**
 * Sanitize metrics namespace
 *
 * - Most namespaces look like 'AWS/<ServiceName>'.
 * - 'AWS/CloudWatch/MetricStreams' has 2 slashes in it.
 * - 'CloudWatchSynthetics' doesn't have a slash at all.
 */
function sanitizeNamespace(namespace) {
    return namespace.replace(/^AWS\//, '').replace('/', '');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FubmVkLW1ldHJpY3MtZ2VuZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2FubmVkLW1ldHJpY3MtZ2VuZXJhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDRDQUE0QztBQUM1Qyx5Q0FBbUQ7QUFFbkQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFCRztBQUNILE1BQWEsc0JBQXNCO0lBSWpDLFlBQVksVUFBa0IsRUFBbUIsU0FBaUI7UUFBakIsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUZqRCxTQUFJLEdBQUcsSUFBSSxxQkFBUyxDQUFDLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUc3RCxJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsVUFBVSw4QkFBOEIsQ0FBQztRQUM5RCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFcEMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXFCLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLDJEQUEyRCxDQUFDLENBQUM7UUFDekgsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnR0FBZ0csQ0FBQyxDQUFDO1FBQ2pILElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUVNLFFBQVE7UUFDYixJQUFJLGdCQUFnQixHQUFHLEtBQUssQ0FBQztRQUU3QixNQUFNLFVBQVUsR0FBRyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDckYsS0FBSyxNQUFNLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDN0QsSUFBSSxDQUFD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QWUsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN0QyxPQUFPLENBQUMsQ0FBQztBQUNYLENBQUM7QUFFRDs7R0FFRztBQUNILFNBQVMsY0FBYyxDQUFDLElBQWM7SUFDcEMsT0FBTyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztBQUM3RSxDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFTLGdCQUFnQixDQUFDLEtBQWE7SUFDckMsT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDNUQsQ0FBQztBQUVELFNBQVMsZ0JBQWdCLENBQUMsT0FBK0I7SUFDdkQsTUFBTSxHQUFHLEdBQTJDLEVBQUUsQ0FBQztJQUN2RCxLQUFLLE1BQU0sTUFBTSxJQUFJLE9BQU8sRUFBRTtRQUM1QixNQUFNLFNBQVMsR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdEQsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDeEQ7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxTQUFTLGlCQUFpQixDQUFDLFNBQWlCO0lBQzFDLE9BQU8sU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUMxRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2Zuc3BlYyBmcm9tICdAYXdzLWNkay9jZm5zcGVjJztcbmltcG9ydCB7IENvZGVNYWtlciwgdG9DYW1lbENhc2UgfSBmcm9tICdjb2RlbWFrZXInO1xuXG4vKipcbiAqIEdlbmVyYXRlIGRlZmF1bHQgcHJvcCBzZXRzIGZvciBjYW5uZWQgbWV0cmljXG4gKlxuICogV2UgZG9uJ3QgZ2VuZXJhdGUgYGNsb3Vkd2F0Y2guTWV0cmljYCBvYmplY3RzIGRpcmVjdGx5IChiZWNhdXNlIHdlIGNhbid0XG4gKiBndWFyYW50ZWUgdGhhdCBhbGwgcGFja2FnZXMgYWxyZWFkeSBwcm9wZXJseSBkZXBlbmQgb25cbiAqIGBAYXdzLWNkay9hd3MtY2xvdWR3YXRjaGApLlxuICpcbiAqIEluc3RlYWQsIHdlIGdlbmVyYXRlIGZ1bmN0aW9ucyB0aGF0IHJldHVybiB0aGUgc2V0IG9mIHByb3BlcnRpZXMgdGhhdCBzaG91bGRcbiAqIGJlIHBhc3NlZCB0byBhIGBjbG91ZHdhdGNoLk1ldHJpY2AgdG8gY29uc3RydWN0IGl0LlxuICpcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqXG4gKiBHZW5lcmF0ZXMgY29kZSBzaW1pbGFyIHRvIHRoZSBmb2xsb3dpbmc6XG4gKlxuICogYGBgXG4gKiBleHBvcnQgY2xhc3MgPE5hbWVzcGFjZT5NZXRyaWNzIHtcbiAqICAgcHVibGljIHN0YXRpYyA8bWV0cmljPjxzdGF0aXN0aWM+KDxkaW1lbnNpb25zPik6IFByb3BzIHtcbiAqICAgICAvLyAuLi5cbiAqICAgfVxuICogfVxuICogYGBgXG4gKi9cbmV4cG9ydCBjbGFzcyBDYW5uZWRNZXRyaWNzR2VuZXJhdG9yIHtcbiAgcHVibGljIHJlYWRvbmx5IG91dHB1dEZpbGU6IHN0cmluZztcbiAgcHJpdmF0ZSByZWFkb25seSBjb2RlID0gbmV3IENvZGVNYWtlcih7IGluZGVudGF0aW9uTGV2ZWw6IDIgfSk7XG5cbiAgY29uc3RydWN0b3IobW9kdWxlTmFtZTogc3RyaW5nLCBwcml2YXRlIHJlYWRvbmx5IG5hbWVzcGFjZTogc3RyaW5nKSB7XG4gICAgdGhpcy5vdXRwdXRGaWxlID0gYCR7bW9kdWxlTmFtZX0tY2FubmVkLW1ldHJpY3MuZ2VuZXJhdGVkLnRzYDtcbiAgICB0aGlzLmNvZGUub3BlbkZpbGUodGhpcy5vdXRwdXRGaWxlKTtcblxuICAgIHRoaXMuY29kZS5saW5lKGAvLyBDb3B5cmlnaHQgMjAxMi0ke25ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKX0gQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5gKTtcbiAgICB0aGlzLmNvZGUubGluZSgpO1xuICAgIHRoaXMuY29kZS5saW5lKCcvKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovIC8vIFRoaXMgaXMgZ2VuZXJhdGVkIGNvZGUgLSBsaW5lIGxlbmd0aHMgYXJlIGRpZmZpY3VsdCB0byBjb250cm9sJyk7XG4gICAgdGhpcy5jb2RlLmxpbmUoKTtcbiAgfVxuXG4gIHB1YmxpYyBnZW5lcmF0ZSgpOiBib29sZWFuIHtcbiAgICBsZXQgZW1pdHRlZE92ZXJsb2FkcyA9IGZhbHNlO1xuXG4gICAgY29uc3QgbmFtZXNwYWNlcyA9IGdyb3VwQnlOYW1lc3BhY2UoY2Zuc3BlYy5jYW5uZWRNZXRyaWNzRm9yU2VydmljZSh0aGlzLm5hbWVzcGFjZSkpO1xuICAgIGZvciAoY29uc3QgW25hbWVzcGFjZSwgbWV0cmljc10gb2YgT2JqZWN0LmVudHJpZXMobmFtZXNwYWNlcykpIHtcbiAgICAgIHRoaXMuY29kZS5vcGVuQmxvY2soYGV4cG9ydCBjbGFzcyAke25hbWVzcGFjZX1NZXRyaWNzYCk7XG5cbiAgICAgIGZvciAoY29uc3QgbWV0cmljIG9mIG1ldHJpY3MpIHtcbiAgICAgICAgY29uc3QgZnVuY3Rpb25OYW1lID0gdGhpcy5mdW5jdGlvbk5hbWUobWV0cmljKTtcblxuICAgICAgICBpZiAobWV0cmljLmRpbWVuc2lvbnMubGVuZ3RoID4gMSkge1xuICAgICAgICAgIGVtaXR0ZWRPdmVybG9hZHMgPSB0cnVlO1xuICAgICAgICAgIC8vIEdlbmVyYXRlIG92ZXJsb2FkcyBmb3IgZXZlcnkgcG9zc2libGUgZGltZW5zaW9ucyB0eXBlXG4gICAgICAgICAgZm9yIChjb25zdCBkaW1zIG9mIG1ldHJpYy5kaW1lbnNpb25zKSB7XG4gICAgICAgICAgICBjb25zdCBkaW1zVHlwZSA9IGRpbWVuc2lvbnNUeXBlKGRpbXMpO1xuICAgICAgICAgICAgdGhpcy5jb2RlLmxpbmUoYHB1YmxpYyBzdGF0aWMgJHtmdW5jdGlvbk5hbWV9KGRpbWVuc2lvbnM6ICR7ZGltc1R5cGV9KTogTWV0cmljV2l0aERpbXM8JHtkaW1zVHlwZX0+O2ApO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmNvZGUub3BlbkJsb2NrKGBwdWJsaWMgc3RhdGljICR7ZnVuY3Rpb25OYW1lfShkaW1lbnNpb25zOiBhbnkpYCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gRWxzZSBqdXN0IHRoZSBvbmUgdHlwZVxuICAgICAgICAgIHRoaXMuY29kZS5vcGVuQmxvY2soYHB1YmxpYyBzdGF0aWMgJHtmdW5jdGlvbk5hbWV9KGRpbWVuc2lvbnM6ICR7ZGltZW5zaW9uc1R5cGUobWV0cmljLmRpbWVuc2lvbnNbMF0pfSlgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29kZS5saW5lKCdyZXR1cm4geycpO1xuICAgICAgICB0aGlzLmNvZGUubGluZShgICBuYW1lc3BhY2U6ICcke21ldHJpYy5uYW1lc3BhY2V9JyxgKTtcbiAgICAgICAgdGhpcy5jb2RlLmxpbmUoYCAgbWV0cmljTmFtZTogJyR7bWV0cmljLm1ldHJpY05hbWV9JyxgKTtcbiAgICAgICAgdGhpcy5jb2RlLmxpbmUoJyAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucywnKTtcbiAgICAgICAgdGhpcy5jb2RlLmxpbmUoYCAgc3RhdGlzdGljOiAnJHttZXRyaWMuZGVmYXVsdFN0YXR9JyxgKTtcbiAgICAgICAgdGhpcy5jb2RlLmxpbmUoJ307Jyk7XG4gICAgICAgIHRoaXMuY29kZS5jbG9zZUJsb2NrKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY29kZS5jbG9zZUJsb2NrKCk7XG4gICAgfVxuXG4gICAgaWYgKGVtaXR0ZWRPdmVybG9hZHMpIHtcbiAgICAgIHRoaXMuZW1pdFR5cGVEZWYoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gT2JqZWN0LmtleXMobmFtZXNwYWNlcykubGVuZ3RoID4gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTYXZlcyB0aGUgZ2VuZXJhdGVkIGZpbGUuXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgc2F2ZShkaXI6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICB0aGlzLmNvZGUuY2xvc2VGaWxlKHRoaXMub3V0cHV0RmlsZSk7XG4gICAgcmV0dXJuIHRoaXMuY29kZS5zYXZlKGRpcik7XG4gIH1cblxuICBwcml2YXRlIGZ1bmN0aW9uTmFtZShtZXRyaWM6IGNmbnNwZWMuQ2FubmVkTWV0cmljKSB7XG4gICAgcmV0dXJuIG1ha2VJZGVudGlmaWVyKHRvQ2FtZWxDYXNlKGAke21ldHJpYy5tZXRyaWNOYW1lfSR7bWV0cmljLmRlZmF1bHRTdGF0fWApKTtcbiAgfVxuXG4gIHByaXZhdGUgZW1pdFR5cGVEZWYoKSB7XG4gICAgdGhpcy5jb2RlLmxpbmUoJ3R5cGUgTWV0cmljV2l0aERpbXM8RD4gPSB7IG5hbWVzcGFjZTogc3RyaW5nLCBtZXRyaWNOYW1lOiBzdHJpbmcsIHN0YXRpc3RpYzogc3RyaW5nLCBkaW1lbnNpb25zTWFwOiBEIH07Jyk7XG4gIH1cbn1cblxuLyoqXG4gKiBJZiBub3QgYSB2YWxpZCBpZGVudGlmaWVyLCBwcmVmaXggd2l0aCBhICdfJ1xuICovXG5mdW5jdGlvbiBtYWtlSWRlbnRpZmllcihzOiBzdHJpbmcpIHtcbiAgLy8gU3RyaXAgaW52YWxpZCBjaGFyYWN0ZXJzIGZyb20gaWRlbnRpZmllclxuICBzID0gcy5yZXBsYWNlKC8oW15hLXpBLVowLTlfXSkvZywgJycpO1xuICAvLyBJZiBpdCBkb2Vzbid0IHN0YXJ0IHdpdGggYW4gYWxwaGEgY2hhciwgcHJlZml4IHdpdGggX1xuICBzID0gcy5yZXBsYWNlKC9eKFteYS16QS1aX10pLywgJ18kMScpO1xuICByZXR1cm4gcztcbn1cblxuLyoqXG4gKiBSZXR1cm4gYW4gYW5vbnltb3VzIFR5cGVTY3JpcHQgdHlwZSB0aGF0IHdvdWxkIGFjY2VwdCB0aGUgZ2l2ZW4gZGltZW5zaW9uc1xuICovXG5mdW5jdGlvbiBkaW1lbnNpb25zVHlwZShkaW1zOiBzdHJpbmdbXSkge1xuICByZXR1cm4gYHsgJHtkaW1zLm1hcChkID0+IGAke2VzY2FwZUlkZW50aWZpZXIoZCl9OiBzdHJpbmdgKS5qb2luKCcsICcpfSB9YDtcbn1cblxuLyoqXG4gKiBFc2NhcGUgaWRlbnRpZmllcnNcbiAqXG4gKiBNb3N0IHNlcnZpY2VzIGNob29zZSBuaWNlIGFuZCBuZWF0IEFTQ0lJIGNoYXJhY3RlcnMgZm9yIHRoZWlyIGRpbWVuc2lvblxuICogbmFtZXMsIGJ1dCBvZiBjb3Vyc2UgeW91IGtub3cgc29tZSB3b24ndC5cbiAqL1xuZnVuY3Rpb24gZXNjYXBlSWRlbnRpZmllcihpZGVudDogc3RyaW5nKSB7XG4gIHJldHVybiBpZGVudC5tYXRjaCgvW15hLXpBLVowLTldLykgPyBgJyR7aWRlbnR9J2AgOiBpZGVudDtcbn1cblxuZnVuY3Rpb24gZ3JvdXBCeU5hbWVzcGFjZShtZXRyaWNzOiBjZm5zcGVjLkNhbm5lZE1ldHJpY1tdKTogUmVjb3JkPHN0cmluZywgY2Zuc3BlYy5DYW5uZWRNZXRyaWNbXT4ge1xuICBjb25zdCByZXQ6IFJlY29yZDxzdHJpbmcsIGNmbnNwZWMuQ2FubmVkTWV0cmljW10+ID0ge307XG4gIGZvciAoY29uc3QgbWV0cmljIG9mIG1ldHJpY3MpIHtcbiAgICBjb25zdCBuYW1lc3BhY2UgPSBzYW5pdGl6ZU5hbWVzcGFjZShtZXRyaWMubmFtZXNwYWNlKTtcbiAgICAocmV0W25hbWVzcGFjZV0gPz8gKHJldFtuYW1lc3BhY2VdID0gW10pKS5wdXNoKG1ldHJpYyk7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBTYW5pdGl6ZSBtZXRyaWNzIG5hbWVzcGFjZVxuICpcbiAqIC0gTW9zdCBuYW1lc3BhY2VzIGxvb2sgbGlrZSAnQVdTLzxTZXJ2aWNlTmFtZT4nLlxuICogLSAnQVdTL0Nsb3VkV2F0Y2gvTWV0cmljU3RyZWFtcycgaGFzIDIgc2xhc2hlcyBpbiBpdC5cbiAqIC0gJ0Nsb3VkV2F0Y2hTeW50aGV0aWNzJyBkb2Vzbid0IGhhdmUgYSBzbGFzaCBhdCBhbGwuXG4gKi9cbmZ1bmN0aW9uIHNhbml0aXplTmFtZXNwYWNlKG5hbWVzcGFjZTogc3RyaW5nKSB7XG4gIHJldHVybiBuYW1lc3BhY2UucmVwbGFjZSgvXkFXU1xcLy8sICcnKS5yZXBsYWNlKCcvJywgJycpO1xufSJdfQ==
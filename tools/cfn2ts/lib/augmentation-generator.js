"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AugmentationGenerator = void 0;
const cfnspec_1 = require("@aws-cdk/cfnspec");
const codemaker_1 = require("codemaker");
const genspec = require("./genspec");
const spec_utils_1 = require("./spec-utils");
/**
 * Generate augmentation methods for the given types
 *
 * Augmentation consists of two parts:
 *
 * - Adding method declarations to an interface (IBucket)
 * - Adding implementations for those methods to the base class (BucketBase)
 *
 * The augmentation file must be imported in `index.ts`.
 *
 * ----------------------------------------------------------
 *
 * Generates code similar to the following:
 *
 * ```
 * import <Class>Base from './<class>-base';
 *
 * declare module './<class>-base' {
 *   interface <IClass> {
 *     method(...): Type;
 *   }
 *   interface <ClassBase> {
 *     method(...): Type;
 *   }
 * }
 *
 * <ClassBase>.prototype.<method> = // ...impl...
 * ```
 */
class AugmentationGenerator {
    constructor(moduleName, spec, affix) {
        this.spec = spec;
        this.affix = affix;
        this.code = new codemaker_1.CodeMaker();
        this.outputFile = `${moduleName}-augmentations.generated.ts`;
        this.code.openFile(this.outputFile);
        this.code.line(`// Copyright 2012-${new Date().getFullYear()} Amazon.com, Inc. or its affiliates. All Rights Reserved.`);
        this.code.line();
        this.code.line('/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control');
    }
    emitCode() {
        let importedCloudWatch = false;
        let hadAugmentations = false;
        for (const resourceTypeName of Object.keys(this.spec.ResourceTypes).sort()) {
            const aug = cfnspec_1.resourceAugmentation(resourceTypeName);
            if (aug.metrics) {
                if (!importedCloudWatch) {
                    this.code.line("import * as cloudwatch from '@aws-cdk/aws-cloudwatch';");
                    importedCloudWatch = true;
                }
                this.emitMetricAugmentations(resourceTypeName, aug.metrics, aug.options);
                hadAugmentations = true;
            }
        }
        return hadAugmentations;
    }
    /**
     * Saves the generated file.
     */
    async save(dir) {
        this.code.closeFile(this.outputFile);
        return this.code.save(dir);
    }
    emitMetricAugmentations(resourceTypeName, metrics, options) {
        const cfnName = spec_utils_1.SpecName.parse(resourceTypeName);
        const resourceName = genspec.CodeName.forCfnResource(cfnName, this.affix);
        const l2ClassName = resourceName.className.replace(/^Cfn/, '');
        const kebabL2ClassName = l2ClassName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        const classFile = `./${(options && options.classFile) || `${kebabL2ClassName}-base`}`;
        const className = (options && options.class) || l2ClassName + 'Base';
        const interfaceFile = (options && options.interfaceFile) ? `./${options.interfaceFile}` : classFile;
        const interfaceName = (options && options.interface) || 'I' + l2ClassName;
        this.code.line(`import { ${className} } from "${classFile}";`);
        if (classFile === interfaceFile) {
            this.code.openBlock(`declare module "${classFile}"`);
        }
        else {
            this.code.openBlock(`declare module "${interfaceFile}"`);
        }
        // Add to the interface
        this.code.openBlock(`interface ${interfaceName}`);
        this.emitMetricFunctionDeclaration(cfnName);
        for (const m of metrics.metrics) {
            this.emitSpecificMetricFunctionDeclaration(m);
        }
        this.code.closeBlock();
        if (classFile !== interfaceFile) {
            this.code.closeBlock();
            this.code.openBlock(`declare module "${classFile}"`);
        }
        // Add declaration to the base class (implementation added below)
        this.code.openBlock(`interface ${className}`);
        this.emitMetricFunctionDeclaration(cfnName);
        for (const m of metrics.metrics) {
            this.emitSpecificMetricFunctionDeclaration(m);
        }
        this.code.closeBlock();
        this.code.closeBlock();
        // Emit the monkey patches for all methods
        this.emitMetricFunction(className, metrics);
        for (const m of metrics.metrics) {
            this.emitSpecificMetricFunction(className, m);
        }
    }
    emitMetricFunctionDeclaration(resource) {
        this.code.line('/**');
        this.code.line(` * Return the given named metric for this ${resource.resourceName}`);
        this.code.line(' */');
        this.code.line('metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;');
    }
    emitMetricFunction(className, metrics) {
        this.code.line(`${className}.prototype.metric = function(metricName: string, props?: cloudwatch.MetricOptions) {`);
        this.code.line('  return new cloudwatch.Metric({');
        this.code.line(`    namespace: '${metrics.namespace}',`);
        this.code.line('    metricName,');
        const dimStrings = new Array();
        for (const [key, field] of Object.entries(metrics.dimensions)) {
            dimStrings.push(`${key}: ${field}`);
        }
        this.code.line(`    dimensions: { ${dimStrings.join(', ')} },`);
        this.code.line('    ...props');
        this.code.line('  }).attachTo(this);');
        this.code.line('};');
    }
    emitSpecificMetricFunctionDeclaration(metric) {
        this.code.line('/**');
        this.code.line(` * ${metric.documentation}`);
        this.code.line(' *');
        this.code.line(` * ${metricStatistic(metric)} over 5 minutes`);
        this.code.line(' */');
        this.code.line(`metric${metricFunctionName(metric)}(props?: cloudwatch.MetricOptions): cloudwatch.Metric;`);
    }
    emitSpecificMetricFunction(className, metric) {
        this.code.line(`${className}.prototype.metric${metricFunctionName(metric)} = function(props?: cloudwatch.MetricOptions) {`);
        this.code.line(`  return this.metric('${metric.name}', { statistic: '${metricStatistic(metric)}', ...props });`);
        this.code.line('};');
    }
}
exports.AugmentationGenerator = AugmentationGenerator;
function metricFunctionName(metric) {
    return metric.name.replace(/[^a-zA-Z0-9]/g, '');
}
function metricStatistic(metric) {
    switch (metric.type) {
        case cfnspec_1.schema.MetricType.Attrib:
        case undefined:
            return 'Average';
        case cfnspec_1.schema.MetricType.Count:
            return 'Sum';
        case cfnspec_1.schema.MetricType.Gauge:
            return 'Maximum';
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXVnbWVudGF0aW9uLWdlbmVyYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImF1Z21lbnRhdGlvbi1nZW5lcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOENBQWdFO0FBQ2hFLHlDQUFzQztBQUN0QyxxQ0FBcUM7QUFDckMsNkNBQXdDO0FBRXhDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNEJHO0FBQ0gsTUFBYSxxQkFBcUI7SUFJaEMsWUFBWSxVQUFrQixFQUFtQixJQUEwQixFQUFtQixLQUFhO1FBQTFELFNBQUksR0FBSixJQUFJLENBQXNCO1FBQW1CLFVBQUssR0FBTCxLQUFLLENBQVE7UUFIMUYsU0FBSSxHQUFHLElBQUkscUJBQVMsRUFBRSxDQUFDO1FBSXRDLElBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxVQUFVLDZCQUE2QixDQUFDO1FBQzdELElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUVwQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsMkRBQTJELENBQUMsQ0FBQztRQUN6SCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGdHQUFnRyxDQUFDLENBQUM7SUFDbkgsQ0FBQztJQUVNLFFBQVE7UUFDYixJQUFJLGtCQUFrQixHQUFHLEtBQUssQ0FBQztRQUMvQixJQUFJLGdCQUFnQixHQUFHLEtBQUssQ0FBQztRQUM3QixLQUFLLE1BQU0sZ0JBQWdCLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQzFFLE1BQU0sR0FBRyxHQUFHLDhCQUFvQixDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFFbkQs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SSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLHdEQUF3RCxDQUFDLENBQUM7SUFDOUcsQ0FBQztJQUVPLDBCQUEwQixDQUFDLFNBQWlCLEVBQUUsTUFBNkI7UUFDakYsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFTLG9CQUFvQixrQkFBa0IsQ0FBQyxNQUFNLENBQUMsaURBQWlELENBQUMsQ0FBQztRQUM1SCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsTUFBTSxDQUFDLElBQUksb0JBQW9CLGVBQWUsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUNqSCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2QixDQUFDO0NBQ0Y7QUE5SEQsc0RBOEhDO0FBRUQsU0FBUyxrQkFBa0IsQ0FBQyxNQUE2QjtJQUN2RCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNsRCxDQUFDO0FBRUQsU0FBUyxlQUFlLENBQUMsTUFBNkI7SUFDcEQsUUFBUSxNQUFNLENBQUMsSUFBSSxFQUFFO1FBQ25CLEtBQUssZ0JBQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO1FBQzlCLEtBQUssU0FBUztZQUNaLE9BQU8sU0FBUyxDQUFDO1FBRW5CLEtBQUssZ0JBQU0sQ0FBQyxVQUFVLENBQUMsS0FBSztZQUMxQixPQUFPLEtBQUssQ0FBQztRQUVmLEtBQUssZ0JBQU0sQ0FBQyxVQUFVLENBQUMsS0FBSztZQUMxQixPQUFPLFNBQVMsQ0FBQztLQUNwQjtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByZXNvdXJjZUF1Z21lbnRhdGlvbiwgc2NoZW1hIH0gZnJvbSAnQGF3cy1jZGsvY2Zuc3BlYyc7XG5pbXBvcnQgeyBDb2RlTWFrZXIgfSBmcm9tICdjb2RlbWFrZXInO1xuaW1wb3J0ICogYXMgZ2Vuc3BlYyBmcm9tICcuL2dlbnNwZWMnO1xuaW1wb3J0IHsgU3BlY05hbWUgfSBmcm9tICcuL3NwZWMtdXRpbHMnO1xuXG4vKipcbiAqIEdlbmVyYXRlIGF1Z21lbnRhdGlvbiBtZXRob2RzIGZvciB0aGUgZ2l2ZW4gdHlwZXNcbiAqXG4gKiBBdWdtZW50YXRpb24gY29uc2lzdHMgb2YgdHdvIHBhcnRzOlxuICpcbiAqIC0gQWRkaW5nIG1ldGhvZCBkZWNsYXJhdGlvbnMgdG8gYW4gaW50ZXJmYWNlIChJQnVja2V0KVxuICogLSBBZGRpbmcgaW1wbGVtZW50YXRpb25zIGZvciB0aG9zZSBtZXRob2RzIHRvIHRoZSBiYXNlIGNsYXNzIChCdWNrZXRCYXNlKVxuICpcbiAqIFRoZSBhdWdtZW50YXRpb24gZmlsZSBtdXN0IGJlIGltcG9ydGVkIGluIGBpbmRleC50c2AuXG4gKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICpcbiAqIEdlbmVyYXRlcyBjb2RlIHNpbWlsYXIgdG8gdGhlIGZvbGxvd2luZzpcbiAqXG4gKiBgYGBcbiAqIGltcG9ydCA8Q2xhc3M+QmFzZSBmcm9tICcuLzxjbGFzcz4tYmFzZSc7XG4gKlxuICogZGVjbGFyZSBtb2R1bGUgJy4vPGNsYXNzPi1iYXNlJyB7XG4gKiAgIGludGVyZmFjZSA8SUNsYXNzPiB7XG4gKiAgICAgbWV0aG9kKC4uLik6IFR5cGU7XG4gKiAgIH1cbiAqICAgaW50ZXJmYWNlIDxDbGFzc0Jhc2U+IHtcbiAqICAgICBtZXRob2QoLi4uKTogVHlwZTtcbiAqICAgfVxuICogfVxuICpcbiAqIDxDbGFzc0Jhc2U+LnByb3RvdHlwZS48bWV0aG9kPiA9IC8vIC4uLmltcGwuLi5cbiAqIGBgYFxuICovXG5leHBvcnQgY2xhc3MgQXVnbWVudGF0aW9uR2VuZXJhdG9yIHtcbiAgcHJpdmF0ZSByZWFkb25seSBjb2RlID0gbmV3IENvZGVNYWtlcigpO1xuICBwcml2YXRlIHJlYWRvbmx5IG91dHB1dEZpbGU6IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihtb2R1bGVOYW1lOiBzdHJpbmcsIHByaXZhdGUgcmVhZG9ubHkgc3BlYzogc2NoZW1hLlNwZWNpZmljYXRpb24sIHByaXZhdGUgcmVhZG9ubHkgYWZmaXg6IHN0cmluZykge1xuICAgIHRoaXMub3V0cHV0RmlsZSA9IGAke21vZHVsZU5hbWV9LWF1Z21lbnRhdGlvbnMuZ2VuZXJhdGVkLnRzYDtcbiAgICB0aGlzLmNvZGUub3BlbkZpbGUodGhpcy5vdXRwdXRGaWxlKTtcblxuICAgIHRoaXMuY29kZS5saW5lKGAvLyBDb3B5cmlnaHQgMjAxMi0ke25ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKX0gQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5gKTtcbiAgICB0aGlzLmNvZGUubGluZSgpO1xuICAgIHRoaXMuY29kZS5saW5lKCcvKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovIC8vIFRoaXMgaXMgZ2VuZXJhdGVkIGNvZGUgLSBsaW5lIGxlbmd0aHMgYXJlIGRpZmZpY3VsdCB0byBjb250cm9sJyk7XG4gIH1cblxuICBwdWJsaWMgZW1pdENvZGUoKTogYm9vbGVhbiB7XG4gICAgbGV0IGltcG9ydGVkQ2xvdWRXYXRjaCA9IGZhbHNlO1xuICAgIGxldCBoYWRBdWdtZW50YXRpb25zID0gZmFsc2U7XG4gICAgZm9yIChjb25zdCByZXNvdXJjZVR5cGVOYW1lIG9mIE9iamVjdC5rZXlzKHRoaXMuc3BlYy5SZXNvdXJjZVR5cGVzKS5zb3J0KCkpIHtcbiAgICAgIGNvbnN0IGF1ZyA9IHJlc291cmNlQXVnbWVudGF0aW9uKHJlc291cmNlVHlwZU5hbWUpO1xuXG4gICAgICBpZiAoYXVnLm1ldHJpY3MpIHtcbiAgICAgICAgaWYgKCFpbXBvcnRlZENsb3VkV2F0Y2gpIHtcbiAgICAgICAgICB0aGlzLmNvZGUubGluZShcImltcG9ydCAqIGFzIGNsb3Vkd2F0Y2ggZnJvbSAnQGF3cy1jZGsvYXdzLWNsb3Vkd2F0Y2gnO1wiKTtcbiAgICAgICAgICBpbXBvcnRlZENsb3VkV2F0Y2ggPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW1pdE1ldHJpY0F1Z21lbnRhdGlvbnMocmVzb3VyY2VUeXBlTmFtZSwgYXVnLm1ldHJpY3MsIGF1Zy5vcHRpb25zKTtcbiAgICAgICAgaGFkQXVnbWVudGF0aW9ucyA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBoYWRBdWdtZW50YXRpb25zO1xuICB9XG5cbiAgLyoqXG4gICAqIFNhdmVzIHRoZSBnZW5lcmF0ZWQgZmlsZS5cbiAgICovXG4gIHB1YmxpYyBhc3luYyBzYXZlKGRpcjogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xuICAgIHRoaXMuY29kZS5jbG9zZUZpbGUodGhpcy5vdXRwdXRGaWxlKTtcbiAgICByZXR1cm4gdGhpcy5jb2RlLnNhdmUoZGlyKTtcbiAgfVxuXG4gIHByaXZhdGUgZW1pdE1ldHJpY0F1Z21lbnRhdGlvbnMocmVzb3VyY2VUeXBlTmFtZTogc3RyaW5nLCBtZXRyaWNzOiBzY2hlbWEuUmVzb3VyY2VNZXRyaWNBdWdtZW50YXRpb25zLCBvcHRpb25zPzogc2NoZW1hLkF1Z21lbnRhdGlvbk9wdGlvbnMpOiB2b2lkIHtcbiAgICBjb25zdCBjZm5OYW1lID0gU3BlY05hbWUucGFyc2UocmVzb3VyY2VUeXBlTmFtZSk7XG4gICAgY29uc3QgcmVzb3VyY2VOYW1lID0gZ2Vuc3BlYy5Db2RlTmFtZS5mb3JDZm5SZXNvdXJjZShjZm5OYW1lLCB0aGlzLmFmZml4KTtcbiAgICBjb25zdCBsMkNsYXNzTmFtZSA9IHJlc291cmNlTmFtZS5jbGFzc05hbWUucmVwbGFjZSgvXkNmbi8sICcnKTtcbiAgICBjb25zdCBrZWJhYkwyQ2xhc3NOYW1lID0gbDJDbGFzc05hbWUucmVwbGFjZSgvKFthLXpdKShbQS1aXSkvZywgJyQxLSQyJykudG9Mb3dlckNhc2UoKTtcblxuICAgIGNvbnN0IGNsYXNzRmlsZSA9IGAuLyR7KG9wdGlvbnMgJiYgb3B0aW9ucy5jbGFzc0ZpbGUpIHx8IGAke2tlYmFiTDJDbGFzc05hbWV9LWJhc2VgfWA7XG4gICAgY29uc3QgY2xhc3NOYW1lID0gKG9wdGlvbnMgJiYgb3B0aW9ucy5jbGFzcykgfHwgbDJDbGFzc05hbWUgKyAnQmFzZSc7XG4gICAgY29uc3QgaW50ZXJmYWNlRmlsZSA9IChvcHRpb25zICYmIG9wdGlvbnMuaW50ZXJmYWNlRmlsZSkgPyBgLi8ke29wdGlvbnMuaW50ZXJmYWNlRmlsZX1gIDogY2xhc3NGaWxlO1xuICAgIGNvbnN0IGludGVyZmFjZU5hbWUgPSAob3B0aW9ucyAmJiBvcHRpb25zLmludGVyZmFjZSkgfHwgJ0knICsgbDJDbGFzc05hbWU7XG5cbiAgICB0aGlzLmNvZGUubGluZShgaW1wb3J0IHsgJHtjbGFzc05hbWV9IH0gZnJvbSBcIiR7Y2xhc3NGaWxlfVwiO2ApO1xuXG4gICAgaWYgKGNsYXNzRmlsZSA9PT0gaW50ZXJmYWNlRmlsZSkge1xuICAgICAgdGhpcy5jb2RlLm9wZW5CbG9jayhgZGVjbGFyZSBtb2R1bGUgXCIke2NsYXNzRmlsZX1cImApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvZGUub3BlbkJsb2NrKGBkZWNsYXJlIG1vZHVsZSBcIiR7aW50ZXJmYWNlRmlsZX1cImApO1xuICAgIH1cblxuICAgIC8vIEFkZCB0byB0aGUgaW50ZXJmYWNlXG4gICAgdGhpcy5jb2RlLm9wZW5CbG9jayhgaW50ZXJmYWNlICR7aW50ZXJmYWNlTmFtZX1gKTtcbiAgICB0aGlzLmVtaXRNZXRyaWNGdW5jdGlvbkRlY2xhcmF0aW9uKGNmbk5hbWUpO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXRyaWNzLm1ldHJpY3MpIHtcbiAgICAgIHRoaXMuZW1pdFNwZWNpZmljTWV0cmljRnVuY3Rpb25EZWNsYXJhdGlvbihtKTtcbiAgICB9XG4gICAgdGhpcy5jb2RlLmNsb3NlQmxvY2soKTtcblxuICAgIGlmIChjbGFzc0ZpbGUgIT09IGludGVyZmFjZUZpbGUpIHtcbiAgICAgIHRoaXMuY29kZS5jbG9zZUJsb2NrKCk7XG4gICAgICB0aGlzLmNvZGUub3BlbkJsb2NrKGBkZWNsYXJlIG1vZHVsZSBcIiR7Y2xhc3NGaWxlfVwiYCk7XG4gICAgfVxuXG4gICAgLy8gQWRkIGRlY2xhcmF0aW9uIHRvIHRoZSBiYXNlIGNsYXNzIChpbXBsZW1lbnRhdGlvbiBhZGRlZCBiZWxvdylcbiAgICB0aGlzLmNvZGUub3BlbkJsb2NrKGBpbnRlcmZhY2UgJHtjbGFzc05hbWV9YCk7XG4gICAgdGhpcy5lbWl0TWV0cmljRnVuY3Rpb25EZWNsYXJhdGlvbihjZm5OYW1lKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWV0cmljcy5tZXRyaWNzKSB7XG4gICAgICB0aGlzLmVtaXRTcGVjaWZpY01ldHJpY0Z1bmN0aW9uRGVjbGFyYXRpb24obSk7XG4gICAgfVxuICAgIHRoaXMuY29kZS5jbG9zZUJsb2NrKCk7XG5cbiAgICB0aGlzLmNvZGUuY2xvc2VCbG9jaygpO1xuXG4gICAgLy8gRW1pdCB0aGUgbW9ua2V5IHBhdGNoZXMgZm9yIGFsbCBtZXRob2RzXG4gICAgdGhpcy5lbWl0TWV0cmljRnVuY3Rpb24oY2xhc3NOYW1lLCBtZXRyaWNzKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWV0cmljcy5tZXRyaWNzKSB7XG4gICAgICB0aGlzLmVtaXRTcGVjaWZpY01ldHJpY0Z1bmN0aW9uKGNsYXNzTmFtZSwgbSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBlbWl0TWV0cmljRnVuY3Rpb25EZWNsYXJhdGlvbihyZXNvdXJjZTogU3BlY05hbWUpOiB2b2lkIHtcbiAgICB0aGlzLmNvZGUubGluZSgnLyoqJyk7XG4gICAgdGhpcy5jb2RlLmxpbmUoYCAqIFJldHVybiB0aGUgZ2l2ZW4gbmFtZWQgbWV0cmljIGZvciB0aGlzICR7cmVzb3VyY2UucmVzb3VyY2VOYW1lfWApO1xuICAgIHRoaXMuY29kZS5saW5lKCcgKi8nKTtcbiAgICB0aGlzLmNvZGUubGluZSgnbWV0cmljKG1ldHJpY05hbWU6IHN0cmluZywgcHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYzsnKTtcbiAgfVxuXG4gIHByaXZhdGUgZW1pdE1ldHJpY0Z1bmN0aW9uKGNsYXNzTmFtZTogc3RyaW5nLCBtZXRyaWNzOiBzY2hlbWEuUmVzb3VyY2VNZXRyaWNBdWdtZW50YXRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5jb2RlLmxpbmUoYCR7Y2xhc3NOYW1lfS5wcm90b3R5cGUubWV0cmljID0gZnVuY3Rpb24obWV0cmljTmFtZTogc3RyaW5nLCBwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge2ApO1xuICAgIHRoaXMuY29kZS5saW5lKCcgIHJldHVybiBuZXcgY2xvdWR3YXRjaC5NZXRyaWMoeycpO1xuICAgIHRoaXMuY29kZS5saW5lKGAgICAgbmFtZXNwYWNlOiAnJHttZXRyaWNzLm5hbWVzcGFjZX0nLGApO1xuICAgIHRoaXMuY29kZS5saW5lKCcgICAgbWV0cmljTmFtZSwnKTtcblxuICAgIGNvbnN0IGRpbVN0cmluZ3MgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuICAgIGZvciAoY29uc3QgW2tleSwgZmllbGRdIG9mIE9iamVjdC5lbnRyaWVzKG1ldHJpY3MuZGltZW5zaW9ucykpIHtcbiAgICAgIGRpbVN0cmluZ3MucHVzaChgJHtrZXl9OiAke2ZpZWxkfWApO1xuICAgIH1cblxuICAgIHRoaXMuY29kZS5saW5lKGAgICAgZGltZW5zaW9uczogeyAke2RpbVN0cmluZ3Muam9pbignLCAnKSB9IH0sYCk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJyAgICAuLi5wcm9wcycpO1xuICAgIHRoaXMuY29kZS5saW5lKCcgIH0pLmF0dGFjaFRvKHRoaXMpOycpO1xuICAgIHRoaXMuY29kZS5saW5lKCd9OycpO1xuICB9XG5cbiAgcHJpdmF0ZSBlbWl0U3BlY2lmaWNNZXRyaWNGdW5jdGlvbkRlY2xhcmF0aW9uKG1ldHJpYzogc2NoZW1hLlJlc291cmNlTWV0cmljKTogdm9pZCB7XG4gICAgdGhpcy5jb2RlLmxpbmUoJy8qKicpO1xuICAgIHRoaXMuY29kZS5saW5lKGAgKiAke21ldHJpYy5kb2N1bWVudGF0aW9ufWApO1xuICAgIHRoaXMuY29kZS5saW5lKCcgKicpO1xuICAgIHRoaXMuY29kZS5saW5lKGAgKiAke21ldHJpY1N0YXRpc3RpYyhtZXRyaWMpfSBvdmVyIDUgbWludXRlc2ApO1xuICAgIHRoaXMuY29kZS5saW5lKCcgKi8nKTtcbiAgICB0aGlzLmNvZGUubGluZShgbWV0cmljJHttZXRyaWNGdW5jdGlvbk5hbWUobWV0cmljKX0ocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYztgKTtcbiAgfVxuXG4gIHByaXZhdGUgZW1pdFNwZWNpZmljTWV0cmljRnVuY3Rpb24oY2xhc3NOYW1lOiBzdHJpbmcsIG1ldHJpYzogc2NoZW1hLlJlc291cmNlTWV0cmljKTogdm9pZCB7XG4gICAgdGhpcy5jb2RlLmxpbmUoYCR7Y2xhc3NOYW1lfS5wcm90b3R5cGUubWV0cmljJHttZXRyaWNGdW5jdGlvbk5hbWUobWV0cmljKX0gPSBmdW5jdGlvbihwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge2ApO1xuICAgIHRoaXMuY29kZS5saW5lKGAgIHJldHVybiB0aGlzLm1ldHJpYygnJHttZXRyaWMubmFtZX0nLCB7IHN0YXRpc3RpYzogJyR7bWV0cmljU3RhdGlzdGljKG1ldHJpYyl9JywgLi4ucHJvcHMgfSk7YCk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJ307Jyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbWV0cmljRnVuY3Rpb25OYW1lKG1ldHJpYzogc2NoZW1hLlJlc291cmNlTWV0cmljKTogc3RyaW5nIHtcbiAgcmV0dXJuIG1ldHJpYy5uYW1lLnJlcGxhY2UoL1teYS16QS1aMC05XS9nLCAnJyk7XG59XG5cbmZ1bmN0aW9uIG1ldHJpY1N0YXRpc3RpYyhtZXRyaWM6IHNjaGVtYS5SZXNvdXJjZU1ldHJpYyk6IHN0cmluZyB7XG4gIHN3aXRjaCAobWV0cmljLnR5cGUpIHtcbiAgICBjYXNlIHNjaGVtYS5NZXRyaWNUeXBlLkF0dHJpYjpcbiAgICBjYXNlIHVuZGVmaW5lZDpcbiAgICAgIHJldHVybiAnQXZlcmFnZSc7XG5cbiAgICBjYXNlIHNjaGVtYS5NZXRyaWNUeXBlLkNvdW50OlxuICAgICAgcmV0dXJuICdTdW0nO1xuXG4gICAgY2FzZSBzY2hlbWEuTWV0cmljVHlwZS5HYXVnZTpcbiAgICAgIHJldHVybiAnTWF4aW11bSc7XG4gIH1cbn1cbiJdfQ==
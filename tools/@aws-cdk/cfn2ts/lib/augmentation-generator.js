"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AugmentationGenerator = void 0;
const cfnspec_1 = require("@aws-cdk/cfnspec");
const codemaker_1 = require("codemaker");
const genspec = require("./genspec");
const spec_utils_1 = require("./spec-utils");
class AugmentationGenerator {
    constructor(moduleName, spec, affix, config) {
        this.spec = spec;
        this.affix = affix;
        this.config = config;
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
            const aug = (0, cfnspec_1.resourceAugmentation)(resourceTypeName);
            if (aug.metrics) {
                if (!importedCloudWatch) {
                    this.code.line(`import * as cloudwatch from '${this.config?.cloudwatchImport ?? '@aws-cdk/aws-cloudwatch'}';`);
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
        this.code.line(`    dimensionsMap: { ${dimStrings.join(', ')} },`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXVnbWVudGF0aW9uLWdlbmVyYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImF1Z21lbnRhdGlvbi1nZW5lcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOENBQWdFO0FBQ2hFLHlDQUFzQztBQUN0QyxxQ0FBcUM7QUFDckMsNkNBQXdDO0FBeUN4QyxNQUFhLHFCQUFxQjtJQUloQyxZQUNFLFVBQWtCLEVBQ0QsSUFBMEIsRUFDMUIsS0FBYSxFQUNiLE1BQXNDO1FBRnRDLFNBQUksR0FBSixJQUFJLENBQXNCO1FBQzFCLFVBQUssR0FBTCxLQUFLLENBQVE7UUFDYixXQUFNLEdBQU4sTUFBTSxDQUFnQztRQU54QyxTQUFJLEdBQUcsSUFBSSxxQkFBUyxFQUFFLENBQUM7UUFRdEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLFVBQVUsNkJBQTZCLENBQUM7UUFDN0QsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRXBDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSwyREFBMkQsQ0FBQyxDQUFDO1FBQ3pILElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDakIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0dBQWdHLENBQUMsQ0FBQztJQUNuSCxDQUFDO0lBRU0sUUFBUTtRQUNiLElBQUksa0JBQWtCLEdBQUcsS0FBSyxDQUFDO1FBQy9CLElBQUksZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO1FBQzdCLEtBQUssTUFBTSxnQkFBZ0IsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDMUUsTUFBTSxHQUFHLEdBQUcsSUFBQSw4QkFBb0IsRUFBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lB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ZnJvbSAnQGF3cy1jZGsvY2Zuc3BlYyc7XG5pbXBvcnQgeyBDb2RlTWFrZXIgfSBmcm9tICdjb2RlbWFrZXInO1xuaW1wb3J0ICogYXMgZ2Vuc3BlYyBmcm9tICcuL2dlbnNwZWMnO1xuaW1wb3J0IHsgU3BlY05hbWUgfSBmcm9tICcuL3NwZWMtdXRpbHMnO1xuXG4vKipcbiAqIEdlbmVyYXRlIGF1Z21lbnRhdGlvbiBtZXRob2RzIGZvciB0aGUgZ2l2ZW4gdHlwZXNcbiAqXG4gKiBBdWdtZW50YXRpb24gY29uc2lzdHMgb2YgdHdvIHBhcnRzOlxuICpcbiAqIC0gQWRkaW5nIG1ldGhvZCBkZWNsYXJhdGlvbnMgdG8gYW4gaW50ZXJmYWNlIChJQnVja2V0KVxuICogLSBBZGRpbmcgaW1wbGVtZW50YXRpb25zIGZvciB0aG9zZSBtZXRob2RzIHRvIHRoZSBiYXNlIGNsYXNzIChCdWNrZXRCYXNlKVxuICpcbiAqIFRoZSBhdWdtZW50YXRpb24gZmlsZSBtdXN0IGJlIGltcG9ydGVkIGluIGBpbmRleC50c2AuXG4gKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICpcbiAqIEdlbmVyYXRlcyBjb2RlIHNpbWlsYXIgdG8gdGhlIGZvbGxvd2luZzpcbiAqXG4gKiBgYGBcbiAqIGltcG9ydCA8Q2xhc3M+QmFzZSBmcm9tICcuLzxjbGFzcz4tYmFzZSc7XG4gKlxuICogZGVjbGFyZSBtb2R1bGUgJy4vPGNsYXNzPi1iYXNlJyB7XG4gKiAgIGludGVyZmFjZSA8SUNsYXNzPiB7XG4gKiAgICAgbWV0aG9kKC4uLik6IFR5cGU7XG4gKiAgIH1cbiAqICAgaW50ZXJmYWNlIDxDbGFzc0Jhc2U+IHtcbiAqICAgICBtZXRob2QoLi4uKTogVHlwZTtcbiAqICAgfVxuICogfVxuICpcbiAqIDxDbGFzc0Jhc2U+LnByb3RvdHlwZS48bWV0aG9kPiA9IC8vIC4uLmltcGwuLi5cbiAqIGBgYFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEF1Z21lbnRhdGlvbnNHZW5lcmF0b3JPcHRpb25zIHtcbiAgLyoqXG4gICogUGF0aCBvZiBjbG91ZHdhdGNoIGltcG9ydCB0byB1c2Ugd2hlbiBnZW5lcmF0aW5nIGF1Z21lbnRhdGlvbiBzb3VyY2VcbiAgKiBmaWxlcy5cbiAgKlxuICAqIEBkZWZhdWx0ICdAYXdzLWNkay9hd3MtY2xvdWR3YXRjaCdcbiAgKi9cbiAgY2xvdWR3YXRjaEltcG9ydD86IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIEF1Z21lbnRhdGlvbkdlbmVyYXRvciB7XG4gIHB1YmxpYyByZWFkb25seSBvdXRwdXRGaWxlOiBzdHJpbmc7XG4gIHByaXZhdGUgcmVhZG9ubHkgY29kZSA9IG5ldyBDb2RlTWFrZXIoKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBtb2R1bGVOYW1lOiBzdHJpbmcsXG4gICAgcHJpdmF0ZSByZWFkb25seSBzcGVjOiBzY2hlbWEuU3BlY2lmaWNhdGlvbixcbiAgICBwcml2YXRlIHJlYWRvbmx5IGFmZml4OiBzdHJpbmcsXG4gICAgcHJpdmF0ZSByZWFkb25seSBjb25maWc/OiBBdWdtZW50YXRpb25zR2VuZXJhdG9yT3B0aW9ucyxcbiAgKSB7XG4gICAgdGhpcy5vdXRwdXRGaWxlID0gYCR7bW9kdWxlTmFtZX0tYXVnbWVudGF0aW9ucy5nZW5lcmF0ZWQudHNgO1xuICAgIHRoaXMuY29kZS5vcGVuRmlsZSh0aGlzLm91dHB1dEZpbGUpO1xuXG4gICAgdGhpcy5jb2RlLmxpbmUoYC8vIENvcHlyaWdodCAyMDEyLSR7bmV3IERhdGUoKS5nZXRGdWxsWWVhcigpfSBBbWF6b24uY29tLCBJbmMuIG9yIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLmApO1xuICAgIHRoaXMuY29kZS5saW5lKCk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJy8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi8gLy8gVGhpcyBpcyBnZW5lcmF0ZWQgY29kZSAtIGxpbmUgbGVuZ3RocyBhcmUgZGlmZmljdWx0IHRvIGNvbnRyb2wnKTtcbiAgfVxuXG4gIHB1YmxpYyBlbWl0Q29kZSgpOiBib29sZWFuIHtcbiAgICBsZXQgaW1wb3J0ZWRDbG91ZFdhdGNoID0gZmFsc2U7XG4gICAgbGV0IGhhZEF1Z21lbnRhdGlvbnMgPSBmYWxzZTtcbiAgICBmb3IgKGNvbnN0IHJlc291cmNlVHlwZU5hbWUgb2YgT2JqZWN0LmtleXModGhpcy5zcGVjLlJlc291cmNlVHlwZXMpLnNvcnQoKSkge1xuICAgICAgY29uc3QgYXVnID0gcmVzb3VyY2VBdWdtZW50YXRpb24ocmVzb3VyY2VUeXBlTmFtZSk7XG5cbiAgICAgIGlmIChhdWcubWV0cmljcykge1xuICAgICAgICBpZiAoIWltcG9ydGVkQ2xvdWRXYXRjaCkge1xuICAgICAgICAgIHRoaXMuY29kZS5saW5lKGBpbXBvcnQgKiBhcyBjbG91ZHdhdGNoIGZyb20gJyR7dGhpcy5jb25maWc/LmNsb3Vkd2F0Y2hJbXBvcnQgPz8gJ0Bhd3MtY2RrL2F3cy1jbG91ZHdhdGNoJ30nO2ApO1xuICAgICAgICAgIGltcG9ydGVkQ2xvdWRXYXRjaCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbWl0TWV0cmljQXVnbWVudGF0aW9ucyhyZXNvdXJjZVR5cGVOYW1lLCBhdWcubWV0cmljcywgYXVnLm9wdGlvbnMpO1xuICAgICAgICBoYWRBdWdtZW50YXRpb25zID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhhZEF1Z21lbnRhdGlvbnM7XG4gIH1cblxuICAvKipcbiAgICogU2F2ZXMgdGhlIGdlbmVyYXRlZCBmaWxlLlxuICAgKi9cbiAgcHVibGljIGFzeW5jIHNhdmUoZGlyOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgdGhpcy5jb2RlLmNsb3NlRmlsZSh0aGlzLm91dHB1dEZpbGUpO1xuICAgIHJldHVybiB0aGlzLmNvZGUuc2F2ZShkaXIpO1xuICB9XG5cbiAgcHJpdmF0ZSBlbWl0TWV0cmljQXVnbWVudGF0aW9ucyhyZXNvdXJjZVR5cGVOYW1lOiBzdHJpbmcsIG1ldHJpY3M6IHNjaGVtYS5SZXNvdXJjZU1ldHJpY0F1Z21lbnRhdGlvbnMsIG9wdGlvbnM/OiBzY2hlbWEuQXVnbWVudGF0aW9uT3B0aW9ucyk6IHZvaWQge1xuICAgIGNvbnN0IGNmbk5hbWUgPSBTcGVjTmFtZS5wYXJzZShyZXNvdXJjZVR5cGVOYW1lKTtcbiAgICBjb25zdCByZXNvdXJjZU5hbWUgPSBnZW5zcGVjLkNvZGVOYW1lLmZvckNmblJlc291cmNlKGNmbk5hbWUsIHRoaXMuYWZmaXgpO1xuICAgIGNvbnN0IGwyQ2xhc3NOYW1lID0gcmVzb3VyY2VOYW1lLmNsYXNzTmFtZS5yZXBsYWNlKC9eQ2ZuLywgJycpO1xuICAgIGNvbnN0IGtlYmFiTDJDbGFzc05hbWUgPSBsMkNsYXNzTmFtZS5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCAnJDEtJDInKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgY29uc3QgY2xhc3NGaWxlID0gYC4vJHsob3B0aW9ucyAmJiBvcHRpb25zLmNsYXNzRmlsZSkgfHwgYCR7a2ViYWJMMkNsYXNzTmFtZX0tYmFzZWB9YDtcbiAgICBjb25zdCBjbGFzc05hbWUgPSAob3B0aW9ucyAmJiBvcHRpb25zLmNsYXNzKSB8fCBsMkNsYXNzTmFtZSArICdCYXNlJztcbiAgICBjb25zdCBpbnRlcmZhY2VGaWxlID0gKG9wdGlvbnMgJiYgb3B0aW9ucy5pbnRlcmZhY2VGaWxlKSA/IGAuLyR7b3B0aW9ucy5pbnRlcmZhY2VGaWxlfWAgOiBjbGFzc0ZpbGU7XG4gICAgY29uc3QgaW50ZXJmYWNlTmFtZSA9IChvcHRpb25zICYmIG9wdGlvbnMuaW50ZXJmYWNlKSB8fCAnSScgKyBsMkNsYXNzTmFtZTtcblxuICAgIHRoaXMuY29kZS5saW5lKGBpbXBvcnQgeyAke2NsYXNzTmFtZX0gfSBmcm9tIFwiJHtjbGFzc0ZpbGV9XCI7YCk7XG5cbiAgICBpZiAoY2xhc3NGaWxlID09PSBpbnRlcmZhY2VGaWxlKSB7XG4gICAgICB0aGlzLmNvZGUub3BlbkJsb2NrKGBkZWNsYXJlIG1vZHVsZSBcIiR7Y2xhc3NGaWxlfVwiYCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29kZS5vcGVuQmxvY2soYGRlY2xhcmUgbW9kdWxlIFwiJHtpbnRlcmZhY2VGaWxlfVwiYCk7XG4gICAgfVxuXG4gICAgLy8gQWRkIHRvIHRoZSBpbnRlcmZhY2VcbiAgICB0aGlzLmNvZGUub3BlbkJsb2NrKGBpbnRlcmZhY2UgJHtpbnRlcmZhY2VOYW1lfWApO1xuICAgIHRoaXMuZW1pdE1ldHJpY0Z1bmN0aW9uRGVjbGFyYXRpb24oY2ZuTmFtZSk7XG4gICAgZm9yIChjb25zdCBtIG9mIG1ldHJpY3MubWV0cmljcykge1xuICAgICAgdGhpcy5lbWl0U3BlY2lmaWNNZXRyaWNGdW5jdGlvbkRlY2xhcmF0aW9uKG0pO1xuICAgIH1cbiAgICB0aGlzLmNvZGUuY2xvc2VCbG9jaygpO1xuXG4gICAgaWYgKGNsYXNzRmlsZSAhPT0gaW50ZXJmYWNlRmlsZSkge1xuICAgICAgdGhpcy5jb2RlLmNsb3NlQmxvY2soKTtcbiAgICAgIHRoaXMuY29kZS5vcGVuQmxvY2soYGRlY2xhcmUgbW9kdWxlIFwiJHtjbGFzc0ZpbGV9XCJgKTtcbiAgICB9XG5cbiAgICAvLyBBZGQgZGVjbGFyYXRpb24gdG8gdGhlIGJhc2UgY2xhc3MgKGltcGxlbWVudGF0aW9uIGFkZGVkIGJlbG93KVxuICAgIHRoaXMuY29kZS5vcGVuQmxvY2soYGludGVyZmFjZSAke2NsYXNzTmFtZX1gKTtcbiAgICB0aGlzLmVtaXRNZXRyaWNGdW5jdGlvbkRlY2xhcmF0aW9uKGNmbk5hbWUpO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXRyaWNzLm1ldHJpY3MpIHtcbiAgICAgIHRoaXMuZW1pdFNwZWNpZmljTWV0cmljRnVuY3Rpb25EZWNsYXJhdGlvbihtKTtcbiAgICB9XG4gICAgdGhpcy5jb2RlLmNsb3NlQmxvY2soKTtcblxuICAgIHRoaXMuY29kZS5jbG9zZUJsb2NrKCk7XG5cbiAgICAvLyBFbWl0IHRoZSBtb25rZXkgcGF0Y2hlcyBmb3IgYWxsIG1ldGhvZHNcbiAgICB0aGlzLmVtaXRNZXRyaWNGdW5jdGlvbihjbGFzc05hbWUsIG1ldHJpY3MpO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXRyaWNzLm1ldHJpY3MpIHtcbiAgICAgIHRoaXMuZW1pdFNwZWNpZmljTWV0cmljRnVuY3Rpb24oY2xhc3NOYW1lLCBtKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGVtaXRNZXRyaWNGdW5jdGlvbkRlY2xhcmF0aW9uKHJlc291cmNlOiBTcGVjTmFtZSk6IHZvaWQge1xuICAgIHRoaXMuY29kZS5saW5lKCcvKionKTtcbiAgICB0aGlzLmNvZGUubGluZShgICogUmV0dXJuIHRoZSBnaXZlbiBuYW1lZCBtZXRyaWMgZm9yIHRoaXMgJHtyZXNvdXJjZS5yZXNvdXJjZU5hbWV9YCk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJyAqLycpO1xuICAgIHRoaXMuY29kZS5saW5lKCdtZXRyaWMobWV0cmljTmFtZTogc3RyaW5nLCBwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljOycpO1xuICB9XG5cbiAgcHJpdmF0ZSBlbWl0TWV0cmljRnVuY3Rpb24oY2xhc3NOYW1lOiBzdHJpbmcsIG1ldHJpY3M6IHNjaGVtYS5SZXNvdXJjZU1ldHJpY0F1Z21lbnRhdGlvbnMpOiB2b2lkIHtcbiAgICB0aGlzLmNvZGUubGluZShgJHtjbGFzc05hbWV9LnByb3RvdHlwZS5tZXRyaWMgPSBmdW5jdGlvbihtZXRyaWNOYW1lOiBzdHJpbmcsIHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7YCk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJyAgcmV0dXJuIG5ldyBjbG91ZHdhdGNoLk1ldHJpYyh7Jyk7XG4gICAgdGhpcy5jb2RlLmxpbmUoYCAgICBuYW1lc3BhY2U6ICcke21ldHJpY3MubmFtZXNwYWNlfScsYCk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJyAgICBtZXRyaWNOYW1lLCcpO1xuXG4gICAgY29uc3QgZGltU3RyaW5ncyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG4gICAgZm9yIChjb25zdCBba2V5LCBmaWVsZF0gb2YgT2JqZWN0LmVudHJpZXMobWV0cmljcy5kaW1lbnNpb25zKSkge1xuICAgICAgZGltU3RyaW5ncy5wdXNoKGAke2tleX06ICR7ZmllbGR9YCk7XG4gICAgfVxuXG4gICAgdGhpcy5jb2RlLmxpbmUoYCAgICBkaW1lbnNpb25zTWFwOiB7ICR7ZGltU3RyaW5ncy5qb2luKCcsICcpIH0gfSxgKTtcbiAgICB0aGlzLmNvZGUubGluZSgnICAgIC4uLnByb3BzJyk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJyAgfSkuYXR0YWNoVG8odGhpcyk7Jyk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJ307Jyk7XG4gIH1cblxuICBwcml2YXRlIGVtaXRTcGVjaWZpY01ldHJpY0Z1bmN0aW9uRGVjbGFyYXRpb24obWV0cmljOiBzY2hlbWEuUmVzb3VyY2VNZXRyaWMpOiB2b2lkIHtcbiAgICB0aGlzLmNvZGUubGluZSgnLyoqJyk7XG4gICAgdGhpcy5jb2RlLmxpbmUoYCAqICR7bWV0cmljLmRvY3VtZW50YXRpb259YCk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJyAqJyk7XG4gICAgdGhpcy5jb2RlLmxpbmUoYCAqICR7bWV0cmljU3RhdGlzdGljKG1ldHJpYyl9IG92ZXIgNSBtaW51dGVzYCk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJyAqLycpO1xuICAgIHRoaXMuY29kZS5saW5lKGBtZXRyaWMke21ldHJpY0Z1bmN0aW9uTmFtZShtZXRyaWMpfShwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO2ApO1xuICB9XG5cbiAgcHJpdmF0ZSBlbWl0U3BlY2lmaWNNZXRyaWNGdW5jdGlvbihjbGFzc05hbWU6IHN0cmluZywgbWV0cmljOiBzY2hlbWEuUmVzb3VyY2VNZXRyaWMpOiB2b2lkIHtcbiAgICB0aGlzLmNvZGUubGluZShgJHtjbGFzc05hbWV9LnByb3RvdHlwZS5tZXRyaWMke21ldHJpY0Z1bmN0aW9uTmFtZShtZXRyaWMpfSA9IGZ1bmN0aW9uKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7YCk7XG4gICAgdGhpcy5jb2RlLmxpbmUoYCAgcmV0dXJuIHRoaXMubWV0cmljKCcke21ldHJpYy5uYW1lfScsIHsgc3RhdGlzdGljOiAnJHttZXRyaWNTdGF0aXN0aWMobWV0cmljKX0nLCAuLi5wcm9wcyB9KTtgKTtcbiAgICB0aGlzLmNvZGUubGluZSgnfTsnKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtZXRyaWNGdW5jdGlvbk5hbWUobWV0cmljOiBzY2hlbWEuUmVzb3VyY2VNZXRyaWMpOiBzdHJpbmcge1xuICByZXR1cm4gbWV0cmljLm5hbWUucmVwbGFjZSgvW15hLXpBLVowLTldL2csICcnKTtcbn1cblxuZnVuY3Rpb24gbWV0cmljU3RhdGlzdGljKG1ldHJpYzogc2NoZW1hLlJlc291cmNlTWV0cmljKTogc3RyaW5nIHtcbiAgc3dpdGNoIChtZXRyaWMudHlwZSkge1xuICAgIGNhc2Ugc2NoZW1hLk1ldHJpY1R5cGUuQXR0cmliOlxuICAgIGNhc2UgdW5kZWZpbmVkOlxuICAgICAgcmV0dXJuICdBdmVyYWdlJztcblxuICAgIGNhc2Ugc2NoZW1hLk1ldHJpY1R5cGUuQ291bnQ6XG4gICAgICByZXR1cm4gJ1N1bSc7XG5cbiAgICBjYXNlIHNjaGVtYS5NZXRyaWNUeXBlLkdhdWdlOlxuICAgICAgcmV0dXJuICdNYXhpbXVtJztcbiAgfVxufVxuIl19
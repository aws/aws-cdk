'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.CelEngine =
    exports.RegoEngine =
    exports.SchemaValidator =
    exports.TemplateModel =
    exports.TemplateFile =
        void 0;
exports.version = version;
const fs_1 = require('fs');
const bridge = require('./bindings_wasm');
class TemplateFile {
    constructor(path) {
        this.path = path;
    }
    readBytes() {
        return (0, fs_1.readFileSync)(this.path);
    }
}
exports.TemplateFile = TemplateFile;
class TemplateModel {
    constructor(template) {
        this.inner = bridge.WasmSemanticModel.parse(template.readBytes());
    }
    resources() {
        return this.inner.resources();
    }
    parameters() {
        return this.inner.parameters();
    }
    outputs() {
        return this.inner.outputs();
    }
    conditions() {
        return this.inner.conditions();
    }
    transforms() {
        return this.inner.transforms();
    }
    formatVersion() {
        return this.inner.formatVersion();
    }
    description() {
        return this.inner.description();
    }
    toDiagnosticModel() {
        return this.inner.toDiagnosticModel();
    }
    sourceLocation(path) {
        return this.inner.sourceLocation(path);
    }
    free() {
        this.inner.free();
    }
}
exports.TemplateModel = TemplateModel;
class SchemaValidator {
    constructor() {
        this.inner = new bridge.WasmSchemaValidator();
    }
    listRules() {
        return this.inner.listRules();
    }
    schemaCount() {
        return this.inner.schemaCount();
    }
    validate(template, region = 'us-east-1') {
        const model = bridge.WasmSemanticModel.parse(template.readBytes());
        try {
            return this.inner.validate(model, region).diagnostics;
        } finally {
            model.free();
        }
    }
    free() {
        this.inner.free();
    }
}
exports.SchemaValidator = SchemaValidator;
function createEngineClass(WasmClass) {
    return class {
        constructor(config) {
            this.inner = new WasmClass(config ?? {});
        }
        validateStandard(template, config) {
            return this.inner.validateStandard(template.readBytes(), config ?? {}, template.path);
        }
        validateDetailed(template, config) {
            return this.inner.validateDetailed(template.readBytes(), config ?? {}, template.path);
        }
        listRules() {
            return this.inner.listRules();
        }
        engineName() {
            return this.inner.engineName();
        }
        free() {
            this.inner.free();
        }
    };
}
exports.RegoEngine = createEngineClass(bridge.WasmRegoEngine);
exports.CelEngine = createEngineClass(bridge.WasmCelEngine);
function version() {
    return bridge.version();
}

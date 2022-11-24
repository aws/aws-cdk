"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderableHelper = exports.HelperFunction = exports.SymbolImport = exports.CM2 = void 0;
const fs = require("fs-extra");
const type_1 = require("./type");
const source_module_1 = require("./source-module");
class CM2 {
    constructor(fileName) {
        this.fileName = fileName;
        this.indents = new Array();
        this.helpers = new Map();
        this.pendingIndent = false;
        this.currentModule = new source_module_1.SourceFile(fileName);
        this.buffer = new WriteBuffer();
    }
    render() {
        this.dummyRenderHelpers();
        return [
            ...this.renderHelpers('top'),
            this.buffer.render(),
            ...this.renderHelpers('bottom'),
        ].join('');
    }
    save() {
        fs.writeFileSync(this.fileName, this.render());
    }
    add(...xs) {
        for (const x of xs) {
            if (typeof x === 'string') {
                this.write(x);
            }
            else {
                x.render(this);
            }
        }
    }
    line(...xs) {
        this.add(...xs, '\n');
    }
    write(x) {
        if (!x) {
            return;
        }
        // Write the indent only if followed by non-whitespace, otherwise we will not be able to unindent
        // correctly.
        this.flushPendingIndent();
        // Replace every newline that's not the last newline
        this.buffer?.write(x.replace(/\n(.)/g, `\n${this.currentIndent}$1`));
        this.pendingIndent = x.endsWith('\n');
    }
    addHelper(helper) {
        if (this.delegateHelpers) {
            this.delegateHelpers.addHelper(helper);
            return;
        }
        this.helpers.set(helper.identifier, helper);
    }
    openBlock(...xs) {
        this.add(...xs, ' {');
        this.indent('  ');
        this.write('\n');
    }
    closeBlock() {
        this.unindent();
        this.line('}');
    }
    block(xs, cb) {
        if (Array.isArray(xs)) {
            this.openBlock(...xs);
        }
        else {
            this.openBlock(xs);
        }
        cb();
        this.closeBlock();
    }
    docBlock(lines) {
        const flat = lines.flatMap(l => l.split('\n'));
        let i = 0;
        while (i < flat.length) {
            if (flat[i] === '' && ((i === 0 || i === flat.length - 1 || (i < flat.length - 1 && flat[i + 1] === '')))) {
                flat.splice(i, 1);
            }
            else {
                i += 1;
            }
        }
        this.line('/**');
        for (const l of flat) {
            this.line(` * ${l.trimEnd()}`);
        }
        this.line(' */');
    }
    typeInThisFile(name) {
        return type_1.existingType(name, this.currentModule);
    }
    indent(add) {
        this.indents.push(add);
    }
    unindent() {
        this.indents.pop();
    }
    get currentIndent() {
        return this.indents.join('');
    }
    flushPendingIndent() {
        if (this.pendingIndent) {
            this.buffer?.write(this.currentIndent);
            this.pendingIndent = false;
        }
    }
    /**
     * Render all helpers at least once so we transitively collect all helpers of helpers
     */
    dummyRenderHelpers() {
        this.renderHelpers('top');
        this.renderHelpers('bottom');
    }
    renderHelpers(where) {
        const hs = Array.from(this.helpers.values()).filter(h => h.position === where);
        if (hs.length === 0) {
            return [];
        }
        const f = new CM2(this.fileName);
        f.delegateHelpers = this; // Any further helpers, relegate to here
        for (const helper of hs) {
            helper.render(f);
        }
        return [f.render()];
    }
}
exports.CM2 = CM2;
class WriteBuffer {
    constructor() {
        this.parts = new Array();
    }
    prepend(x) {
        this.parts.unshift(x);
    }
    write(x) {
        this.parts.push(x);
    }
    render() {
        return this.parts.join('');
    }
}
class SymbolImport {
    constructor(symbolName, module) {
        this.symbolName = symbolName;
        this.module = module;
        this.position = 'top';
        this.identifier = `${module.identifier}.${symbolName}`;
    }
    render(code) {
        code.line(`import { ${this.symbolName} } from '${this.module.importName(code)}';`);
    }
}
exports.SymbolImport = SymbolImport;
class HelperFunction {
    constructor(functionName, block) {
        this.functionName = functionName;
        this.block = block;
        this.position = 'bottom';
        this.identifier = functionName;
    }
    render(code) {
        this.block(code);
    }
}
exports.HelperFunction = HelperFunction;
class RenderableHelper {
    constructor(identifier, position, renderable) {
        this.identifier = identifier;
        this.position = position;
        this.renderable = renderable;
    }
    render(code) {
        this.renderable.render(code);
    }
}
exports.RenderableHelper = RenderableHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY20yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY20yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtCQUErQjtBQUMvQixpQ0FBc0M7QUFDdEMsbURBQTREO0FBYTVELE1BQWEsR0FBRztJQVNkLFlBQTRCLFFBQWdCO1FBQWhCLGFBQVEsR0FBUixRQUFRLENBQVE7UUFMM0IsWUFBTyxHQUFHLElBQUksS0FBSyxFQUFVLENBQUM7UUFDOUIsWUFBTyxHQUFHLElBQUksR0FBRyxFQUFtQixDQUFDO1FBQzlDLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBSTVCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSwwQkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0lBRU0sTUFBTTtRQUNYLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBRTFCLE9BQU87WUFDTCxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDO1lBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO1lBQ3BCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUM7U0FDaEMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDWixDQUFDO0lBRU0sSUFBSTtRQUNULEVBQUUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRU0sR0FBRyxDQUFDLEdBQUcsRUFBbUI7UUFDL0IsS0FBSyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDbEIsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLEVBQUU7Z0JBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDZjtpQkFBTTtnQkFDTCxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FB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
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interleave = exports.RenderableHelper = exports.HelperFunction = exports.SymbolImport = exports.CM2 = void 0;
const path = require("path");
const fs = require("fs-extra");
const source_module_1 = require("./source-module");
class CM2 {
    constructor(fileName) {
        this.indents = new Array();
        this.helpers = new Map();
        this.pendingIndent = false;
        this.currentModule = source_module_1.SourceFile.of(fileName);
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
        fs.ensureDirSync(path.dirname(this.currentModule.fileName));
        fs.writeFileSync(this.currentModule.fileName, this.render());
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
        const existing = this.helpers.get(helper.helperKey);
        if (existing) {
            existing.absorb(helper);
        }
        else {
            this.helpers.set(helper.helperKey, helper);
        }
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
    indent(add) {
        this.indents.push(add);
    }
    unindent() {
        this.indents.pop();
    }
    relativeImportName(fileName) {
        const relativePath = path.posix.relative(path.dirname(this.currentModule.fileName), fileName).replace(/\.ts$/, '');
        return relativePath.startsWith('../') ? relativePath : `./${relativePath}`;
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
        const f = new CM2(this.currentModule);
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
        this.module = module;
        this.position = 'top';
        this.symbols = new Set();
        this.helperKey = module.identifier;
        this.symbols.add(symbolName);
    }
    render(code) {
        const syms = Array.from(this.symbols).sort();
        code.line('import { ', ...interleave(', ', syms), ` } from '${this.module.importName(code)}';`);
    }
    absorb(other) {
        for (const s of other.symbols) {
            this.symbols.add(s);
        }
    }
}
exports.SymbolImport = SymbolImport;
class HelperFunction {
    constructor(functionName, block) {
        this.functionName = functionName;
        this.block = block;
        this.position = 'bottom';
        this.helperKey = functionName;
    }
    render(code) {
        this.block(code);
    }
    absorb() {
        // Let's hope the other definition is the same :>
    }
}
exports.HelperFunction = HelperFunction;
class RenderableHelper {
    constructor(helperKey, position, renderable) {
        this.helperKey = helperKey;
        this.position = position;
        this.renderable = renderable;
    }
    render(code) {
        this.renderable.render(code);
    }
    absorb() {
        // Let's hope the other definition is the same :>
    }
}
exports.RenderableHelper = RenderableHelper;
function interleave(sep, xs) {
    const ret = new Array();
    let first = true;
    for (const x of xs) {
        if (!first) {
            ret.push(sep);
        }
        first = false;
        if (Array.isArray(x)) {
            ret.push(...x);
        }
        else {
            ret.push(x);
        }
    }
    return ret;
}
exports.interleave = interleave;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY20yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY20yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZCQUE2QjtBQUM3QiwrQkFBK0I7QUFDL0IsbURBQTREO0FBYTVELE1BQWEsR0FBRztJQVNkLFlBQVksUUFBNkI7UUFMeEIsWUFBTyxHQUFHLElBQUksS0FBSyxFQUFVLENBQUM7UUFDOUIsWUFBTyxHQUFHLElBQUksR0FBRyxFQUFtQixDQUFDO1FBQzlDLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBSTVCLElBQUksQ0FBQyxhQUFhLEdBQUcsMEJBQVUsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO0lBQ2xDLENBQUM7SUFFTSxNQUFNO1FBQ1gsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFFMUIsT0FBTztZQUNMLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUM7WUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFDcEIsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQztTQUNoQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUNaLENBQUM7SUFFTSxJQUFJO1FBQ1QsRUFBRSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUM1RCxFQUFFLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFTSxHQUFHLENBQUMsR0FBRyxFQUFtQjtRQUMvQixLQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNsQixJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVEsRUFBRTtnQkFDekIsSUFBSSxD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
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelperFunction = exports.SymbolImport = exports.CM2 = void 0;
const fs = require("fs-extra");
const type_1 = require("./type");
const source_module_1 = require("./source-module");
class CM2 {
    constructor(fileName) {
        this.fileName = fileName;
        this.indents = new Array();
        this.helpers = new Map();
        this.currentModule = new source_module_1.SourceFile(fileName);
        this.buffer = new WriteBuffer();
    }
    render() {
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
        // FIXME: Write the indent only if followed by non-whitespace, otherwise we will not be able to unindent
        // correctly.
        this.buffer?.write(x.replace(/\n/g, `\n${this.currentIndent}`));
    }
    addHelper(helper) {
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
            this.line(` * ${l}`);
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
    renderHelpers(where) {
        const hs = Array.from(this.helpers.values()).filter(h => h.position === where);
        if (hs.length === 0) {
            return [];
        }
        const f = new CM2(this.fileName);
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
        code.add(`import { ${this.symbolName} } from '${this.module.importName(code)}';`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY20yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY20yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtCQUErQjtBQUMvQixpQ0FBc0M7QUFDdEMsbURBQTREO0FBVzVELE1BQWEsR0FBRztJQU9kLFlBQTRCLFFBQWdCO1FBQWhCLGFBQVEsR0FBUixRQUFRLENBQVE7UUFIM0IsWUFBTyxHQUFHLElBQUksS0FBSyxFQUFVLENBQUM7UUFDOUIsWUFBTyxHQUFHLElBQUksR0FBRyxFQUFtQixDQUFDO1FBR3BELElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSwwQkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0lBRU0sTUFBTTtRQUNYLE9BQU87WUFDTCxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDO1lBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO1lBQ3BCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUM7U0FDaEMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDWixDQUFDO0lBRU0sSUFBSTtRQUNULEVBQUUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRU0sR0FBRyxDQUFDLEdBQUcsRUFBbUI7UUFDL0IsS0FBSyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDbEIsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLEVBQUU7Z0JBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDZjtpQkFBTTtnQkFDTCxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2hCO1NBQ0Y7SUFDSCxDQUFDO0lBRU0sSUFBSSxDQUFDLEdBQUcsRUFBbUI7UUFDaEMs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
import * as path from 'path';
import * as fs from 'fs-extra';
import { SourceFile, ISourceModule } from './source-module';

// Missing from upstream CodeMaker
// - In-memory generation
// - Looking at current file
// - Distinguishing setup from code (deduping setup code like imports)
// - Block always indents
// - Need to be able to write partial lines (for rendering object literals)

export type CodePart = string | IRenderable;

export type HelperPosition = 'top' | 'bottom';

export class CM2 {
  public static renderSingle(fileName: string | SourceFile, ...parts: CodePart[]) {
    const ret = new CM2(fileName);
    ret.add(...parts);

    // Before rendering, get rid of the helpers
    ret.clearHelpers();
    return ret.render();
  }

  public readonly currentModule: SourceFile;

  private readonly buffer: WriteBuffer;
  private readonly indents = new Array<string>();
  private readonly helpers = new Map<string, IHelper>();
  private pendingIndent = false;
  private delegateHelpers?: CM2;

  constructor(fileName: string | SourceFile) {
    this.currentModule = SourceFile.of(fileName);
    this.buffer = new WriteBuffer();
  }

  public render() {
    this.dummyRenderHelpers();

    return [
      ...this.renderHelpers('top'),
      this.buffer.render(),
      ...this.renderHelpers('bottom'),
    ].join('')
  }

  public save() {
    fs.ensureDirSync(path.dirname(this.currentModule.fileName));
    fs.writeFileSync(this.currentModule.fileName, this.render());
  }

  public add(...xs: Array<CodePart>) {
    for (const x of xs) {
      if (typeof x === 'string') {
        this.write(x);
      } else {
        x.render(this);
      }
    }
  }

  public line(...xs: Array<CodePart>) {
    this.add(...xs, '\n');
  }

  public write(x: string) {
    if (!x) { return; }

    // Write the indent only if followed by non-whitespace, otherwise we will not be able to unindent
    // correctly.
    this.flushPendingIndent();

    // Replace every newline that's not the last newline
    this.buffer?.write(x.replace(/\n(.)/g, `\n${this.currentIndent}$1`));
    this.pendingIndent = x.endsWith('\n');
  }

  public addHelper(helper: IHelper) {
    if (this.delegateHelpers) {
      this.delegateHelpers.addHelper(helper);
      return;
    }

    const existing = this.helpers.get(helper.helperKey);
    if (existing) {
      existing.absorb(helper);
    } else {
      this.helpers.set(helper.helperKey, helper);
    }
  }

  public openBlock(...xs: CodePart[]) {
    this.add(...xs, ' {');
    this.indent('  ');
    this.write('\n');
  }

  public closeBlock() {
    this.unindent();
    this.line('}');
  }

  public block(xs: CodePart | CodePart[], cb: () => void) {
    if (Array.isArray(xs)) {
      this.openBlock(...xs);
    } else {
      this.openBlock(xs);
    }
    cb();
    this.closeBlock();
  }


  public docBlock(lines: string[]) {
    const flat = lines.flatMap(l => l.split('\n'));

    let i = 0;
    while (i < flat.length) {
      if (flat[i] === '' && (
        (i === 0 || i === flat.length - 1 || (i < flat.length - 1 && flat[i + 1] === '')))) {
        flat.splice(i, 1);
      } else {
        i += 1;
      }
    }

    if (flat.length === 0) { return; }

    this.line('/**');
    for (const l of flat) {
      this.line(` * ${l.trimEnd()}`);
    }
    this.line(' */');
  }

  public indent(add: string) {
    this.indents.push(add);
  }

  public unindent() {
    this.indents.pop();
  }

  public relativeImportName(fileName: string) {
    const relativePath = path.posix.relative(path.dirname(this.currentModule.fileName), fileName).replace(/\.ts$/, '');
    return relativePath.startsWith('../') ? relativePath : `./${relativePath}`;
  }

  private get currentIndent() {
    return this.indents.join('');
  }

  private flushPendingIndent() {
    if (this.pendingIndent) {
      this.buffer?.write(this.currentIndent);
      this.pendingIndent = false;
    }
  }

  /**
   * Render all helpers at least once so we transitively collect all helpers of helpers
   */
  private dummyRenderHelpers() {
    this.renderHelpers('top');
    this.renderHelpers('bottom');
  }

  private renderHelpers(where: IHelper['position']): string[] {
    const hs = Array.from(this.helpers.values()).filter(h => h.position === where);
    if (hs.length === 0) { return []; }

    const f = new CM2(this.currentModule);
    f.delegateHelpers = this; // Any further helpers, relegate to here

    for (const helper of hs) {
      helper.render(f);
    }

    return [f.render()];
  }

  public clearHelpers() {
    this.helpers.clear();
  }
}

export interface IRenderable {
  render(code: CM2): void;
}

export function renderable(render: ((x: CM2) => void) | CodePart[]): IRenderable {
  if (Array.isArray(render)) {
    return {
      render(code: CM2) {
        code.add(...render);
      }
    };
  } else {
    return { render };
  }
}

class WriteBuffer {
  private readonly parts = new Array<string>();

  constructor() {
  }

  public prepend(x: string) {
    this.parts.unshift(x);
  }

  public write(x: string) {
    this.parts.push(x);
  }

  public render() {
    return this.parts.join('');
  }
}

export interface IHelper extends IRenderable {
  readonly position: HelperPosition;
  readonly helperKey: string;

  absorb(other: this): void;
}

export class SymbolImport implements IHelper {
  public readonly position = 'top';
  public readonly helperKey: string;
  private readonly symbols = new Set<string>();

  constructor(symbolName: string, public readonly module: ISourceModule) {
    this.helperKey = module.identifier;
    this.symbols.add(symbolName);
  }

  public render(code: CM2) {
    const syms = Array.from(this.symbols).sort();
    code.line('import { ', ...interleave(', ', syms), ` } from '${this.module.importName(code)}';`);
  }

  public absorb(other: SymbolImport) {
    for (const s of other.symbols) {
      this.symbols.add(s);
    }
  }
}

export class HelperFunction implements IHelper {
  public readonly position = 'bottom';
  public readonly helperKey: string;

  constructor(public readonly functionName: string, private readonly block: (x: CM2) => void) {
    this.helperKey = functionName;
  }

  public render(code: CM2) {
    this.block(code);
  }

  public absorb() {
    // Let's hope the other definition is the same :>
  }
}

export class RenderableHelper implements IHelper {
  constructor(public readonly helperKey: string, public readonly position: HelperPosition, private readonly renderable: IRenderable) {
  }

  public render(code: CM2) {
    this.renderable.render(code);
  }

  public absorb() {
    // Let's hope the other definition is the same :>
  }
}

export function interleave(sep: CodePart, xs: Array<CodePart | CodePart[]>): CodePart[] {
  const ret = new Array<CodePart>();
  let first = true;
  for (const x of xs) {
    if (!first) { ret.push(sep); }
    first = false;

    if (Array.isArray(x)) {
      ret.push(...x);
    } else {
      ret.push(x);
    }
  }
  return ret;
}

export function renderObjectLiteral(code: CM2, props: Iterable<[string, CodePart]>) {
  code.indent('  ');
  code.write('{\n');
  for (const [k, v] of props) {
    code.add(k as string, `: `, v, ',\n');
  }
  code.unindent();
  code.write('}');
}
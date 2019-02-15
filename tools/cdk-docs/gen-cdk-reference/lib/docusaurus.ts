import fs = require('fs');
import path = require('path');
import util = require('util');
import YAML = require('yaml');

const writeFile = util.promisify(fs.writeFile);

/**
 * Data model:
 *
 * Sidebar = Category[]
 * Category = (label, (Entry | Category)[])
 */

export class Docs {
  private readonly sidebars = new Map<string, Sidebar>();

  constructor(private readonly websitePath: string, private readonly docPath: string) {
  }

  public add(id: string, sidebar: Sidebar) {
    this.sidebars.set(id, sidebar);
    return sidebar;
  }

  public sidebar(id: string) {
    const sb = this.sidebars.get(id);
    if (sb) { return sb; }
    return this.add(id, new Sidebar());
  }

  public async write() {
    await this.writeDocs();

    await writeFile(
        path.join(this.websitePath, 'sidebars.json'),
        JSON.stringify(this.renderSidebars(), undefined, 2),
        { encoding: 'utf-8' });
  }

  private async writeDocs() {
    for (const sidebar of this.sidebars.values()) {
      await sidebar.writeDocs(this.docPath);
    }
  }

  private renderSidebars() {
    const sidebars = {};

    for (const [id, sidebar] of this.sidebars) {
      sidebars[id] = sidebar.render();
    }

    return sidebars;

  }
}

export class Sidebar {
  private readonly categories = new Array<Category>();

  public add(category: Category) {
    this.categories.push(category);
    return category;
  }

  public category(caption: string) {
    const cat = this.categories.find(c => c.caption === caption);
    if (cat) { return cat; }
    return this.add(new Category(caption));
  }

  public get(caption: string) {
    return this.categories.find(c => c.caption === caption);
  }

  public render() {
    const ret = {};
    for (const cat of this.categories) {
      ret[cat.caption] = cat.renderSidebarEntry(true);
    }
    return ret;
  }

  public async writeDocs(docPath: string) {
    for (const cat of this.categories) {
      await cat.writeDocs(docPath);
    }
  }
}

export type Element = Category | Document;

export function isDocument(x: Element): x is Document {
  return x instanceof Document;
}

export function isCategory(x: Element): x is Category {
  return x instanceof Category;
}

export class Category {
  private elements = new Array<Element>();

  constructor(public caption: string) {
  }

  public get isEmpty() {
    return this.elements.length === 0;
  }

  public add<T extends Element>(element: T): T {
    this.elements.push(element);
    return element;
  }

  public category(caption: string): Category {
    const cat = this.findCategory(caption);
    if (cat) { return cat; }
    return this.add(new Category(caption));
  }

  public findDocument(id: string) {
    return this.elements.filter(isDocument).find(d => d.id === id);
  }

  public findCategory(caption: string) {
    return this.elements.filter(isCategory).find(d => d.caption === caption);
  }

  public renderSidebarEntry(topLevel?: boolean) {
    const ids = stableSort(this.elements, makeComparator(docsFirst)).filter(e => !e.isEmpty).map(e => e.renderSidebarEntry());

    if (topLevel) {
      return ids;
    } else {
      return {
        type: 'subcategory',
        label: this.caption,
        ids,
      };
    }
  }

  public async writeDocs(docPath: string) {
    for (const el of this.elements) {
      await el.writeDocs(docPath);
    }
  }
}

export interface FrontMatter {
  id?: string;
  title?: string;
  sidebar_label?: string;
  hide_title?: boolean;
}

export class Document {
  constructor(public id: string, public contents: string, private readonly frontMatter: FrontMatter = {}) {
  }

  public get isEmpty() {
    return false;
  }

  public async writeDocs(docPath: string) {
    await writeFile(path.join(docPath, this.id + '.md'), this.renderContents(), { encoding: 'utf-8' });
  }

  public renderContents() {
    return `---\n${YAML.stringify(this.frontMatter, { schema: 'yaml-1.1' }).trim()}\n---\n${this.contents}`;
  }

  public renderSidebarEntry() {
    return this.id;
  }
}

function docsFirst(x: Element) {
  return isDocument(x) ? 0 : 1;
}

function makeComparator<T>(f: (x: T) => number) {
  return (a: T, b: T) => {
    return f(a) - f(b);
  };
}

function stableSort<T>(xs: T[], cmp?: (a: T, b: T) => number) {
  cmp = !!cmp ? cmp : (a, b) => {
    if (a < b) { return -1; }
    if (a > b) { return 1; }
    return 0;
  };
  const stabilizedThis: Array<[T, number]> = xs.map((el, index) => [el, index] as [T, number]);
  const stableCmp = (a, b) => {
    const order = cmp!(a[0], b[0]);
    if (order !== 0) { return order; }
    return a[1] - b[1];
  };

  stabilizedThis.sort(stableCmp);
  for (let i = 0; i < xs.length; i++) {
    xs[i] = stabilizedThis[i][0];
  }
  return xs;
}

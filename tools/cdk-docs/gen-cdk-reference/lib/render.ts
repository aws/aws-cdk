import jsiiReflect = require('jsii-reflect');
import { Document } from './docusaurus';

const BADGE_OPTIONAL = '![Optional](https://img.shields.io/badge/-Optional-inactive.svg)';
const BADGE_REQUIRED = '![Required](https://img.shields.io/badge/-Required-important.svg)';

export interface RenderingOptions {
  javadocPath?: string;
  dotnetPath?: string;
  typescriptPath?: string;
}

export class Rendering {
  constructor(private readonly opts: RenderingOptions) {
  }

  /**
   * Return the dislay name for a service package
   */
  public packageDisplayName(serviceName: string) {
    serviceName = serviceName.replace(/^aws-/, '');
    return serviceName.substr(0, 1).toUpperCase() + serviceName.substr(1);
  }

  public assemblyOverview(assembly: jsiiReflect.Assembly, id: string): Document {
    const preamble = join(' | ', [
      this.typescriptLinkAssembly(assembly),
      this.javadocLinkAssembly(assembly),
      this.dotnetLinkAssembly(assembly),
    ]);
    const readmeMarkdown = assembly.readme && assembly.readme.markdown || 'Oops!';
    return new Document(id, preamble + '\n\n' + readmeMarkdown, { hide_title: true, sidebar_label: 'Overview' });
  }

  public resourcePage(resource: jsiiReflect.ClassType, id: string): Document {
    const props = resource.initializer!.parameters[2].type.fqn as jsiiReflect.InterfaceType;
    const properties = props.getProperties(true).sort(_propertyComparator);

    const markdown = [
      join(' | ', [
        this.typescriptLinkType(resource),
        this.javadocLinkType(resource),
        this.dotnetLinkType(resource),
      ]),
      '',
      resource.docs.docs && resource.docs.docs.comment || '',
      '## Properties',
      'Name | Required | Type',
      '-----|:--------:|-----',
      ...properties.map(_propertiesTableLine),
      ...properties.map(_propertyDetail),
    ].join('\n');

    return new Document(id, markdown, { title: resource.name });

    function _propertiesTableLine(property: jsiiReflect.Property) {
      const badge = property.type.optional ? BADGE_OPTIONAL : BADGE_REQUIRED;
      return [
        `\`${property.name}\``,
        badge,
        _formatType(property.type, resource.assembly),
      ].join('|');
    }

    function _propertyDetail(property: jsiiReflect.Property) {
      return [
        '\n---',
        `### \`${property.name}${property.type.optional ? '?' : ''}\``,
        property.docs.docs.comment && `${property.docs.docs.comment.split('\n').map(l => `> ${l}`).join('\n')}\n`,
        `*${property.type.optional ? 'Optional' : 'Required'}* ${_formatType(property.type, resource.assembly)}`,
        property.docs.docs.default && `, *default:* ${property.docs.docs.default}`,
      ].join('\n');
    }
  }

  public frameworkReferencePage(id: string): Document {
    return new Document(id, 'Lorem Ipsum...', { title: 'Framework Reference', sidebar_label: 'Overview' });
  }

  public serviceReferencePage(id: string): Document {
    return new Document(id, 'Lorem Ipsum...', { title: 'Service Reference', sidebar_label: 'Overview' });
  }

  private javadocLinkAssembly(assembly: jsiiReflect.Assembly) {
    const javaName = javaPackageName(assembly);
    if (!javaName) { return ''; }
    return this.javadocLink(javaName.replace(/\./g, '/') + '/package-summary.html');
  }

  private javadocLinkType(type: jsiiReflect.Type) {
    const javaName = javaTypeName(type);
    if (!javaName) { return ''; }
    return this.javadocLink(javaName.replace(/\./g, '/') + '.html');
  }

  private dotnetLinkAssembly(assembly: jsiiReflect.Assembly): string {
    const name = dotnetPackageName(assembly);
    if (!name) { return ''; }
    return this.dotnetLink(name);
  }

  private dotnetLinkType(type: jsiiReflect.Type): string {
    const name = dotnetTypeName(type);
    if (!name) { return ''; }
    return this.dotnetLink(name);
  }

  private typescriptLinkAssembly(assembly: jsiiReflect.Assembly) {
    const name = typescriptPackageName(assembly);
    return name && this.typescriptLink(name);
  }

  private typescriptLinkType(type: jsiiReflect.Type) {
    const name = typescriptPackageName(type.assembly) + '/' + type.name.toLowerCase();
    return name && this.typescriptLink(name);
  }

  private javadocLink(linkTarget: string) {
    if (!this.opts.javadocPath) { return ''; }
    return `<a href="${this.opts.javadocPath}/index.html?${linkTarget}"><img src="/img/java32.png" class="lang-icon"> JavaDoc</a>`;
  }

  private dotnetLink(linkTarget: string) {
    if (!this.opts.dotnetPath) { return ''; }
    return `<a href="${this.opts.dotnetPath}/api/${linkTarget}.html"><img src="/img/dotnet32.png" class="lang-icon"> .NET Docs</a>`;
  }

  private typescriptLink(linkTarget: string) {
    if (!this.opts.typescriptPath) { return ''; }
    return `<a href="${this.opts.typescriptPath}/api/${linkTarget}.html"><img src="/img/typescript32.png" class="lang-icon"> TypeScript Docs</a>`;
  }
}

function _formatType(reference: jsiiReflect.TypeReference, relativeTo: jsiiReflect.Assembly, quote = true): string {
  if (reference.unionOfTypes) {
    return reference.unionOfTypes.map(ref => _formatType(ref, relativeTo, quote)).join(' *or* ');
  } else if (reference.primitive) {
    return _quoted(reference.primitive);
  } else if (reference.arrayOfType) {
    return _quoted(`Array<${_formatType(reference.arrayOfType, relativeTo, false)}>`);
  } else if (reference.mapOfType) {
    return _quoted(`Map<string, ${_formatType(reference.mapOfType, relativeTo, false)}>`);
  }
  const type = reference.fqn!;
  return type.assembly.name === relativeTo.name
    ? _quoted(type.name)
    : _quoted(type.fqn);

  function _quoted(str: string): string {
    if (!quote) { return str; }
    return '`' + str + '`';
  }
}

function _propertyComparator(l: jsiiReflect.Property, r: jsiiReflect.Property): number {
  if (l.type.optional === r.type.optional) {
    return l.name.localeCompare(r.name);
  } else if (l.type.optional) {
    return 1;
  } else {
    return -1;
  }
}

/**
 * Return the Java name for this type
 */
function javaTypeName(type: jsiiReflect.Type): string | undefined {
  const pkg = javaPackageName(type.assembly);
  if (!pkg) { return undefined; }
  return pkg + '.' + type.name;
}

/**
 * Return the Java name for this type
 */
function javaPackageName(assembly: jsiiReflect.Assembly): string | undefined {
  const java = assembly.targets && assembly.targets.java;
  return java && java.package;
}

/**
 * Return the Java name for this type
 */
function dotnetTypeName(type: jsiiReflect.Type): string | undefined {
  const pkg = dotnetPackageName(type.assembly);
  if (!pkg) { return undefined; }
  return pkg + '.' + type.name;
}

/**
 * Return the Java name for this type
 */
function dotnetPackageName(assembly: jsiiReflect.Assembly): string | undefined {
  const dotnet = assembly.targets && assembly.targets.dotnet;
  return dotnet && dotnet.namespace;
}

function typescriptPackageName(assembly: jsiiReflect.Assembly): string {
  // Our current TypeScript reference generator drops the namespace prefix
  const parts = assembly.name.split('/');
  return parts[parts.length - 1];
}

function join(sep: string, args: string[]) {
  return args.filter(a => a).join(sep);
}
import jsiiReflect = require('jsii-reflect');
import { Document } from './docusaurus';

const BADGE_OPTIONAL = '![Optional](https://img.shields.io/badge/-Optional-inactive.svg)';
const BADGE_REQUIRED = '![Required](https://img.shields.io/badge/-Required-important.svg)';

export interface RenderingOptions {
  javadocPath?: string;
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
    const preamble = [
      this.javadocLinkAssembly(assembly),
      ''].join('\n');
    const readmeMarkdown = assembly.readme && assembly.readme.markdown || 'Oops!';
    return new Document(id, preamble + '\n' + readmeMarkdown, { hide_title: true, sidebar_label: 'Overview' });
  }

  public resourcePage(resource: jsiiReflect.ClassType, id: string): Document {
    const props = resource.initializer!.parameters[2].type.fqn as jsiiReflect.InterfaceType;
    const properties = props.getProperties(true).sort(_propertyComparator);

    const markdown = [
      this.javadocLinkType(resource),
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
    if (!this.opts.javadocPath) { return ''; }
    const javaName = javaPackageName(assembly);
    if (!javaName) { return ''; }

    return this.javadocLink(javaName.replace(/\./g, '/') + '/package-summary.html');
  }

  private javadocLinkType(type: jsiiReflect.Type) {
    if (!this.opts.javadocPath) { return ''; }
    const javaName = javaTypeName(type);
    if (!javaName) { return ''; }
    return this.javadocLink(javaName.replace(/\./g, '/') + '.html');
  }

  private javadocLink(linkTarget: string) {
    return `<a href="${this.opts.javadocPath}/index.html?${linkTarget}"><img src="/img/java32.png" class="lang-icon"> JavaDoc</a>`;
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
  if (!java || !java.package) { return undefined; }

  return java.package;
}
import jsiiReflect = require('jsii-reflect');
import YAML = require('yaml');

export function assemblyOverview(assembly: jsiiReflect.Assembly, id: string): string {
  const markdown = assembly.readme && assembly.readme.markdown || 'Oops!';
  return _addFrontMatter(markdown, { id, hide_title: true, sidebar_label: 'Overview' });
}

export function resourcePage(resource: jsiiReflect.ClassType, id: string): string {
  const props = resource.initializer!.parameters[2].type.fqn as jsiiReflect.InterfaceType;
  const properties = props.getProperties(true).sort(_propertyComparator);

  const markdown = [
    resource.docs.docs && resource.docs.docs.comment || '',
    '## Properties',
    '### Summary',
    'Name | Type',
    '-----|-----',
    ...properties.map(_propertiesTableLine),
    '',
    '### Details',
    ...properties.map(_propertyDetail),
  ].join('\n');
  return _addFrontMatter(markdown, { id, title: resource.name });

  function _propertiesTableLine(property: jsiiReflect.Property) {
    const badge = property.type.optional
      ? '![Optional](https://img.shields.io/badge/-Optional-inactive.svg)'
      : '![Required](https://img.shields.io/badge/-Required-important.svg)';
    return [
      `${badge} \`${property.name}\``,
      _formatType(property.type, resource.assembly),
    ].join('|');
  }

  function _propertyDetail(property: jsiiReflect.Property) {
    return [
      `#### \`${property.name}\``,
      property.docs.docs.comment && `**Description:** ${property.docs.docs.comment}\n`,
      property.docs.docs.default && `**Default Value:** ${property.docs.docs.default}\n`,
    ].join('\n');
  }
}

export function frameworkReferencePage(id: string) {
  return _addFrontMatter('Lorem Ipsum...', { id, title: 'Framework Reference', sidebar_label: 'Overview' });
}

export function serviceReferencePage(id: string): string {
  return _addFrontMatter('Lorem Ipsum...', { id, title: 'Service Reference', sidebar_label: 'Overview' });
}

function _addFrontMatter(document: string, frontMatter: { [key: string]: any }): string {
  return `---\n${YAML.stringify(frontMatter, { schema: 'yaml-1.1' }).trim()}\n---\n${document}`;
}

function _formatType(reference: jsiiReflect.TypeReference, relativeTo: jsiiReflect.Assembly, quote = true): string {
  if (reference.unionOfTypes) {
    return reference.unionOfTypes.map(ref => _formatType(ref, relativeTo, quote)).join(' *or* ');
  } else if (reference.primitive) {
    return _quoted(reference.primitive);
  } else if (reference.arrayOfType) {
    return _quoted(`Array<${_formatType(reference.arrayOfType, relativeTo, false)}>`);
  } else if (reference.mapOfType) {
    return _quoted(`Map<String, ${_formatType(reference.mapOfType, relativeTo, false)}>`);
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

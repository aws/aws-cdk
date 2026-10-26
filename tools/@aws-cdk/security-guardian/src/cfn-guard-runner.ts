import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { Document, DOMParser, XMLSerializer } from '@xmldom/xmldom';
import * as fs from 'fs';

function parseReport(xmlFile: string, xmlContent: string): Document {
  let cause: string | undefined;
  const parser = new DOMParser({
    // Keep line endings from template values as cfn-guard wrote them
    normalizeLineEndings: source => source,
    // Stop at the first error rather than edit a partly parsed report
    onError: (level, message) => {
      if (level !== 'warning') {
        cause = message;
        throw new Error(message);
      }
    },
  });
  try {
    return parser.parseFromString(xmlContent, 'text/xml');
  } catch (err) {
    throw new Error(`Could not parse the cfn-guard report ${xmlFile}: ${cause ?? (err as Error).message}`);
  }
}

function editReport(xmlFile: string, edit: (report: Document) => void): void {
  const xmlContent = fs.readFileSync(xmlFile, 'utf8');
  // The report is empty when cfn-guard did not write one
  if (xmlContent === '') {
    return;
  }

  const report = parseReport(xmlFile, xmlContent);
  edit(report);
  fs.writeFileSync(xmlFile, new XMLSerializer().serializeToString(report));
}

function reverseFilenames(report: Document, fileMapping: Map<string, string>): void {
  for (const testsuite of Array.from(report.getElementsByTagName('testsuite'))) {
    let currentName = testsuite.getAttribute('name') ?? '';
    let resolved = fileMapping.get(currentName);

    while (resolved && resolved !== currentName) {
      currentName = resolved;
      resolved = fileMapping.get(currentName);
    }

    const finalName = currentName;
    testsuite.setAttribute('name', finalName);
    testsuite.setAttribute('file', finalName);
  }
}

export function postProcessXml(outputFile: string, fileMapping: Map<string, string>, type: string): void {
  if (fs.existsSync(outputFile)) {
    editReport(outputFile, report => {
      reverseFilenames(report, fileMapping);

      for (const failure of Array.from(report.getElementsByTagName('failure'))) {
        failure.setAttribute('message', `[Type: ${type}] ${failure.getAttribute('message') ?? ''}`);
      }
    });
  }
}

export function enhanceXmlWithFormattedFailures(xmlFilePath: string): void {
  if (!fs.existsSync(xmlFilePath)) {
    core.warning(`XML file not found: ${xmlFilePath}`);
    return;
  }
  
  editReport(xmlFilePath, report => {
    // Split failure content into new lines based on "Check was not compliant as property"
    for (const failure of Array.from(report.getElementsByTagName('failure'))) {
      const content = failure.textContent ?? '';
      // Extract custom error message from the failure body (one per failure element)
      const customMsgMatch = content.match(/##ERROR:([\s\S]*?)##/);
      if (customMsgMatch) {
        failure.setAttribute('message', customMsgMatch[1]);
      }
      let splitContent = content.replace(/##ERROR:([\s\S]*?)##/g, '');
      splitContent = splitContent.replace(/Check was not compliant as property/g, '\nCheck was not compliant as property');
      failure.textContent = splitContent;
    }
  });
  core.info(`Enhanced XML file with split failure content: ${xmlFilePath}`);
}

export async function runCfnGuardValidation(
  dataDir: string,
  ruleSetPath: string,
  outputFile: string,
  type: string,
  fileMapping: Map<string, string>,
  enhanceXml: boolean = true
): Promise<boolean> {
  // Only the cfn-guard run counts as a finding; an error while editing its report fails the scan
  let passed = true;
  try {
    await exec.exec('sh', [
      '-c',
      `cfn-guard validate --data "${dataDir}" --rules "${ruleSetPath}" --output-format junit --structured --show-summary none > "${outputFile}"`
    ]);
  } catch {
    passed = false;
    core.warning(`⚠️ CFN-Guard (${type}) validation found issues`);
  }

  if (enhanceXml) {
    enhanceXmlWithFormattedFailures(outputFile);
  }
  postProcessXml(outputFile, fileMapping, type);

  if (passed) {
    core.info(`✅ CFN-Guard (${type}) validation passed`);
  }
  return passed;
}
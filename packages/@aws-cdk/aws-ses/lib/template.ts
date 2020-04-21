import * as fs from 'fs';
import { Construct, IResource, Resource } from '@aws-cdk/core';
import { CfnTemplate } from './ses.generated';

/**
 * A Template
 */
export interface ITemplate extends IResource {
  /**
   * The name of the Template.
   * @attribute
   */
  readonly templateName: string;
}

/**
 * Props to use a local file as the ses template
 */
export interface FromFileProps {
    /**
     * The name of the Template
     */
    readonly name?: string;

    /**
     * Path to an html file
     */
    readonly html?: string;

    /**
     * Path to an text file
     */
    readonly text?: string;

    /**
     * The subject line of the email.
     */
    readonly subject?: string;
}

/**
 * Construction properties for a Template.
 */
export interface TemplateProps {
    /**
     * The name of the Template
     */
    readonly name?: string;

    /**
     * The HTML body of the email.
     */
    readonly html?: string;

    /**
     * The subject line of the email.
     */
    readonly subject?: string;

    /**
     * The email body that is visible to recipients whose email clients don't display HTML content. 
     */
    readonly text?: string;
}

/**
 * A new Template.
 */
export class Template extends Resource implements ITemplate {

  public static fromTemplateName(scope: Construct, id: string, templateName: string): ITemplate {
    class Import extends Resource implements ITemplate {
      public readonly templateName = templateName;
    }
    return new Import(scope, id);
  }

  public readonly templateName: string;

  constructor(scope: Construct, id: string, props: TemplateProps) {
    super(scope, id, {
      physicalName: props.name,
    });

    const resource = new CfnTemplate(this, 'Resource', {
      htmlPart: props.html,
      textPart: props.text,
      subjectPart: props.subject,
      templateName: props.name
    });

    this.templateName = resource.ref;
  }

  public static fromFile(scope: Construct, id: string, props: FromFileProps) {
    if (!(props.html || props.text)) {
      throw new Error(`one of htmlPath or textPath is required`);
    }

    let html, text: string;

    if (props.html) {
      html = fs.readFileSync(props.html, 'utf-8');
    }

    if (props.text) {
      text = fs.readFileSync(props.text, 'utf-8');
    }

    return new Template(scope, id, {
      html,
      text,
      subject: props.subject,
      name: props.name
    })
  }
}

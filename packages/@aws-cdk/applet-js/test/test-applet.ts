import { App, Parameter, Stack, StackProps } from '@aws-cdk/cdk';

export interface TestAppletProps extends StackProps {
  prop1: string
  prop2: number
  prop3?: string[]
}

export class TestApplet extends Stack {
  constructor(parent: App, name: string, props: TestAppletProps) {
    super(parent, name, props);

    new Parameter(this, 'P1', { default: this.required(props, 'prop1'), type: 'String' });
    new Parameter(this, 'P2', { default: this.required(props, 'prop2'), type: 'Number' });

    if (props.prop3) {
      new Parameter(this, 'P3', { default: props.prop3.join(','), type: 'StringList' });
    }
  }
}

export interface AppletProps extends StackProps {
  desc?: string
}

export class Applet extends Stack {
  constructor(parent: App, name: string, props: AppletProps) {
    super(parent, name);

    this.templateOptions.description = props.desc;
  }
}

import { App, Construct, Parameter, Stack, StackProps } from '@aws-cdk/cdk';

export interface TestAppletProps extends StackProps {
  prop1: string
  prop2: number
  prop3?: string[]
}

export class TestApplet extends Stack {
  constructor(scope: App, scid: string, props: TestAppletProps) {
    super(scope, scid, props);

    new Parameter(this, 'P1', { default: this.node.required(props, 'prop1'), type: 'String' });
    new Parameter(this, 'P2', { default: this.node.required(props, 'prop2'), type: 'Number' });

    if (props.prop3) {
      new Parameter(this, 'P3', { default: props.prop3.join(','), type: 'StringList' });
    }
  }
}

export interface AppletProps extends StackProps {
  desc?: string
}

export class Applet extends Stack {
  constructor(scope: App, scid: string, props: AppletProps) {
    super(scope, scid);

    this.templateOptions.description = props.desc;
  }
}

interface NoStackAppletProps {
  argument: string;
}

export class NoStackApplet extends Construct {
  constructor(scope: Construct, scid: string, props: NoStackAppletProps) {
    super(scope, scid);

    new Parameter(this, 'P1', { default: props.argument, type: 'String' });
  }
}
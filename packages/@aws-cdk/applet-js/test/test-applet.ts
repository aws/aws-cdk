import { App, CfnParameter, Construct, Stack, StackProps } from '@aws-cdk/cdk';

export interface TestAppletProps extends StackProps {
  prop1: string
  prop2: number
  prop3?: string[]
}

export class TestApplet extends Stack {
  constructor(scope: App, id: string, props: TestAppletProps) {
    super(scope, id, props);

    new CfnParameter(this, 'P1', { default: this.node.required(props, 'prop1'), type: 'String' });
    new CfnParameter(this, 'P2', { default: this.node.required(props, 'prop2'), type: 'Number' });

    if (props.prop3) {
      new CfnParameter(this, 'P3', { default: props.prop3.join(','), type: 'StringList' });
    }
  }
}

export interface AppletProps extends StackProps {
  desc?: string
}

export class Applet extends Stack {
  constructor(scope: App, id: string, props: AppletProps) {
    super(scope, id);

    this.templateOptions.description = props.desc;
  }
}

interface NoStackAppletProps {
  argument: string;
}

export class NoStackApplet extends Construct {
  constructor(scope: Construct, id: string, props: NoStackAppletProps) {
    super(scope, id);

    new CfnParameter(this, 'P1', { default: props.argument, type: 'String' });
  }
}

import { ISynthesisSession, Stack, SynthesisOptions, Synthesizer } from '@aws-cdk/cdk';
import fs = require('fs');
import path = require('path');

export class SynthUtils {
  public static toCloudFormation(stack: Stack, options: SynthesisOptions = { }): any {
    const session = this.synthesize(stack, options);
    return this.templateForStackName(session, stack.name);
  }

  public static templateForStackName(session: ISynthesisSession, stackName: string): any {
    const fileName = session.getArtifact(stackName).properties!.templateFile;
    const filePath = path.join(session.outdir, fileName);
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  public static synthesize(stack: Stack, options: SynthesisOptions): ISynthesisSession {
    const synth = new Synthesizer();
    return synth.synthesize(stack, options);
  }
}

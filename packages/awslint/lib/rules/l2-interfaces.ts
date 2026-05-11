import { Linter } from '../linter';

const INTERFACE_EXTENDS_REF = 'interface-extends-ref';

// lint all interfaces that are L2 interfaces
export const l2InterfaceLinter = new Linter(asm => {
  const iResource = asm.system.findInterface('aws-cdk-lib.IResource');

  return asm.allInterfaces.filter(i => i !== iResource && i.extends(iResource));
});

l2InterfaceLinter.add({
  code: INTERFACE_EXTENDS_REF,
  message: 'L2 interface API should also extend the corresponding Ref interface (`interface IXxx extends IXxxRef`)',
  eval: e => {
    const bases = e.ctx.getInterfaces(true);

    e.assert(bases.some(b => b.name.endsWith('Ref')), e.ctx.fqn);
  },
});

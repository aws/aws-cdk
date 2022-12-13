import React from 'react';
import { Tree, TreeNodeInfo, Button, Card, Elevation, Colors, FormGroup, HTMLSelect, Checkbox } from '@blueprintjs/core';
import { useAppState, StateAction } from './app-state';
import { ITypeMappingFactory, MappingParameter } from '@aws-cdk/l2gen/lib/mapping/mappings';


export function App() {
  const [appState] = useAppState();

  return (
    <div className="App" style={{ display: 'flex', height: '100vh', width: '100%', background: Colors.LIGHT_GRAY4, padding: 20, gap: 20 }}>
      <Card elevation={Elevation.TWO} style={{ flex: 'none', width: '40em', overflow: 'auto', padding: '5px 10px', background: Colors.WHITE }}>
        <h3 className='bp4-heading' style={{ marginLeft: 10 }}>Types</h3>
        <TypesList/>
      </Card>
      <div style={{ flex: 'none', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        <Card elevation={Elevation.TWO} style={{background: Colors.WHITE}}>
          <h3 className='bp4-heading' style={{ marginLeft: 10 }}>Possible translations</h3>
          <MappingList />
        </Card>
        { appState.selectedMapping && <Card elevation={Elevation.TWO} style={{ marginTop: 10 }}>
          <h3 className='bp4-heading' style={{ marginLeft: 10 }}>{ appState.selectedMapping.description }</h3>
          <MappingProperties mappingFactory={appState.selectedMapping}/>
          </Card> }
      </div>
      <div style={{ flex: '1 1 0%' }}>
        <Card elevation={Elevation.TWO} style={{background: Colors.WHITE, height: '100%', width: '100%', overflow: 'auto' }}>
          <h3 className='bp4-heading' style={{ marginLeft: 10 }}>Preview</h3>
          <TypePreview />
        </Card>
      </div>
    </div>
  );
}

export function TypesList() {
  const [appState, dispatch] = useAppState();

  const treeContents = appState.mappings.map((tpMap): TreeNodeInfo => {
    const isLockedIn = appState.typeMapper.hasLockIn(tpMap.id);

    return {
      id: tpMap.id,
      label: tpMap.id,
      isSelected: appState.selectedType?.id === tpMap.id,
      disabled: tpMap.possibleMappings.length === 0,
      icon: isLockedIn ? 'tick' : 'waves',
      className: isLockedIn ? 'text-green' : undefined,
    };
  });

  return <Tree
    contents={treeContents}
    onNodeClick={(x) => dispatch({ action: 'selectType', id: `${x.id}` })}
  />;
}

export function MappingList() {
  const [appState, dispatch] = useAppState();

  const factories = appState.selectedType?.possibleMappings ?? [];

  const treeContents = factories.map((fac): TreeNodeInfo => {
    const isLockedIn = appState.typeMapper.isLockedIn(fac);

    return {
      id: fac.mapperId,
      label: fac.description,
      isSelected: appState.selectedMapping === fac,
      icon: isLockedIn ? 'tick' : 'wrench',
      className: isLockedIn ? 'text-green' : undefined,
    };
  });

  return <Tree
      contents={treeContents}
      onNodeClick={(x) => dispatch({ action: 'selectMapping', id: `${x.id}` })}
    />;
}

interface MappingPropertiesProps {
  readonly mappingFactory: ITypeMappingFactory;
}

function MappingProperties(props: MappingPropertiesProps) {
  const [appState, dispatch] = useAppState();

  const isLockedIn = appState.typeMapper.isLockedIn(props.mappingFactory);

  return <div>
    {Object.entries(props.mappingFactory.configuration).map(([name, prop]) => <FormGroup
      key={name}
      label={name}
      labelFor={`${name}-input`}>
      <ParameterControl factory={props.mappingFactory} name={name} parameter={prop} />
    </FormGroup>)}
    <Button
      onClick={() => dispatch({ action: 'lockIn', factory: props.mappingFactory })}
      className={isLockedIn ? 'text-green' : undefined}
      icon={isLockedIn ? 'tick' : undefined}
      >Lock in</Button>
  </div>;
}

function ParameterControl(props: { factory: ITypeMappingFactory, name: string, parameter: MappingParameter }) {
  const [, dispatch] = useAppState();
  const { factory, name, parameter } = props;

  switch (parameter.type) {
    case 'select': return <HTMLSelect
        id={`${name}-input`}
        onChange={(e) => dispatch({ action: 'setParameter', factory, parameter, value: e.currentTarget.value })}
        options={parameter.options}
      />;
//      {prop.options.map(option => <option selected={option==prop.value}>{option}</option>)}
    case 'multiselect': return <div>{parameter.options.map((option, i) => <Checkbox
      id={`${name}-input-${i}`}
      key={`${name}-input-${i}`}
      checked={parameter.value.includes(option)}
      onChange={e => {
        let newValue = e.currentTarget.checked && !parameter.value.includes(option)
          ? [...parameter.value, option]
          : !e.currentTarget.checked ? parameter.value.filter(p => p !== option) : parameter.value;

        dispatch({
          action: 'setParameter',
          factory,
          parameter,
          value: newValue,
        });
      }}
      >{option}</Checkbox>)}</div>;
  }
}

export function TypePreview() {
  const [appState, dispatch] = useAppState();

  const factory = appState.selectedMapping;
  if (!factory) { return null; }

  const generatedType = factory.lockInConfiguration();
  const example = appState.typeMapper.generateExample(generatedType);
  const alsoLocksIn = generatedType.coveredSchemaLocations.filter(x => x !== appState.selectedType?.id);

  const exampleRefs = splitReferences(example);

  return <div>
    <pre style={{ lineHeight: '1.8em' }}>{exampleRefs.map((ref, i) => {
      switch (ref.type) {
        case 'literal': return <span key={`k${i}`}>{ref.literal}</span>;
        case 'reference': return ClickableReference(`k${i}`, ref.reference, dispatch);
      }
    })}</pre>
    { alsoLocksIn.length > 0 ? <div>
      <span style={{color: 'red'}}>Also locks in</span>
      {alsoLocksIn.map(x => <div key={x} style={{color: 'red'}}>{x}</div>)}
    </div>
    : undefined}
  </div>;
}

export function ClickableReference(key: string, schemaLocation: string, dispatch: React.Dispatch<StateAction>) {
  return <span
    key={key}
    style={{ color: 'red', cursor: 'pointer', padding: '3px 5px', background: Colors.LIGHT_GRAY4, borderStyle: 'solid', borderColor: Colors.LIGHT_GRAY1, borderWidth: 1 }}
    onClick={() => dispatch({ action: 'selectType', id: schemaLocation })}
    >{schemaLocation}</span>;
}

function splitReferences(x: string): SplitPart[] {
  const re  = /<UNMAPPED:([^>]+)>/g;

  const ret = new Array<SplitPart>();
  let lastIndex = re.lastIndex;
  let m = re.exec(x);
  while (m) {
    if (m.index > lastIndex) {
      ret.push({ type: 'literal', literal: x.slice(lastIndex, m.index) });
    }

    ret.push({ type: 'reference', reference: m[1] });

    lastIndex = re.lastIndex;
    m = re.exec(x);
  }
  if (x.length > lastIndex) {
    ret.push({ type: 'literal', literal: x.slice(lastIndex, x.length) });
  }

  return ret;
}

type SplitPart =
  | { readonly type: 'literal'; readonly literal: string }
  | { readonly type: 'reference'; readonly reference: string }
  ;

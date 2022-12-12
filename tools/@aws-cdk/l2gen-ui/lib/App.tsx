import React from 'react';
import { Tree, TreeNodeInfo, Button, Card, Elevation, Colors, FormGroup, HTMLSelect, Checkbox } from '@blueprintjs/core';
import { useAppState } from './app-state';
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
    return {
      id: tpMap.id,
      label: tpMap.id,
      isSelected: appState.selectedType?.id === tpMap.id,
      icon: 'waves',
      disabled: tpMap.possibleMappings.length === 0,
    };
  });

  return <Tree
    contents={treeContents}
    onNodeClick={(x) => dispatch({ action: 'selectType', id: `${x.id}` })}
  />;
}

export function MappingList() {
  const [appState, dispatch] = useAppState();

  const suggestions = appState.selectedType?.possibleMappings ?? [];

  const treeContents = suggestions.map((sugg): TreeNodeInfo => {
    return {
      id: sugg.mapperId,
      label: sugg.description,
      isSelected: appState.selectedMapping === sugg,
      icon: 'wrench',
    };
  });

  return <Tree
      contents={treeContents}
      onNodeClick={(x) => dispatch({ action: 'selectMapping', id: `${x.id}` })}
    />;
}

interface MappingPropertiesProps {
  readonly mappingFactory: ITypeMappingFactory<any>;
}

function MappingProperties(props: MappingPropertiesProps) {
  return <div>
    {Object.entries(props.mappingFactory.configuration).map(([name, prop]) => <FormGroup
      key={name}
      label={name}
      labelFor={`${name}-input`}>
      {ParameterControl(props.mappingFactory, name, prop)}
    </FormGroup>)}
    <Button>Lock in</Button>
  </div>;
}

function ParameterControl(factory: ITypeMappingFactory<any>, name: string, parameter: MappingParameter) {
  const [, dispatch] = useAppState();
  console.log('rendering prop', name);

  switch (parameter.type) {
    case 'select': return <HTMLSelect
        id={`${name}-input`}
        onChange={(e) => dispatch({ action: 'setParameter', factory, parameter, value: e.currentTarget.value })}
        options={parameter.options}
      />;
//      {prop.options.map(option => <option selected={option==prop.value}>{option}</option>)}
    case 'multiselect': return parameter.options.map((option, i) => <Checkbox
      id={`${name}-input-${i}`}
      key={`${name}-input-${i}`}
      checked={parameter.value.includes(option)}
      onChange={e => {
        if (e.currentTarget.checked) {
          if (!parameter.value.includes(option)) {
            console.log('check event');
            parameter.set([...parameter.value, option]);
          }
        } else {
          console.log('uncheck event');
          parameter.set(parameter.value.filter(p => p !== option));
        }
      }}
      >{option}</Checkbox>);
  }
}

export function TypePreview() {
  const [appState] = useAppState();

  const factory = appState.selectedMapping;
  if (!factory) { return null; }

  const generatedType = factory.lockInConfiguration();
  const example = appState.typeMapper.generateExample(generatedType);
  const alsoLocksIn = generatedType.coveredSchemaLocations.filter(x => x !== appState.selectedType?.id);

  return <div>
    <pre>{example}</pre>
    { alsoLocksIn.length > 0 ? <div>
      <span style={{color: 'red'}}>Also locks in</span>
      {alsoLocksIn.map(x => <div key={x} style={{color: 'red'}}>{x}</div>)}
    </div>
    : undefined}
  </div>;
}
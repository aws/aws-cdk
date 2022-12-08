import React, { useState } from 'react';
import { Tree, TreeNodeInfo } from '@blueprintjs/core';
import { MappableType } from '@aws-cdk/l2gen';

interface Props {
  readonly suggestions: ReadonlyArray<MappableType>;
}

export function App(props: Props) {
  const [selectedNode, selectNode] = useState<string>('');

  const treeContents: TreeNodeInfo[] = props.suggestions.map((tpMap): TreeNodeInfo => {
    const mapId = tpMap.schemaLocation;
    return {
      id: tpMap.schemaLocation,
      label: tpMap.schemaLocation,
      isSelected: selectedNode === mapId,
      icon: 'compass',
      isExpanded: true,
      childNodes: tpMap.suggestions.map((sugg, i): TreeNodeInfo => {
        const suggId = `${mapId}.${i}`;
        return {
          id: suggId,
          label: sugg.description,
          isSelected: selectedNode === suggId,
          icon: 'wrench',
        };
      }),
    };
  });

  const selectionParts = selectedNode.split('.');
  const currentSuggestion = props.suggestions.find(s => s.schemaLocation === selectionParts[0])?.suggestions.find((_, i) => `${i}` === selectionParts[1]);

  return (
    <div className="App" style={{ display: 'flex' }}>
      <div style={{ flex: 0, width: '40em' }}>
        <Tree
          contents={treeContents}
          onNodeClick={(x) => selectNode(`${x.id}`) }
        />
      </div>
      <div style={{ flex: 1 }}>
        <pre>{currentSuggestion?.example}</pre>
      </div>
    </div>
  );
}

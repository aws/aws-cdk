import React, { ReducerAction, Dispatch } from 'react';
import { createContext, useContext, useReducer } from 'react'
import { MappableType } from '@aws-cdk/l2gen';
import { ITypeMappingFactory, MappingParameter } from '@aws-cdk/l2gen/lib/mapping/mappings';
import { TypeMapper } from '@aws-cdk/l2gen/lib/mapping/type-mappings';

//////////////////////////////////////////////////////////////////////
// The state we're maintaining

export interface AppState {
  readonly typeMapper: TypeMapper;
  readonly mappings: MappableType[];
  readonly selectedType?: MappableType;
  readonly selectedMapping?: ITypeMappingFactory<any>;
}

export type StateAction =
  | { action: 'selectType'; id: string }
  | { action: 'selectMapping'; id: string }
  | { action: 'setParameter'; factory: ITypeMappingFactory<any>, parameter: MappingParameter; value: unknown }
  ;

function reducer(state: AppState, action: StateAction): AppState {
  switch (action.action) {
    case 'selectType': {
      const selectedType = state.mappings.find(m => m.id === action.id);
      return { ...state,
        selectedType,
        selectedMapping: selectedType?.possibleMappings?.[0],
      };
    }
    case 'selectMapping':
      return { ...state, selectedMapping: state.selectedType?.possibleMappings.find(m => m.mapperId === action.id) };
    case 'setParameter':
      action.parameter.set(action.value as any);
      action.factory.validateConfiguration();
      return { ...state };
    default:
      return state;
  }
}

//////////////////////////////////////////////////////////////////////
// Using the state in a component. State+reducer travel in context

const AppStateContext = createContext(undefined as unknown as [AppState, Dispatch<ReducerAction<typeof reducer>>]);

export function useAppState() {
  const value = useContext(AppStateContext);
  if (!value) throw new Error('StateProvider missing');
  return value;
}

export function AppStateProvider(props: { children: JSX.Element, initialState: AppState }) {
  return <AppStateContext.Provider  value={useReducer(reducer, props.initialState)}>
    {props.children}
  </AppStateContext.Provider>
};


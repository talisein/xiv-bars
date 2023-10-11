import {
  ReactNode, createContext, useContext, useReducer
} from 'react';
import { SelectedActionProps, SelectedActionDispatchProps } from 'types/SelectedAction';

const InitialSelectedActionState = { selectedAction: undefined };
const SelectedActionContext = createContext<SelectedActionProps>(InitialSelectedActionState);
const SelectedActionDispatchContext = createContext<React.Dispatch<SelectedActionDispatchProps>>(() => undefined);

function selectedActionReducer(state: SelectedActionProps, payload: SelectedActionDispatchProps) {
  switch (payload.type) {
    case 'selectAction': {
      return { selectedAction: payload.selectedAction };
    }
    case 'deselectAction': {
      return { selectedAction: {} };
    }
    default: {
      throw new Error(`Unhandled action type: ${payload.type}`);
    }
  }
}

export function useSelectedActionState() {
  const context = useContext(SelectedActionContext);
  if (context === undefined) {
    throw new Error('useSelectedActionState must be used within a SelectedActionContextProvider');
  }
  return context;
}

export function useSelectedActionDispatch() {
  const context = useContext(SelectedActionDispatchContext);
  if (context === undefined) {
    throw new Error('useSelectedActionDispatch must be used within a SelectedActionContextProvider');
  }
  return context;
}

export function SelectedActionContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    selectedActionReducer,
    InitialSelectedActionState
  );

  return (
    <SelectedActionContext.Provider value={state}>
      <SelectedActionDispatchContext.Provider value={dispatch as React.ReducerWithoutAction<SelectedActionDispatchProps>}>
        {children}
      </SelectedActionDispatchContext.Provider>
    </SelectedActionContext.Provider>
  );
}

export default SelectedActionContextProvider;

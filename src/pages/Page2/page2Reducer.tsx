import React, { useReducer } from 'react';

export type Action ={ type: 'CHANGE_VALUE' | 'CLEAR_VALUE', name: string, value: string }
export type InputDataType = {[index:string]: string};

const initialState: InputDataType = {};

const reducer = (state:InputDataType,  action: Action) => {
  switch (action.type) {
    case 'CHANGE_VALUE':
      return {
        ...state,
        [action.name]: action.value,
      };
      case 'CLEAR_VALUE':
        return {
          ...state,
          [action.name]: '',
        };
    default:
      return state;
  }
};

export const Page2Context = React.createContext({} as {
  state: InputDataType
  dispatch: React.Dispatch<Action>
});

export const Page2ContextProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <Page2Context.Provider value={{state, dispatch}}>
    {children}
  </Page2Context.Provider>;
};

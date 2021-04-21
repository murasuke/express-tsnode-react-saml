import React, { useReducer } from 'react';

// reducerで適切に型推論できるようにするため、Union型でActionを定義する
export type Action =
  { type: 'CHANGE_PAGE_NAME', pageName: string } |
  { type: 'CHANGE_USER', userName: string, userId: string};

// サイト全体で共有する型
export type SiteContextDataType = {
  pageName: string,
  userId: string,
  userName: string,
};

const initialState: SiteContextDataType = {
  pageName: '',
  userId: '',
  userName: '',
};


const reducer = (state:SiteContextDataType,  action: Action) => {
  switch (action.type) {
    case 'CHANGE_PAGE_NAME':
      return {
        ...state,
        pageName: action.pageName,
      };
    case 'CHANGE_USER':
      return {
        ...state,
        userId: action.userId,
        userName: action.userName,
      };
    default:
      return state;
  }
};

export const SiteContext = React.createContext({} as {
  siteState: SiteContextDataType
  siteDispatch: React.Dispatch<Action>
});

export const ContextProvider: React.FC = (props) => {
  const [siteState, siteDispatch] = useReducer(reducer, initialState);
  return <SiteContext.Provider value={{siteState, siteDispatch}}>
    {/* eslint-disable-next-line react/destructuring-assignment */}
    {props.children}
  </SiteContext.Provider>;
};

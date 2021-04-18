import React, { useState, useContext } from 'react';
import { Page2Context } from './page2Reducer';

export type InputPropsType = {
  id:string,
  title: string,
  message:string,
}

export const InputComponent1: React.FC<InputPropsType> = ({ id, title, message }) => {
  const [checked, setChecked] = useState(true);
  const { dispatch } = useContext(Page2Context);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> ) =>{
    setChecked(e.target.value === '1');
    dispatch ({ type: 'CHANGE_VALUE', name: e.target.name, value: e.target.value });
  };

  const rdoNm = `select_${id}`;

  return (
    <div style={{padding:"10px"}}>
      <h3>{title}</h3>
      <div>
        <label htmlFor={`${rdoNm}1`}>
          <input type="radio" id={`${rdoNm}1`} name={rdoNm} value="1" onChange={ handleChange } />はい
        </label> <br />
        <label htmlFor={`${rdoNm}0`}>
          <input type="radio" id={`${rdoNm}0`} name={rdoNm} value="0" onChange={ handleChange } />いいえ
        </label>
        { checked ? ('') : (<> {message}</>) }
      </div>
    </div>
  );
};

/**
 *
 * @param props
 */
export const InputComponent2: React.FC<InputPropsType> = ({ id, title }) => {
  const [checked, setChecked] = useState(true);
  const [inputText, setInputText] = useState('');
  const { dispatch } = useContext(Page2Context);

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement> ) =>{
    setChecked(e.target.value === '1');
    dispatch ({ type: 'CHANGE_VALUE', name: e.target.name, value: e.target.value });
    if(e.target.value === '1'){
      setInputText('');
      dispatch ({ type: 'CLEAR_VALUE',  name: `text_${id}`, value: '' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> ) =>{
    setInputText(e.target.value);
    dispatch ({ type: 'CHANGE_VALUE', name: e.target.name, value: e.target.value });
  };

  const rdoNm = `select_${id}`;

  return (
    <div style={{padding:"10px"}}>
      <h3>{title}</h3>
      <div>
          <label htmlFor={`${rdoNm}1`}>
            <input type="radio" id={`${rdoNm}1`} name={rdoNm} value="1" onChange={ handleRadioChange } />はい
          </label> <br />
          <label htmlFor={`${rdoNm}0`}>
            <input type="radio" id={`${rdoNm}0`} name={rdoNm} value="0" onChange={ handleRadioChange } />いいえ
          </label>
          { checked ? ('') : (<input type="text" name={`text_${id}`} onChange={handleInputChange} value={inputText} />) }
      </div>
    </div>
  );
};

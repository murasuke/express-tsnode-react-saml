import React, { useState } from 'react';

export type InputPropsType = {
  id:string,
  title: string,
  message:string,
  // handleChange: (e: {name:string, value: string, e?: React.ChangeEvent<HTMLInputElement>}) => void
  handleChange: (e: { [index:string]: string }) => void
}

export const InputComponent1: React.FC<InputPropsType> = (props) => {
  const { id, title, message } = props;
  const [checked, setChecked] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> ) =>{
    setChecked(e.target.value === '1');
    props.handleChange({ [e.target.name]: e.target.value });
  };

  const rdoNm = `select_${id}`;

  return (
    <div style={{padding:"10px"}}>
      <h3>{title}</h3>
      <div>
        <label htmlFor={`${rdoNm}`}>
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

export const InputComponent2: React.FC<InputPropsType> = (props) => {
  const { id, title } = props;
  const [checked, setChecked] = useState(true);
  const [inputText, setInputText] = useState('');

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement> ) =>{
    setChecked(e.target.value === '1');
    if(e.target.value === '1'){
      setInputText('');
      props.handleChange({ [e.target.name]: e.target.value, [`text_${props.id}`]: '' });
    } else{
      props.handleChange({ [e.target.name]: e.target.value });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> ) =>{
    setInputText(e.target.value);
    props.handleChange({ [e.target.name]: e.target.value });
  };

  const rdoNm = `select_${id}`;

  return (
    <div style={{padding:"10px"}}>
      <h3>{title}</h3>
      <div>
        <label htmlFor={`${rdoNm}1`}>
          <input type="radio" id={`${rdoNm}1`} name={rdoNm} value="1" onChange={handleRadioChange} />はい
        </label> <br />
        <label htmlFor={`${rdoNm}0`}>
          <input type="radio" id={`${rdoNm}0`} name={rdoNm} value="0" onChange={handleRadioChange} />いいえ
        </label>
        { checked ? ('') : (<input type="text" name={`text_${id}`} onChange={handleInputChange} value={inputText} />) }
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { InputComponent1, InputComponent2 } from './InputComponent';
import { postPage1 } from '../../utils/api';


/**
 * ・フォーム全体の入力値(inputData)は、Page1が保持する
 * ・入力コンポーネントには、変更用コールバック(handleChange)を渡し、値変更時にコールバックして書き換える。
 * ・ページとコンポーネントの階層が深くない場合これでも良いが、深くなるとpropsで子、孫と順次コールバック関数を引き渡すことになり
 *   コンポーネントの独立性が失われてしまう
 */
 const Page1: React.FC = ()=> {
  const [inputData, setInputData] = useState({});
  const handleChange = (e: { [index:string]: string }) => {
    // stateを入力データとマージする
    setInputData((prevState) => (
      {
        ...prevState,
        ...e,
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(inputData);
    // alert(JSON.stringify(inputData, null , '\t'));

    // バックエンドへ送信
    const response = await postPage1(inputData);
    if( response.status !== 200 ){
      console.log(response.statusText);
    }
  };

    return (
      <>
        <h3>Page1</h3>
        <ul>
            <li><Link to="/">TopMenu</Link></li>
        </ul>
        <form onSubmit={ handleSubmit }>
          <InputComponent1 id="id1" title="title1" message="message1" handleChange={handleChange} />
          <InputComponent1 id="id2" title="title2" message="message2" handleChange={handleChange} />
          <InputComponent2 id="id3" title="title3" message="message3" handleChange={handleChange} />
          <InputComponent2 id="id4" title="title4" message="message4" handleChange={handleChange} />
          <p>
            <input type="submit" value="登録" />
          </p>
        </form>
        <br />
 * ・フォーム全体の入力値(inputData)は、Page1が保持する<br />
 * ・入力コンポーネントには、変更用コールバック(handleChange)を渡し、値変更時にコールバックして書き換える。<br />
 * ・ページとコンポーネントの階層が深くない場合これでも良いが、深くなるとpropsで子、孫と順次コールバック関数を引き渡すことになり<br />
 *   コンポーネントの独立性が失われてしまう<br />
      </>
    );
};

export default Page1;

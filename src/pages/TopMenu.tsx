import React, { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import { getSearchResults } from "../utils/api";
import { SiteContext } from '../utils/SiteContext';
import SearchResultList from "../component/SearchResultList";


const TopMenu: React.FC = () => {
    const [inputVal, setInputVal] = useState('');
    const [searchResult, setSearchResult] = useState<any[]>([]);

    const { dispatch: siteDispatch } = useContext(SiteContext);
    useEffect( () => {
      siteDispatch({ type: 'CHANGE_PAGE_NAME', pageName: 'TopPage' });
    },[]);

    const onKeyPress: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
      if(e.key === "Enter") {
        e.preventDefault();
        handleClick(e);
      }
    };

    const handleClick: React.ReactEventHandler = async() => {
      const jsonResult = await getSearchResults({key: inputVal});
      setSearchResult(jsonResult);
    };

    return (
      <>
        <h3>TopMenu</h3>
        <div style={ {margin:"1vw", padding:"1vw", backgroundColor:"#DDE"} }>
          <div style={ {border:"1px solid #AAA"} } >
            <input value={inputVal} onChange={(e) => setInputVal(e.target.value)} onKeyPress={onKeyPress} />
            <button type="button" onClick={handleClick}>検索</button>
            <SearchResultList results={searchResult} />
          </div>
          <div>
            <p><Link to="/Page1"><button type="button">Page1</button></Link> サンプル１：関数コンポーネント＋Hookでフォーム入力データをPostするサンプル</p>
            <p><Link to="/Page2"><button type="button">Page2</button></Link> サンプル２：上記に加え、useContextでデータ保持してPost(Reduxは未使用)</p>
          </div>
        </div>
      </>
    );
  };

  export default TopMenu;

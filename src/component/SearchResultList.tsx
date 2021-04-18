import React from 'react';

const SearchResultList: React.FC<any> = (props) => {
  const { results } = props;
  return (
    <>
      <div>SearchResultList</div>
      <ul>
        {results.map((res: any)=> <li key={res.id}>{res.data}</li>) }
      </ul>
    </>);
};

export default SearchResultList;

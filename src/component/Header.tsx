import React from 'react';
import { SiteContextDataType } from '../utils/SiteContext';

const Header: React.FC<SiteContextDataType> =
  ({ pageName, userId, userName }) => <h2>{pageName}:{userId}:{userName}</h2>;

export default Header;

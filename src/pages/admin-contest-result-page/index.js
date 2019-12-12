import React from 'react';
import Loadable from 'react-loadable';
import { Loading } from 'components';

export default Loadable({
  loader: () => import('./admin-contest-results-page'),
  loading: () => <Loading />
});

import React from 'react';
import Loadable from 'react-loadable';
import { Loading } from 'components';

export default Loadable({
  loader: () => import('./playground-my-shared-contests-page'),
  loading: () => <Loading />
});

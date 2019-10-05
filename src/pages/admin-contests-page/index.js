import React from 'react';
import Loadable from 'react-loadable';
import {Loading} from 'components';

export default Loadable({
    loader: () => import('./admin-contests-page'),
    loading: () => <Loading/>
});

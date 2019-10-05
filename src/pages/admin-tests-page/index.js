import React from 'react';
import Loadable from 'react-loadable';
import {Loading} from 'components';

export default Loadable({
    loader: () => import('./admin-tests-page'),
    loading: () => <Loading/>
});

import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import ListLayout from './components/ListLayout';


import './custom.css'

export default () => (
    <Layout>
        <Route exact path='/' component={ListLayout} />
    </Layout>
);

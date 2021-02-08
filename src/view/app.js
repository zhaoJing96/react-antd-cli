import React, { Fragment, Suspense, lazy } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import router from '@/common/router';
import { LoadingSpin } from '@/view/component';

//全局顶层模块
const PageNoFind = lazy(() => import('@/view/exception/404'));
const Error = lazy(() => import('@/view/exception/error'));
const Main = lazy(() => import('@/view/main'));
const HomeWapper = lazy(() => import('@/view/home'));
const Login = lazy(() => import('@/view/login'));
//home

export default function View() {

    return <Fragment>
        <Router history={router}>
            <Suspense fallback={<LoadingSpin />}>
                <Switch>
                    <Route exact path="/" component={Main} />
                    <Route path="/home/*">
                        <HomeWapper>
                            <Switch>
                                {/* 菜单页面 */}
                                <Route component={PageNoFind} />
                            </Switch>
                        </HomeWapper>
                    </Route>
                    <Route path="/login" component={Login} />
                    <Route path="/error" component={Error} />
                    <Route component={PageNoFind} />
                </Switch>
            </Suspense>
        </Router>
    </Fragment >;
}
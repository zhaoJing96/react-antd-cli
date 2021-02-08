import React, { } from 'react';
import { Tabs } from 'antd';
import { LoadingSpin } from '@/view/component';
const { TabPane } = Tabs;

//component
export default function ReduxDemo() {
    return <React.Suspense fallback={<LoadingSpin />}>
        <Tabs defaultActiveKey="1" type="card">
            <TabPane tab="redux" key="1">
                1111111
            </TabPane>
            <TabPane tab="redux,react-redux" key="2">
                2222222
            </TabPane>
            <TabPane tab="redux,redux-thunk" key="3">
                3333333
            </TabPane>
        </Tabs>
    </React.Suspense>;
}
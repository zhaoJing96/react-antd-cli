import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Row, Col } from 'antd';
import Logo from "../component/logo";

export default function Main() {
    return <div className="guide_container">
        <Row className="head" style={{ lineHeight: '60px' }}>
            <Col span={8} offset={4} className="flex_between">
                <Logo />
            </Col>
            <Col span={8} className="flex_between">
                <div className='login_box'>
                    <Link to="/login">
                        <Button className="login_btn" type="primary" ghost>登录</Button>
                    </Link>
                </div>
            </Col>
        </Row>
        <Row className='info'>
            <Col span={8} offset={4}>
                引导页
            </Col>
        </Row>
    </div>;
}
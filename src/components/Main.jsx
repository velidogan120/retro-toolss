"use client"
import React from 'react'
import { store } from '../redux/store'
import { Provider } from 'react-redux'
import Task from './Task'
import { Col, Row } from 'antd'

const Main = () => {
  return (
    <Provider store={store}>
        <Row gutter={[2, 2]}>
          <Col xs={24} sm={12} md={8} lg={6} >
            <Task />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Task />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Task />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Task />
          </Col>
        </Row>
    </Provider>
  )
}

export default Main
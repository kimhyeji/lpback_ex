import React, { Component } from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";

import CpuUsage from "../components/CpuUsage";
import Traffic from "../components/Traffic";
import RealTime from "../components/RealTime";
import RTLine from "../components/RTLine";
import RTStack from "../components/RTStack";
import RTBrush from "../components/RTBrush";
import TimeseriesChart from "../components/TimeseriesChart";
// import ApexChart from "../components/ApexChart";

import Header from "../components/Header";
import Distribution from "../components/Distribution";
import Messages from "../components/Messages";

const Label = ({ title }) => (
  <div
    style={{
      width: "100%",
      background: "#2c3e50",
      color: "#fff",
      height: 35,
      textAlign: "center",
      fontSize: "1.3em",
      padding: 4,
    }}
  >
    {title}
  </div>
);

export default class Home extends Component {
  render() {
    return (
      <div>
        <Header />
        <div style={{ margin: "20px 40px" }}>
          <h2>Dashboard</h2>
          <Row type="flex" gutter={8}>
            <Col span={6}>
              <CpuUsage />
              <Label title="Avg CPU Usage" />
            </Col>

            <Col span={24}>
              <Traffic />
              <Label title="Traffic heartbeat" />
            </Col>

            <Col span={24}>
              <RealTime />
              <Label title="RealTime heartbeat" />
            </Col>

            <Col span={24}>
              <RTLine />
              <Label title="RTLine heartbeat" />
            </Col>
            <Col span={24}>
              <RTStack />
              <Label title="RTStack heartbeat" />
            </Col>
            <Col span={24}>
              <RTBrush />
              <Label title="RTBrush heartbeat" />
            </Col>
            {/* <Col span={24}>
              <TimeseriesChart />
              <Label title="Timeseries heartbeat" />
            </Col> */}
            {/* <Col span={24}>
              <ApexChart />
              <Label title="ApexChart heartbeat" />
            </Col> */}

            {/* <Col span={6}>
              <Distribution />
              <Label title="Region Distribution" />
            </Col> */}
          </Row>
          <br />
          {/* <h2>Alerts</h2>
          <Row type="flex" gutter={8}>
            <Messages />
          </Row> */}
        </div>
      </div>
    );
  }
}

import React, { Component } from "react";
import moment from "moment";

import {
  Collection,
  TimeSeries,
  TimeEvent,
  IndexedEvent,
  TimeRange,
} from "pondjs";

import {
  ChartContainer,
  ChartRow,
  Charts,
  YAxis,
  LineChart,
  BarChart,
  Resizable,
} from "react-timeseries-charts";

import aapl from "./aapl_historical.json";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import Loading from "./Loading";

const QUERY = gql`
  query Traffic {
    traffic {
      dps {
        timestamp
        value
      }
      total
    }
  }
`;

const SUBSCRIPTION = gql`
  subscription Traffic {
    traffic {
      dps {
        timestamp
        value
      }
      total
    }
  }
`;

const name = "AAPL-price";
const columns = ["time", "open", "close", "low", "high"];
const events = aapl.map((item) => {
  const timestamp = moment(new Date(item.date));
  const { open, close, low, high } = item;
  return new TimeEvent(timestamp.toDate(), {
    open: +open,
    close: +close,
    low: +low,
    high: +high,
  });
});
const collection = new Collection(events);
const sortedCollection = collection.sortByTime();
const series = new TimeSeries({ name, columns, collection: sortedCollection });

//
// Volume
//

const volumeEvents = aapl.map((item) => {
  const index = item.date.replace(/\//g, "-");
  const { volume } = item;
  return new IndexedEvent(index, { volume: +volume });
});
const volumeCollection = new Collection(volumeEvents);
const sortedVolumeCollection = volumeCollection.sortByTime();

const seriesVolume = new TimeSeries({
  name: "AAPL-volume",
  utc: false,
  collection: sortedVolumeCollection,
});

class TimeseriesChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "log",
      timerange: new TimeRange([1623054867, 1329941520000]),
    };
  }

  handleTimeRangeChange = (timerange) => {
    this.setState({ timerange });
  };

  setModeLinear = () => {
    this.setState({ mode: "linear" });
  };

  setModeLog = () => {
    this.setState({ mode: "log" });
  };
  componentDidMount() {
    this.props.subscribeToNewData();
  }

  renderChart = () => {
    const { timerange } = this.state;
    const croppedSeries = series.crop(timerange);
    const croppedVolumeSeries = seriesVolume.crop(timerange);
    return (
      <ChartContainer
        timeRange={timerange}
        hideWeekends={true}
        enablePanZoom={true}
        onTimeRangeChanged={this.handleTimeRangeChange}
        timeAxisStyle={{ axis: { fill: "none", stroke: "none" } }}
      >
        <ChartRow height="300">
          <Charts>
            <LineChart
              axis="y"
              style={{ close: { normal: { stroke: "steelblue" } } }}
              columns={["close"]}
              series={croppedSeries}
              interpolation="curveBasis"
            />
          </Charts>
          <YAxis
            id="y"
            label="Price"
            min={croppedSeries.min("close")}
            max={croppedSeries.max("close")}
            format=",.0f"
            width="60"
            type={this.state.mode}
          />
        </ChartRow>
        <ChartRow height="200" axisMargin={0}>
          <Charts>
            <BarChart
              axis="y"
              style={{ volume: { normal: { stroke: "steelblue" } } }}
              columns={["volume"]}
              series={croppedVolumeSeries}
            />
          </Charts>
          <YAxis
            id="y"
            label="Volume"
            min={croppedVolumeSeries.min("volume")}
            max={croppedVolumeSeries.max("volume")}
            width="60"
          />
        </ChartRow>
      </ChartContainer>
    );
  };

  render() {
    const linkStyle = {
      fontWeight: 600,
      color: "grey",
      cursor: "default",
    };

    const linkStyleActive = {
      color: "steelblue",
      cursor: "pointer",
    };
    const { data } = this.props;

    return (
      <div>
        <div className="row">
          <div className="col-md-12" style={{ fontSize: 14, color: "#777" }}>
            <span
              style={this.state.mode === "log" ? linkStyleActive : linkStyle}
              onClick={this.setModeLinear}
            >
              Linear
            </span>
            <span> | </span>
            <span
              style={this.state.mode === "linear" ? linkStyleActive : linkStyle}
              onClick={this.setModeLog}
            >
              Log
            </span>
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col-md-12">
            <Resizable>{this.renderChart()}</Resizable>
          </div>
        </div>
      </div>
    );
  }
}

export default class TrafficContainer extends Component {
  render() {
    return (
      <div style={{ border: "1px solid #2c3e50", height: 630 }}>
        <Query query={QUERY}>
          {({ subscribeToMore, ...result }) => (
            <TimeseriesChart
              {...result}
              subscribeToNewData={() =>
                subscribeToMore({
                  document: SUBSCRIPTION,
                  updateQuery: (prev, { subscriptionData }) => {
                    if (!subscriptionData.data) return prev;
                    return subscriptionData.data;
                  },
                })
              }
            />
          )}
        </Query>
      </div>
    );
  }
}

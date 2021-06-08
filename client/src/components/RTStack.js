import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { VictoryChart, VictoryTheme, VictoryStack, VictoryArea } from "victory";

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

class RTStack extends Component {
  componentDidMount() {
    this.props.subscribeToNewData();
  }

  render() {
    const { data, error, loading } = this.props;
    if (loading) {
      return <Loading />;
    }
    if (error) {
      return <p>Error!</p>;
    }
    return (
      <VictoryChart
        width={1000}
        events={[
          {
            childName: "all",
            target: "data",
            eventHandlers: {
              onClick: () => {
                return [
                  {
                    childName: "area-2",
                    target: "data",
                  },
                  {
                    childName: "area-3",
                    target: "data",
                    mutation: (props) => ({
                      style: Object.assign({}, props.style, { fill: "red" }),
                    }),
                  },
                ];
              },
            },
          },
        ]}
      >
        <VictoryStack>
          <VictoryArea
            style={{ data: { fill: "rgb(187, 68, 204)" } }}
            name="area-1"
            data={data.traffic.dps.map((item) => ({
              x: item.timestamp,
              y: item.value,
            }))}
          />
          <VictoryArea
            style={{ data: { fill: "rgb(34, 170, 153)" } }}
            name="area-2"
            data={data.traffic.dps.map((item) => ({
              x: item.timestamp,
              y: item.value,
            }))}
          />
          <VictoryArea
            style={{ data: { fill: "rgb(221, 221, 0)" } }}
            name="area-3"
            data={data.traffic.dps.map((item) => ({
              x: item.timestamp,
              y: item.value,
            }))}
          />
        </VictoryStack>
      </VictoryChart>
    );
  }
}

export default class RTStackContainer extends Component {
  render() {
    return (
      <div style={{ border: "1px solid #2c3e50", height: 300 }}>
        <Query query={QUERY}>
          {({ subscribeToMore, ...result }) => (
            <RTStack
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

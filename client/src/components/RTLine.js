import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { VictoryChart, VictoryTheme, VictoryLine } from "victory";

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

class RTLine extends Component {
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
      <VictoryChart theme={VictoryTheme.material} width={1000}>
        <VictoryLine
          style={{
            data: { stroke: "rgb(255, 85, 136)" },
          }}
          data={data.traffic.dps.map((item) => ({
            x: item.timestamp,
            y: item.value,
          }))}
        />
      </VictoryChart>
    );
  }
}

export default class RTLineContainer extends Component {
  render() {
    return (
      <div style={{ border: "1px solid #2c3e50", height: 300 }}>
        <Query query={QUERY}>
          {({ subscribeToMore, ...result }) => (
            <RTLine
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

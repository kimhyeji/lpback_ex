import React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

const GET_CONTINENTS = gql`
  query {
    continents {
      code
      name
    }
  }
`;

function Continents() {
  const { loading, error, data } = useQuery(GET_CONTINENTS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!(</p>;
  return (
    <ul>
      {data.continents.map(({ code, name }) => (
        <li key={code}>{name}</li>
      ))}
    </ul>
  );
}

export default Continents;

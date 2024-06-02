import React from "react";
import Header from "../Header";
import { useCompanyQuery } from "../../generated/graphql";
import CurrentTable from "./CurrentTable";
import { Company } from "../../generated/graphql";
import FundingInstruments from "./FundingInstruments";
import ModelRound from "./ModelRound";
import ProFormaCapTable from "./ProFormaCapTable";

const Home: React.FC = () => {
  const [page, setPage] = React.useState("currentTable");
  const { data, loading, error } = useCompanyQuery({
    variables: { id: "1" },
  });

  console.log(error?.message);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  const getPage = () => {
    switch (page) {
      case "currentTable":
        return <CurrentTable company={data?.company as Partial<Company>} />;
      case "safesandNotes":
        return (
          <FundingInstruments company={data?.company as Partial<Company>} />
        );
      case "modelNextRound":
        return <ModelRound company={data?.company as Partial<Company>} />;
      case "proFormCapTable":
        return <ProFormaCapTable company={data?.company as Partial<Company>} />;
    }
  };

  return (
    <>
      <Header page={page} setPage={setPage} />
      <div className="d-flex bg-light min-vh-100">{getPage()}</div>
    </>
  );
};

export default Home;

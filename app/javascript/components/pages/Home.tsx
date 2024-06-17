import React from "react";
import Header from "../Header";
import { useCompanyQuery } from "../../generated/graphql";
import CurrentTable from "../sections/CurrentTable";
import { Company } from "../../generated/graphql";
import FundingInstruments from "../sections/FundingInstruments";
import ModelRound from "../sections/ModelRound";
import ProFormaCapTable from "../sections/ProFormaCapTable";
import { currentCompanyVar } from "../../apolloClient";
import { useReactiveVar } from "@apollo/client";
import { Spinner } from "react-bootstrap";

const Home: React.FC = () => {
  const company = useReactiveVar(currentCompanyVar);
  const [page, setPage] = React.useState("currentTable");
  const { data, loading, error } = useCompanyQuery({
    variables: { id: company.id },
  });

  if (loading)
    return (
      <div className="d-flex align-items-center justify-content-center">
        <Spinner animation="border" />
      </div>
    );
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
      <Header
        page={page}
        setPage={setPage}
        showNav
        name={data?.company?.name}
      />
      <div className="d-flex bg-light min-vh-100">{getPage()}</div>
    </>
  );
};

export default Home;

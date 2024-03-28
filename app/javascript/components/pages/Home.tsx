import React from "react";
import Header from "../Header";

const Home: React.FC = () => {
  const [page, setPage] = React.useState("currentTable");
  return (
    <>
      <Header page={page} setPage={setPage} />
      <div className="d-flex bg-dark h-100">
        <h1>{page}</h1>
      </div>
    </>
  );
};

export default Home;

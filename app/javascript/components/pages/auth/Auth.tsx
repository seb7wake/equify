import React, { useState, useEffect } from "react";
import Header from "../../Header";
import { useAuthMutation } from "../../../generated/graphql";
import CurrentTable from "../CurrentTable";
import { Company } from "../../../generated/graphql";
import FundingInstruments from "../FundingInstruments";
import ModelRound from "../ModelRound";
import ProFormaCapTable from "../ProFormaCapTable";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { currentCompanyVar } from "../../../apolloClient";
import { useReactiveVar } from "@apollo/client";

const Auth: React.FC = () => {
  const company = useReactiveVar(currentCompanyVar);
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [auth] = useAuthMutation();

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!companyName) return;
    try {
      const response = await auth({
        variables: {
          input: {
            companyName: companyName,
          },
        },
      });
      console.log(response);
      if (response.data?.auth?.company) {
        currentCompanyVar(response.data.auth.company);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Header showNav={false} />
      <div className="d-flex bg-light min-vh-100">
        <Form className="w-50 mx-auto">
          <div
            className="bg-white p-4 border border-1 border-dark rounded"
            style={{ marginTop: "20vh" }}
          >
            <h4 className="text-center mb-4">Welcome to Equify</h4>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Acme Inc."
                onChange={(e) => setCompanyName(e.target.value)}
                value={companyName}
              />
              <Form.Text className="text-muted">
                New here? Enter a company name to sign up or log in.
              </Form.Text>
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="mt-5 text-center w-100"
              onClick={(e) => handleSubmit(e)}
            >
              Start Modeling
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Auth;

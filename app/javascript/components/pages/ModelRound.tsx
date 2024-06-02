import React, { useState } from "react";
import {
  Container,
  Table,
  Form,
  InputGroup,
  Button,
  Row,
  Col,
} from "react-bootstrap";
import {
  Company,
  NextRound,
  useUpdateNextRoundMutation,
  useCreateInvestorMutation,
  useDeleteInvestorMutation,
  useUpdateInvestorMutation,
} from "../../generated/graphql";
import { FaTrashAlt } from "react-icons/fa";

type ModelRoundProps = {
  company: Partial<Company> | undefined;
};

const ModelRound: React.FC<ModelRoundProps> = ({ company }) => {
  const [preMoneyValuation, setPreMoneyValuation] = useState(
    company?.nextRound?.preMoneyValuation || 0
  );
  const [roundSize, setRoundSize] = useState(
    company?.nextRound?.roundSize || 0
  );
  const mutationOptions = {
    refetchQueries: ["company"],
    awaitRefetchQueries: true,
  };
  const [updateNextRound] = useUpdateNextRoundMutation(mutationOptions);
  const [createInvestor] = useCreateInvestorMutation(mutationOptions);
  const [deleteInvestor] = useDeleteInvestorMutation(mutationOptions);
  const [updateInvestor] = useUpdateInvestorMutation(mutationOptions);

  const updateRound = (updatedFields: Partial<NextRound>) => {
    const companyId = company?.id ? parseInt(company?.id || "") : 0;
    updateNextRound({
      variables: {
        input: {
          companyId: companyId,
          preMoneyValuation:
            updatedFields.preMoneyValuation || preMoneyValuation,
          roundSize: updatedFields.roundSize || roundSize,
        },
      },
    });
  };

  return (
    <Container>
      <Row>
        <Col md={5}>
          <h4 className="my-4">New Investors</h4>
          <Table hover borderless className="border">
            <thead>
              <tr>
                <th>Investor</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="my-3">
              {company?.nextRound?.investors?.map((investor) => (
                <tr>
                  <td>
                    <Form.Control
                      type="text"
                      value={investor.name}
                      onChange={(e) =>
                        updateInvestor({
                          variables: {
                            input: {
                              id: parseInt(investor.id),
                              name: e.target.value,
                              amount: investor.amount,
                            },
                          },
                        })
                      }
                    />
                  </td>
                  <td>
                    <InputGroup>
                      <InputGroup.Text>$</InputGroup.Text>
                      <Form.Control
                        type="number"
                        value={investor.amount}
                        onChange={(e) => {
                          updateInvestor({
                            variables: {
                              input: {
                                id: parseInt(investor.id),
                                name: investor.name,
                                amount:
                                  parseInt(e.target.value) > 0
                                    ? parseInt(e.target.value)
                                    : 0,
                              },
                            },
                          });
                        }}
                      />
                    </InputGroup>
                  </td>
                  <td>
                    <FaTrashAlt
                      size={16}
                      color="grey"
                      className="mx-2"
                      onClick={() =>
                        deleteInvestor({
                          variables: {
                            input: {
                              id: parseInt(investor.id),
                            },
                          },
                        })
                      }
                    />
                  </td>
                </tr>
              ))}
              <tr>
                <td>
                  <Button
                    variant="primary"
                    onClick={() =>
                      createInvestor({
                        variables: {
                          input: {
                            companyId: parseInt(company?.id || ""),
                            name: "New Investor",
                            amount: 0,
                          },
                        },
                      })
                    }
                  >
                    Add Investor
                  </Button>
                </td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col md={7}>
          <h4 className="my-4">Model Next Round</h4>
          <Table className="border" borderless>
            <thead>
              <tr>
                <th>Priced Round Assumptions</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="my-3">
              <tr>
                <td>
                  <div className="d-flex align-items-center">
                    Pre Money Valuation
                  </div>
                </td>
                <td>
                  <InputGroup>
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control
                      type="number"
                      min="0"
                      value={preMoneyValuation}
                      onChange={(e) => {
                        updateRound({
                          preMoneyValuation: parseInt(e.target.value),
                        });
                        setPreMoneyValuation(parseInt(e.target.value));
                      }}
                    />
                  </InputGroup>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="d-flex align-items-center">Round Size</div>
                </td>
                <td>
                  <InputGroup>
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control
                      type="number"
                      min="0"
                      value={roundSize}
                      onChange={(e) => {
                        setRoundSize(parseInt(e.target.value));
                        updateRound({
                          roundSize: parseInt(e.target.value),
                        });
                      }}
                    />
                  </InputGroup>
                </td>
              </tr>
              {/* <tr>
            <td>
              <div className="d-flex align-items-center">
                Are Converted Shares Included in Round Price calculation?
              </div>
            </td>
            <td>
              <Form.Group>
                <input
                  type="checkbox"
                  checked={isConvertedIncluded}
                  onChange={() => {
                    setIsConvertedIncluded(!isConvertedIncluded);
                  }}
                  onClick={() => {
                    setIsConvertedIncluded(!isConvertedIncluded);
                  }}
                />
              </Form.Group>
            </td>
          </tr> */}
              <tr>
                <td className="border-top-0 border-bottom-0"></td>
                <td className="border-top-0 border-bottom-0"></td>
              </tr>
            </tbody>

            <thead>
              <tr>
                <th>Post-Money Valuation Calculation</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="d-flex align-items-center">
                    New Shares Outstanding After Options Expansion
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    {company?.fullyDilutedTotal}
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="d-flex align-items-center">
                    Financing Round Price / Share
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    {preMoneyValuation / (company?.fullyDilutedTotal || 1)}
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="d-flex align-items-center">
                    Effective Pre-Money Valuation
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    {preMoneyValuation}
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="d-flex align-items-center">
                    Buying Power of Converted Securities
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    {company?.nextRound?.buyingPower}
                  </div>
                </td>
              </tr>
              <tr className="border-top">
                <td>
                  <div className="d-flex align-items-center">
                    <strong>Implied Post Money Valuation</strong>
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <strong>{company?.nextRound?.implicitValuation}</strong>
                  </div>
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default ModelRound;

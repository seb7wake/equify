import React, { useState, useEffect } from "react";
import { Container, Table, Form, InputGroup, Button } from "react-bootstrap";
import {
  Company,
  FinancialInstrument,
  useCreateFinancialInstrumentMutation,
  useDeleteFinancialInstrumentMutation,
  useUpdateFinancialInstrumentMutation,
} from "../../generated/graphql";
import { MdOutlineModeEdit } from "react-icons/md";
import { FaTrashAlt, FaRegCheckCircle } from "react-icons/fa";
import { newFinancialInstrument } from "../../utils/company";

type FundingInstrumentsProps = {
  company: Partial<Company> | undefined;
};

const FundingInstruments: React.FC<FundingInstrumentsProps> = ({ company }) => {
  const [instruments, setInstruments] = useState<
    Array<Partial<FinancialInstrument>>
  >(company?.financialInstruments || []);
  const mutationOptions = {
    refetchQueries: ["company"],
    awaitRefetchQueries: true,
  };
  const [createFinancialInstrument] =
    useCreateFinancialInstrumentMutation(mutationOptions);
  const [deleteFinancialInstrument] =
    useDeleteFinancialInstrumentMutation(mutationOptions);
  const [updateFinancialInstrument] =
    useUpdateFinancialInstrumentMutation(mutationOptions);

  useEffect(() => {
    setInstruments(company?.financialInstruments || []);
  }, [company?.financialInstruments]);

  const editInstruments = (index: number, key: string, value: any) => {
    let newInstruments = instruments.map((instrument, i) => {
      if (i === index) return { ...instrument, [key]: value };
      return instrument;
    });
    setInstruments(newInstruments);
    if ((value === "" || Object.is(value, NaN)) && key !== "name") return;
    updateFinancialInstrument({
      variables: {
        input: {
          financialInstrumentId: parseInt(instruments[index].id || ""),
          companyId: parseInt(company?.id || ""),
          name: newInstruments[index].name || "",
          instrumentType:
            newInstruments[index]?.instrumentType || "Pre-Money SAFE",
          principal: newInstruments[index].principal,
          valuationCap: newInstruments[index].valuationCap,
          discountRate: newInstruments[index].discountRate,
          interestRate: newInstruments[index].interestRate,
          issueDate: newInstruments[index].issueDate,
          conversionDate: newInstruments[index].conversionDate,
        },
      },
    });
  };

  const addInstrument = () => {
    const newInstrument = newFinancialInstrument(company?.id);
    setInstruments([...instruments, newInstrument]);
    createFinancialInstrument({
      variables: {
        input: newInstrument,
      },
    });
  };

  const removeInstrument = (index: number) => {
    deleteFinancialInstrument({
      variables: {
        input: {
          financialInstrumentId: parseInt(instruments[index].id || ""),
        },
      },
    });
    const newInstruments = instruments.filter((_, i) => i !== index);
    setInstruments(newInstruments);
  };

  const updateInstrumentType = (index: number, value: string) => {
    let updatedInstrument = instruments[index];
    updatedInstrument = {
      ...updatedInstrument,
      instrumentType: value,
    };
    setInstruments(
      instruments.map((instrument, i) =>
        i === index ? updatedInstrument : instrument
      )
    );
    updateFinancialInstrument({
      variables: {
        input: {
          financialInstrumentId: parseInt(updatedInstrument.id || ""),
          companyId: parseInt(company?.id || ""),
          principal: updatedInstrument.principal,
          name: updatedInstrument.name || "",
          instrumentType: updatedInstrument.instrumentType || "Pre-Money SAFE",
          valuationCap: updatedInstrument.valuationCap,
          discountRate: updatedInstrument.discountRate,
          interestRate: updatedInstrument.interestRate,
          issueDate: updatedInstrument.issueDate,
          conversionDate: updatedInstrument.conversionDate,
        },
      },
    });
  };

  return (
    <Container className="bg-light">
      <h4 className="my-4">SAFEs and Notes</h4>
      <Table hover className="border">
        <thead>
          <tr>
            <th>Holder Name</th>
            <th>Instrument Type</th>
            <th>Principal</th>
            <th>Valuation Cap</th>
            <th>Discount</th>
            {/*  <th>Interest Rate</th>
            <th>Issue Date</th>
            <th>Conversion Date</th>
            <th>Interest Accrued</th>
            <th>Principal and Interest</th> */}
            {/* <th></th> */}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {instruments?.map((instrument, index) => (
            <tr key={index}>
              <td>
                <div className="d-flex align-items-center">
                  <Form.Group>
                    <Form.Control
                      type="text"
                      //   disabled={editRow !== index}
                      value={instrument?.name}
                      onChange={(e) =>
                        editInstruments(index, "name", e.target.value)
                      }
                    />
                  </Form.Group>
                </div>
              </td>
              <td>
                <Form.Group>
                  <Form.Select
                    // disabled={editRow !== index}
                    value={instrument?.instrumentType}
                    onChange={(e) =>
                      updateInstrumentType(index, e.target.value)
                    }
                  >
                    <option value="Pre-Money SAFE">Pre-Money SAFE</option>
                    <option value="Post-Money SAFE">Post-Money SAFE</option>
                    <option value="Convertible Note">Convertible Note</option>
                    <option value="Pre-Money Convertible Note">
                      Pre-Money Convertible Note
                    </option>
                  </Form.Select>
                </Form.Group>
              </td>
              <td>
                <InputGroup>
                  <InputGroup.Text>$</InputGroup.Text>
                  <Form.Control
                    type="number"
                    // disabled={editRow !== index}
                    value={instrument?.principal ?? ""}
                    onChange={(e) =>
                      editInstruments(
                        index,
                        "principal",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </InputGroup>
              </td>
              <td>
                <InputGroup>
                  <InputGroup.Text>$</InputGroup.Text>
                  <Form.Control
                    type="number"
                    // disabled={editRow !== index}
                    value={instrument?.valuationCap ?? ""}
                    onChange={(e) =>
                      editInstruments(
                        index,
                        "valuationCap",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </InputGroup>
              </td>
              <td>
                <InputGroup>
                  <Form.Control
                    type="number"
                    // disabled={editRow !== index}
                    value={instrument?.discountRate ?? ""}
                    max="99"
                    min="0"
                    onChange={(e) => {
                      if (parseInt(e.target.value) > 99) {
                        e.target.value = "99";
                      }
                      editInstruments(
                        index,
                        "discountRate",
                        parseInt(e.target.value)
                      );
                    }}
                  />
                  <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
              </td>
              <td>
                <FaTrashAlt
                  size={16}
                  color="grey"
                  className="mx-2"
                  onClick={() => removeInstrument(index)}
                />
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <Button variant="primary" onClick={() => addInstrument()}>
                + Add Instrument
              </Button>
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </Table>
      <h4 className="my-4">Conversion Results</h4>
      <Table className="border">
        <thead>
          <tr>
            <th>Holder Name</th>
            <th>Instrument Type</th>
            <th>Valuation Cap Denominator</th>
            <th>Valuation Cap Price / Share</th>
            <th>Discounted Price Per Share</th>
            <th>Conversion Price</th>
            <th>Shares Converted</th>
          </tr>
        </thead>
        <tbody>
          {company?.conversionResults?.map((result, index) => (
            <tr key={result.holderId}>
              <td>{result.holderName}</td>
              <td>{result.instrumentType}</td>
              <td>
                {Number(result.valuationCapDenominator)?.toLocaleString()}
              </td>
              <td>${result.valuationCapSharePrice}</td>
              <td>${result.discountedSharePrice}</td>
              <td>${result.conversionPrice}</td>
              <td>{Number(result.sharesConverted)?.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default FundingInstruments;

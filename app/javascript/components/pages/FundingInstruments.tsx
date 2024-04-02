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

type FundingInstrumentsProps = {
  company: Partial<Company> | undefined;
};

const FundingInstruments: React.FC<FundingInstrumentsProps> = ({ company }) => {
  const [instruments, setInstruments] = useState<
    Array<Partial<FinancialInstrument>>
  >(company?.financialInstruments || []);
  const [createFinancialInstrument] = useCreateFinancialInstrumentMutation();
  const [deleteFinancialInstrument] = useDeleteFinancialInstrumentMutation();
  const [updateFinancialInstrument] = useUpdateFinancialInstrumentMutation({
    refetchQueries: ["company"],
    awaitRefetchQueries: true,
  });
  //   const [editRow, setEditRow] = useState(-1);

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

    console.log(key, value);

    console.log(newInstruments);
    updateFinancialInstrument({
      variables: {
        input: {
          financialInstrumentId: parseInt(instruments[index].id || ""),
          companyId: parseInt(company?.id || ""),
          principal: newInstruments[index].principal,
          name: newInstruments[index].name || "",
          instrumentType:
            newInstruments[index]?.instrumentType || "Pre-Money SAFE",
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
    const newInstrument = {
      name: "SAFE holder",
      principal: 0,
      instrumentType: "Pre-Money SAFE",
      valuationCap: 0,
      discountRate: 0,
      interestRate: 0,
      companyId: parseInt(company?.id || ""),
    } as FinancialInstrument;
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
      interestRate: value?.includes("Note")
        ? updatedInstrument.interestRate
        : 0,
      issueDate: value?.includes("Note")
        ? new Date().toISOString().split("T")[0]
        : null,
      conversionDate: value?.includes("Note")
        ? new Date().toISOString().split("T")[0]
        : null,
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
    <Container>
      <Table>
        <thead>
          <tr>
            <th>Holder Name</th>
            <th>Instrument Type</th>
            <th>Principal</th>
            <th>Valuation Cap</th>
            <th>Discount</th>
            <th>Interest Rate</th>
            <th>Issue Date</th>
            <th>Conversion Date</th>
            <th>Interest Accrued</th>
            <th>Principal and Interest</th>
            <th></th>
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
                <Form.Group>
                  <Form.Control
                    type="number"
                    // disabled={editRow !== index}
                    value={instrument?.principal}
                    onChange={(e) =>
                      editInstruments(
                        index,
                        "principal",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </Form.Group>
              </td>
              <td>
                <Form.Group>
                  <Form.Control
                    type="number"
                    // disabled={editRow !== index}
                    value={instrument?.valuationCap}
                    onChange={(e) =>
                      editInstruments(
                        index,
                        "valuationCap",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </Form.Group>
              </td>
              <td>
                <InputGroup>
                  <Form.Control
                    type="number"
                    // disabled={editRow !== index}
                    value={instrument?.discountRate || 0}
                    onChange={(e) =>
                      editInstruments(
                        index,
                        "discountRate",
                        parseInt(e.target.value)
                      )
                    }
                  />
                  <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
              </td>
              <td>
                <InputGroup>
                  <Form.Control
                    type="decimal"
                    disabled={
                      //   editRow !== index ||
                      !instrument?.instrumentType?.includes("Note")
                    }
                    value={instrument?.interestRate || 0}
                    onChange={(e) =>
                      editInstruments(
                        index,
                        "interestRate",
                        parseInt(e.target.value)
                      )
                    }
                  />
                  <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
              </td>
              <td>
                <Form.Group>
                  <Form.Control
                    type="date"
                    disabled={
                      //   editRow !== index ||
                      !instrument?.instrumentType?.includes("Note")
                    }
                    value={
                      instrument.issueDate
                        ? new Date(Date.parse(instrument.issueDate))
                            .toISOString()
                            .split("T")[0]
                        : undefined
                    }
                    onChange={(e) =>
                      editInstruments(index, "issueDate", e.target.value)
                    }
                  />
                </Form.Group>
              </td>
              <td>
                <Form.Group>
                  <Form.Control
                    type="date"
                    disabled={
                      //   editRow !== index ||
                      !instrument?.instrumentType?.includes("Note")
                    }
                    value={
                      instrument.conversionDate
                        ? new Date(Date.parse(instrument.conversionDate))
                            .toISOString()
                            .split("T")[0]
                        : undefined
                    }
                    onChange={(e) =>
                      editInstruments(index, "conversionDate", e.target.value)
                    }
                  />
                </Form.Group>
              </td>
              <td>{instrument.accruedInterest || 0}</td>
              <td>{instrument.principalAndInterest || 0}</td>
              {/* <td>
                {editRow === index ? (
                  <FaRegCheckCircle
                    size={20}
                    className="mx-2"
                    // onClick={() => saveInstrument(index)}
                    color="green"
                  />
                ) : (
                  <MdOutlineModeEdit
                    size={20}
                    color="grey"
                    className="mx-2"
                    onClick={() => setEditRow(index)}
                  />
                )}
              </td> */}
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
            <td></td>
          </tr>
        </tbody>
      </Table>
      <Button>Calculate Conversion Results</Button>
    </Container>
  );
};

export default FundingInstruments;

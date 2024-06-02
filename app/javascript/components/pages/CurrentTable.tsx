import React, { useState } from "react";
import {
  Company,
  Shareholder,
  useCreateShareholderMutation,
  useUpdateShareholderMutation,
  useDeleteShareholderMutation,
  useUpdateCompanyMutation,
} from "../../generated/graphql";
import { Table, Button, Form, Container } from "react-bootstrap";
import { MdOutlineModeEdit } from "react-icons/md";
import { FaTrashAlt, FaRegCheckCircle } from "react-icons/fa";

type CurrentTableProps = {
  company: Partial<Company> | undefined;
};

const CurrentTable: React.FC<CurrentTableProps> = ({ company }) => {
  const [shareholders, setShareholders] = React.useState<
    Array<Partial<Shareholder>>
  >(company?.shareholders || []);
  const [editRow, setEditRow] = useState(-1);
  const [errors, setErrors] = useState({});
  const [unallocatedOptions, setUnallocatedOptions] = useState(
    company?.unallocatedOptions || 0
  );
  const mutationOptions = {
    refetchQueries: ["company"],
    awaitRefetchQueries: true,
  };
  const [createShareholder] = useCreateShareholderMutation(mutationOptions);
  const [updateShareholder] = useUpdateShareholderMutation(mutationOptions);
  const [deleteShareholder] = useDeleteShareholderMutation(mutationOptions);
  const [updateCompany] = useUpdateCompanyMutation(mutationOptions);

  const editShareholder = (index: number, key: string, value: any) => {
    let newShareholders = shareholders.map((shareholder, i) => {
      if (i === index) return { ...shareholder, [key]: value };
      return shareholder;
    });
    setShareholders(newShareholders);
  };

  const updateOutstandingOptions = (value: number) => {
    setUnallocatedOptions(value);
    updateCompany({
      variables: {
        input: {
          companyId: parseInt(company?.id || ""),
          name: company?.name || "",
          unallocatedOptions: value,
        },
      },
    });
  };

  const saveShareholder = async (index: number) => {
    const shareholder = shareholders[index];
    let shares = shareholder?.dilutedShares || 0;
    let options = shareholder?.outstandingOptions || 0;
    if (shareholder?.name) {
      const shareholderData = {
        name: shareholder?.name,
        dilutedShares: shares,
        outstandingOptions: options,
        companyId: parseInt(company?.id || ""),
      };
      let err = {};
      if (shareholder?.id && parseInt(shareholder?.id) > 0) {
        let res = await updateShareholder({
          variables: {
            input: {
              shareholderId: parseInt(shareholder?.id),
              ...shareholderData,
            },
          },
        });
        if (res?.errors?.length) err = res.errors[0];
      } else {
        let res = await createShareholder({
          variables: {
            input: shareholderData,
          },
        });
        if (res?.errors?.length) err = res.errors[0];
      }
      if (Object.keys(err).length === 0) setEditRow(-1);
    }
  };

  const addShareholder = () => {
    if (editRow !== -1) return;
    setEditRow(shareholders.length);
    setShareholders([
      ...shareholders,
      {
        id: ((shareholders.length + 1) * -1).toString(),
        name: "Common Shareholder",
        dilutedShares: 0,
        outstandingOptions: 0,
      },
    ]);
  };

  const removeShareholder = (index: number) => {
    if (editRow !== -1 || !shareholders[index]?.id) return;
    let newShareholders = shareholders.filter((shareholder, i) => i !== index);
    setShareholders(newShareholders);
    deleteShareholder({
      variables: {
        input: { shareholderId: parseInt(shareholders[index]?.id || "") },
      },
    });
  };

  const getFullyDilutedShareholder = (shareholder: Partial<Shareholder>) =>
    (shareholder?.dilutedShares || 0) + (shareholder?.outstandingOptions || 0);

  const getUnallocatedOptionsPercentage = () =>
    (
      ((company?.unallocatedOptions || 0) / (company?.fullyDilutedTotal || 0)) *
      100
    ).toFixed(2) || "0.00";

  return (
    <>
      <Container>
        <h4 className="my-4">Current Cap Table</h4>
        <Table hover className="border">
          <thead>
            <tr>
              <th>Shareholder Name</th>
              <th>Fully Diluted Shares</th>
              <th>Outstanding Options</th>
              <th>Fully Diluted Total</th>
              <th>Fully Diluted %</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {shareholders?.map((shareholder, index) => (
              <tr key={index}>
                <td>
                  <div className="d-flex align-items-center">
                    <Form.Group>
                      <Form.Control
                        type="text"
                        disabled={editRow !== index}
                        value={shareholder?.name}
                        onChange={(e) =>
                          editShareholder(index, "name", e.target.value)
                        }
                      />
                    </Form.Group>
                  </div>
                </td>
                <td>
                  <Form.Group>
                    <Form.Control
                      type="number"
                      min="0"
                      disabled={editRow !== index}
                      value={shareholder?.dilutedShares ?? 0}
                      onChange={(e) =>
                        editShareholder(
                          index,
                          "dilutedShares",
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
                      min="0"
                      disabled={editRow !== index}
                      value={shareholder?.outstandingOptions ?? 0}
                      onChange={(e) =>
                        editShareholder(
                          index,
                          "outstandingOptions",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </Form.Group>
                </td>
                <td>{getFullyDilutedShareholder(shareholder)}</td>
                <td>
                  {(
                    (getFullyDilutedShareholder(shareholder) /
                      (company?.fullyDilutedTotal || 1)) *
                    100
                  ).toFixed(2) || 0}
                  %
                </td>
                <td>
                  {editRow === index ? (
                    <FaRegCheckCircle
                      size={20}
                      className="mx-2"
                      onClick={() => saveShareholder(index)}
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
                </td>
                <td>
                  <FaTrashAlt
                    size={16}
                    color="grey"
                    className="mx-2"
                    onClick={() => removeShareholder(index)}
                  />
                </td>
              </tr>
            ))}
            <tr style={{ borderBottom: "1px solid black" }}>
              <td>
                <Button variant="primary" onClick={() => addShareholder()}>
                  + Add Shareholder
                </Button>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>Subtotal</td>
              <td>{company?.fullyDilutedShares || 0}</td>
              <td>{company?.outstandingOptions || 0}</td>
              <td>{company?.shareholderFullyDiluted || 0}</td>
              <td>{company?.fullyDilutedSubtotalPercentage || 0}%</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td className="">Unallocated Options</td>
              <td>
                <Form.Control
                  type="number"
                  min="0"
                  value={unallocatedOptions}
                  onChange={(e) =>
                    updateOutstandingOptions(parseInt(e.target.value))
                  }
                />
              </td>
              <td></td>
              <td>{company?.unallocatedOptions || 0}</td>
              <td>{getUnallocatedOptionsPercentage()}%</td>
              <td></td>
              <td></td>
            </tr>
            <tr style={{ borderBottom: "1px solid black" }}>
              <td>
                <strong>Total</strong>
              </td>
              <td></td>
              <td></td>
              <td>
                <strong>{company?.fullyDilutedTotal}</strong>
              </td>
              <td>
                <strong>
                  {parseFloat(getUnallocatedOptionsPercentage()) +
                    (company?.fullyDilutedSubtotalPercentage || 0)}
                  %
                </strong>
              </td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default CurrentTable;

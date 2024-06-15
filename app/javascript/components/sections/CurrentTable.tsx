import React, { useState, useEffect } from "react";
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
import { getFullyDilutedShareholder } from "../../utils/shareholder";
import { getUnallocatedOptionsPercentage } from "../../utils/company";

type CurrentTableProps = {
  company: Partial<Company> | undefined;
};

const CurrentTable: React.FC<CurrentTableProps> = ({ company }) => {
  const [shareholders, setShareholders] = React.useState<
    Array<Partial<Shareholder>>
  >(company?.shareholders || []);
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

  useEffect(() => {
    setShareholders(company?.shareholders || []);
    setUnallocatedOptions(company?.unallocatedOptions || 0);
  }, [company?.shareholders, company?.unallocatedOptions]);

  const updateUnallocatedOptions = (value: number) => {
    setUnallocatedOptions(value);
    if (value < 0 || Object.is(value, NaN)) return;
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

  const editShareholder = async (index: number, key: string, value: any) => {
    let shareholder = { ...shareholders[index] };
    shareholder[key] = value || undefined;
    if (shareholder?.name && shareholder.id) {
      let newShareholders = shareholders.map((s, i) =>
        i === index ? shareholder : s
      );
      setShareholders(newShareholders);
      if ((value === "" || Object.is(value, NaN)) && key !== "name") return;
      await updateShareholder({
        variables: {
          input: {
            shareholderId: parseInt(shareholder.id),
            name: shareholder.name,
            dilutedShares: shareholder.dilutedShares || 0,
            outstandingOptions: shareholder?.outstandingOptions || 0,
            companyId: parseInt(company?.id || ""),
          },
        },
      });
    }
  };

  const addShareholder = async () => {
    let res = await createShareholder({
      variables: {
        input: {
          companyId: parseInt(company?.id || ""),
          name: "Common Shareholder",
          dilutedShares: 0,
          outstandingOptions: 0,
        },
      },
    });
    let newShareholders = [...shareholders];
    newShareholders.push({
      companyId: parseInt(company?.id || ""),
      id: res.data?.createShareholder?.id || "",
      name: res.data?.createShareholder?.name || "",
      dilutedShares: 0,
      outstandingOptions: 0,
    });
    setShareholders(newShareholders);
  };

  const removeShareholder = (index: number) => {
    let newShareholders = shareholders.filter((shareholder, i) => i !== index);
    setShareholders(newShareholders);
    deleteShareholder({
      variables: {
        input: { shareholderId: parseInt(shareholders[index]?.id || "") },
      },
    });
  };

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
                      value={shareholder?.dilutedShares ?? ""}
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
                      value={shareholder?.outstandingOptions ?? ""}
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
                <td className="align-middle">
                  {getFullyDilutedShareholder(shareholder)}
                </td>
                <td className="align-middle">
                  {(
                    (getFullyDilutedShareholder(shareholder) /
                      (company?.fullyDilutedTotal || 1)) *
                    100
                  ).toFixed(2) || 0}
                  %
                </td>
                <td className="align-middle">
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
                <Button variant="primary" onClick={addShareholder}>
                  + Add Shareholder
                </Button>
              </td>
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
            </tr>
            <tr>
              <td className="">Unallocated Options</td>
              <td>
                <Form.Control
                  type="number"
                  value={unallocatedOptions}
                  onChange={(e) =>
                    updateUnallocatedOptions(parseInt(e.target.value))
                  }
                />
              </td>
              <td></td>
              <td className="align-middle">
                {company?.unallocatedOptions || ""}
              </td>
              <td>
                {getUnallocatedOptionsPercentage(
                  company?.unallocatedOptions,
                  company?.fullyDilutedTotal
                )}
                %
              </td>
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
                  {parseFloat(
                    getUnallocatedOptionsPercentage(
                      company?.unallocatedOptions,
                      company?.fullyDilutedTotal
                    )
                  ) + (company?.fullyDilutedSubtotalPercentage || 0)}
                  %
                </strong>
              </td>
              <td></td>
            </tr>
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default CurrentTable;

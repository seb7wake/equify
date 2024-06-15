import React, { useState } from "react";
import { Container, Table, Form, InputGroup, Button } from "react-bootstrap";
import { Company } from "../../generated/graphql";

type ProFormaCapTableProps = {
  company: Partial<Company> | undefined;
};

const ProFormaCapTable: React.FC<ProFormaCapTableProps> = ({ company }) => {
  return (
    <Container>
      <h4 className="my-4">Pro Forma Cap Table</h4>
      <Table borderless className="border">
        <thead>
          <tr className="border-bottom">
            <th>Shareholder Name</th>
            <th>Fully Diluted Total</th>
            <th>Fully Diluted %</th>
          </tr>
        </thead>
        <tbody className="my-3">
          {company?.capTable?.shareholders?.map((shareholder) => (
            <tr>
              <td>{shareholder.name}</td>
              <td>{shareholder.fullyDilutedTotal}</td>
              <td>{shareholder.fullyDilutedPercentage}%</td>
            </tr>
          ))}
          <tr
            style={{ borderBottom: "1px solid black" }}
            className="mb-2 border-top"
          >
            <td>
              <strong>Total Shares Excluding Options</strong>
            </td>
            <td>
              <strong>{company?.capTable?.sharesExcludingOptions}</strong>
            </td>
            <td>
              <strong>
                {company?.capTable?.sharesExcludingOptionsPercentage}%
              </strong>
            </td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Unallocated Options</td>
            <td>{company?.capTable?.unallocatedOptions}</td>
            <td>{company?.capTable?.unallocatedOptionsPercentage}%</td>
          </tr>
          <tr
            style={{ borderBottom: "1px solid black" }}
            className="mb-2 border-top"
          >
            <td>
              <strong>Total</strong>
            </td>
            <td>
              <strong>{company?.capTable?.totalShares}</strong>
            </td>
            <td>
              <strong>{company?.capTable?.totalSharesPercentage}%</strong>
            </td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
};

export default ProFormaCapTable;

import React, { useState } from "react";
import { Container, Table, Form, InputGroup, Button } from "react-bootstrap";
import { Company } from "../../generated/graphql";

type ProFormaCapTableProps = {
  company: Partial<Company> | undefined;
};

const ProFormaCapTable: React.FC<ProFormaCapTableProps> = ({ company }) => {
  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>Shareholder Name</th>
            <th>Fully Diluted Total</th>
            <th>Fully Diluted %</th>
          </tr>
        </thead>
        <tbody className="my-3">
          {/* {company?.shareholders?.map((shareholder) => (
            <tr>
              <td>{shareholder.name}</td>
              <td>{shareholder.</td>
              <td></td>
            </tr>
          ))} */}
        </tbody>
      </Table>
    </div>
  );
};

export default ProFormaCapTable;

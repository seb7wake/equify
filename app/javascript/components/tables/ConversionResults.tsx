import React, { useState } from "react";
import { Table, Form, Button, InputGroup } from "react-bootstrap";

const ConversionResults = ({ results }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Holder Name</th>
          <th>Instrument Type</th>
          <th>Valuation Cap Denominator</th>
          <th>Valuation Cap Price / Share</th>
          <th>Discounted Price / Share</th>
          <th>Conversion Price</th>
          <th>Shares Converted</th>
        </tr>
      </thead>
      <tbody>
        {results?.map((result, index) => (
          <tr key={index}>
            <td>
              <div className="d-flex align-items-center">{}</div>
            </td>
            <td>{}</td>
            <td>{}</td>
            <td>{}</td>
            <td>{}</td>
            <td>{}</td>
            <td>{}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ConversionResults;

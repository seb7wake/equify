import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "../components/pages/Home"; // Adjust the import path as necessary
import { createRoot } from "react-dom/client";
import { Navigate } from "react-router";
import {
  ApolloProvider,
  ApolloClient,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
import Auth from "./pages/Auth";
import client, { currentCompanyVar } from "../apolloClient";
import { useReactiveVar } from "@apollo/client";

document.addEventListener("turbo:load", () => {
  const root = createRoot(
    document.body.appendChild(document.createElement("div"))
  );
  root.render(<App />);
});

const App = () => {
  const currentCompany = useReactiveVar(currentCompanyVar);
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              currentCompany ? <Home /> : <Navigate to="/auth" replace />
            }
          />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
};

export default App;

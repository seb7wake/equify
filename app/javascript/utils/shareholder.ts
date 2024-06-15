import { Shareholder } from "../generated/graphql";

export const getFullyDilutedShareholder = (shareholder: Partial<Shareholder>) =>
  (shareholder?.dilutedShares || 0) + (shareholder?.outstandingOptions || 0);

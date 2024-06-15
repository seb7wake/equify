import { Company, FinancialInstrument } from "../generated/graphql";

export const getUnallocatedOptionsPercentage = (
  unallocatedOptions: number | null | undefined,
  fullyDilutedTotal: number | null | undefined
) =>
  (((unallocatedOptions || 0) / (fullyDilutedTotal || 0)) * 100).toFixed(2) ||
  "0.00";

export const newFinancialInstrument = (companyId: string | undefined) => {
  return {
    name: "SAFE holder",
    principal: 0,
    instrumentType: "Pre-Money SAFE",
    valuationCap: 0,
    discountRate: 0,
    interestRate: 0,
    companyId: parseInt(companyId || ""),
  } as FinancialInstrument;
};

module Mutations
    class DeleteFinancialInstrument < BaseMutation
        argument :financial_instrument_id, Integer, required: true

        type Types::CompanyType

        def resolve(financial_instrument_id:)
            financial_instrument = FinancialInstrument.find(financial_instrument_id)
            company = Company.find(financial_instrument.company_id)
            financial_instrument.delete()
            company
        end
    end
end
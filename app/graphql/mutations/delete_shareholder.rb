module Mutations
    class DeleteShareholder < BaseMutation
        argument :company_id, Integer, required: true
        argument :shareholder_id, Integer, required: true

        type Types::CompanyType

        def resolve(company_id:, shareholder_id:)
            company = Company.find(company_id)
            shareholder = Shareholder.find(shareholder_id)
            company.shareholders.delete(shareholder)
            company
        end
    end
end
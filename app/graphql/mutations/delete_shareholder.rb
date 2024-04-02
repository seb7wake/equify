module Mutations
    class DeleteShareholder < BaseMutation
        argument :shareholder_id, Integer, required: true

        type Types::CompanyType

        def resolve(shareholder_id:)
            shareholder = Shareholder.find(shareholder_id)
            company = Company.find(shareholder.company_id)
            shareholder.delete()
            company
        end
    end
end
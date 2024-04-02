module Mutations
    class UpdateShareholder < BaseMutation
        argument :company_id, Integer, required: true
        argument :shareholder_id, Integer, required: true
        argument :name, String, required: true
        argument :outstanding_options, Integer, required: true
        argument :diluted_shares, Integer, required: true

        type Types::ShareholderType

        def resolve(company_id:, shareholder_id:, name:, outstanding_options:, diluted_shares:)
            company = Company.find(company_id)
            if diluted_shares < 0 || outstanding_options < 0 then
                raise GraphQL::ExecutionError, "Diluted shares and outstanding options must be greater than or equal to 0"
            end
            puts "company_id: #{company_id}"
            puts "shareholder_id: #{shareholder_id}"
            shareholder = Shareholder.find(shareholder_id)
            if shareholder.update!(name: name, diluted_shares: diluted_shares, outstanding_options: outstanding_options) then
                shareholder
            else
                raise GraphQL::ExecutionError, shareholder.errors.full_messages.join(", ")
            end
        end
    end
end
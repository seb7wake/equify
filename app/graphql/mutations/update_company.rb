module Mutations
    class UpdateCompany < BaseMutation
        argument :company_id, Integer, required: true
        argument :name, String, required: true
        argument :unallocated_options, Integer, required: true

        type Types::CompanyType

        def resolve(company_id:, name:, unallocated_options:)
            company = Company.find(company_id)
            if unallocated_options < 0 then
                raise GraphQL::ExecutionError, "unallocated_options must be greater than or equal to 0"
            end
            puts "company_id: #{company_id}"
            if company.update!(name: name, unallocated_options: unallocated_options)
                company
            else
                raise GraphQL::ExecutionError, company.errors.full_messages.join(", ")
            end
        end
    end
end
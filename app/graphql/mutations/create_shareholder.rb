module Mutations
    class CreateShareholder < BaseMutation
      # arguments passed to the `resolved` method
      argument :name, String, required: true
      argument :company_id, Integer, required: true
      argument :diluted_shares, Integer, required: true
      argument :outstanding_options, Integer, required: true
  
      # return type from the mutation
      type Types::ShareholderType
  
      def resolve(name:, company_id:, diluted_shares:, outstanding_options:)
        if diluted_shares < 0 || outstanding_options < 0 then
            raise GraphQL::ExecutionError, "Diluted shares and outstanding options must be greater than or equal to 0"
        end
        company = Company.find(company_id)
        Shareholder.create!(name: name, company: company, diluted_shares: diluted_shares, outstanding_options: outstanding_options)
      end
    end
end
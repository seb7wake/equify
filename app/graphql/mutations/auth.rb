module Mutations
    class Auth < BaseMutation
      argument :company_name, String, required: true
  
      field :company, Types::CompanyType, null: true
      field :errors, [String], null: false
  
      def resolve(company_name:)
        company = AuthenticationService.new(company_name: company_name).authenticate()
        if company
          { company: company, errors: [] }
        else
          { company: nil, errors: ["Invalid email or company name."] }
        end
      end
    end
  end
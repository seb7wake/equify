module Mutations
    class CreateUser < BaseMutation
      # arguments passed to the `resolved` method
      argument :email, String, required: true
      argument :company_id, Integer, required: true
  
      # return type from the mutation
      type Types::UserType
  
      def resolve(email:, company_id:)
        company = Company.find(company_id)
        User.create!(email: email, company: company)
      end
    end
end
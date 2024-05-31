module Mutations
    class CreateCompany < BaseMutation
      # arguments passed to the `resolved` method
      argument :name, String, required: true
  
      # return type from the mutation
      type Types::CompanyType
  
      def resolve(name:)
        Company.create!(name: name)
        NextRound.create!(company_id: Company.last.id)
      end
    end
end
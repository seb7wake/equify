module Mutations
    class CreateInvestor < BaseMutation
      argument :name, String, required: true
      argument :company_id, Integer, required: true
      argument :amount, Integer, required: true
  
      type Types::InvestorType
  
      def resolve(company_id:, name:, amount:)
        next_round = Company.find(company_id).next_round
        if next_round.nil?
          raise GraphQL::ExecutionError, "next_round for company ID #{company_id} not found"
        end
        Investor.create!(name: name, amount: amount, next_round: next_round)
        end
    end
  end
module Mutations
    class UpdateInvestor < BaseMutation
        argument :id, Integer, required: true
        argument :name, String, required: true
        argument :amount, Integer, required: true

        type Types::InvestorType

        def resolve(id:, name:, amount:)
            investor = Investor.find(id)
            if investor.update!(name: name, amount: amount) then
                investor
            else
                raise GraphQL::ExecutionError, financial_instrument.errors.full_messages.join(", ")
            end
        end
    end
end
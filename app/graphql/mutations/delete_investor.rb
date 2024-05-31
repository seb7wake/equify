module Mutations
    class DeleteInvestor < BaseMutation
        argument :id, Integer, required: true

        type Types::InvestorType

        def resolve(id:)
            investor = Investor.find(id)
            next_round = NextRound.find(investor.next_round_id)
            investor.delete()
            next_round
        end
    end
end
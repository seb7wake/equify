module Mutations
    class UpdateNextRound < BaseMutation
        argument :company_id, Integer, required: true
        argument :pre_money_valuation, Integer, required: true
        argument :round_size, Integer, required: true

        type Types::NextRoundType

        def resolve(company_id:, pre_money_valuation:, round_size:)
            next_round = NextRound.find_by(company_id: company_id)
            implicit_valuation = (pre_money_valuation || next_round.pre_money_valuation) + (next_round.buying_power || 0) + (round_size || next_round.round_size)
            if next_round.update!(pre_money_valuation: pre_money_valuation, round_size: round_size, implicit_valuation: implicit_valuation)
                next_round
            else
                raise GraphQL::ExecutionError, next_round.errors.full_messages.join(", ")
            end
        end
    end
end
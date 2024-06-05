module Types
    class NextRoundType < Types::BaseObject
      field :company_id, Integer, null: false
      field :pre_money_valuation, GraphQL::Types::BigInt
      field :round_size, GraphQL::Types::BigInt
      field :buying_power, GraphQL::Types::BigInt
      field :implicit_valuation, GraphQL::Types::BigInt
      field :investors, [Types::InvestorType], null: true
    end
  end
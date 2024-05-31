module Types
    class NextRoundType < Types::BaseObject
      field :company_id, Integer, null: false
      field :pre_money_valuation, Integer
      field :round_size, Integer
      field :buying_power, Integer
      field :implicit_valuation, Integer
      field :investors, [Types::InvestorType], null: true
    end
  end
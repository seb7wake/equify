# frozen_string_literal: true

module Types
  class CompanyType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :unallocated_options, Integer, null: false
    field :fully_diluted_shares, Integer
    field :outstanding_options, Integer
    field :shareholder_fully_diluted, Integer
    field :fully_diluted_subtotal_percentage, Float
    field :fully_diluted_total, Integer
    field :users, [Types::UserType], null: false
    field :shareholders, [Types::ShareholderType], null: false
    field :financial_instruments, [Types::FinancialInstrumentType], null: false
    field :next_round, Types::NextRoundType, null: false
    field :conversion_results, [Types::ConversionResultType], null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end

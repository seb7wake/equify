# frozen_string_literal: true

module Types
  class FinancialInstrumentType < Types::BaseObject
    field :id, ID, null: false
    field :company_id, Integer, null: false
    field :name, String, null: false
    field :instrument_type, String, null: false
    field :principal, Integer, null: false
    field :valuation_cap, Integer, null: false
    field :discount_rate, Float
    field :interest_rate, Float
    field :accrued_interest, Integer
    field :principal_and_interest, Integer
    field :issue_date, GraphQL::Types::ISO8601DateTime
    field :conversion_date, GraphQL::Types::ISO8601DateTime
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end

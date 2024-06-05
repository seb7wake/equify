# frozen_string_literal: true

module Types
    class ConversionResultType < Types::BaseObject
      field :holder_id, ID, null: false
      field :holder_name, String, null: false
      field :instrument_type, String, null: false
      field :valuation_cap_denominator, GraphQL::Types::BigInt, null: false
      field :valuation_cap_share_price, Float, null: false
      field :discounted_share_price, Float, null: false
      field :conversion_price, Float, null: false
      field :shares_converted, GraphQL::Types::BigInt, null: false
    end
  end
  
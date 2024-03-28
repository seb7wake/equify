# frozen_string_literal: true

module Types
  class ShareholderType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :diluted_shares, Integer
    field :outstanding_options, Integer
    field :company_id, Integer, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end

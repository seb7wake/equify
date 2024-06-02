# frozen_string_literal: true
require_relative "../../services/company_service"

module Types
  class QueryType < Types::BaseObject
    field :node, Types::NodeType, null: true, description: "Fetches an object given its ID." do
      argument :id, ID, required: true, description: "ID of the object."
    end

    def node(id:)
      context.schema.object_from_id(id, context)
    end

    field :nodes, [Types::NodeType, null: true], null: true, description: "Fetches a list of objects given a list of IDs." do
      argument :ids, [ID], required: true, description: "IDs of the objects."
    end

    def nodes(ids:)
      ids.map { |id| context.schema.object_from_id(id, context) }
    end

    # Add root-level fields here.
    # They will be entry points for queries on your schema.

    field :users, [Types::UserType], null: false
    def users
      User.all
    end

    field :companies, [Types::CompanyType], null: false
    def companies
      Company.all
    end

    field :company, Types::CompanyType, null: false do
      argument :id, ID, required: true
    end
    def company(id:)
      CompanyService.new(company_id: id).construct_company()
    end

  end
end
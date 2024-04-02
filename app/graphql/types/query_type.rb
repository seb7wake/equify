# frozen_string_literal: true

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
      company = Company.find(id)
      shareholders = Shareholder.where(company_id: id)
      company.fully_diluted_shares = shareholders.sum(:diluted_shares)
      company.outstanding_options = shareholders.sum(:outstanding_options)
      company.shareholder_fully_diluted = company.fully_diluted_shares + company.outstanding_options
      company.fully_diluted_total = company.shareholder_fully_diluted + company.unallocated_options
      company.fully_diluted_subtotal_percentage = ((company.shareholder_fully_diluted / company.fully_diluted_total.to_f) * 100).round(2)
      company
    end

    field :conversion_results, [Types::ConversionResultType], null: false do
      argument :company_id, ID, required: true
    end
    def conversion_results(company_id:)
      instruments = FinancialInstrument.where(company_id: company_id)

      instruments.map do |instrument|
        {
          holder_id: instrument.id,
          holder_name: instrument.name
          instrument_type: instrument.instrument_type,
          valuation_cap_denominator: instrument.valuation_cap,
        }
      end
    end
  end
end

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
      company.next_round = next_round(company: company)
      company.conversion_results = conversion_results(company: company)
      company
    end

    def get_buying_power(company:)
      buying_power = 0
      outstanding_shares = company.fully_diluted_total
      share_price = (company.next_round.pre_money_valuation.to_f / outstanding_shares)
      pre_money_instruments = company.financial_instruments.where(instrument_type: ["Pre-Money SAFE", "Pre-Money Convertible Note"]).where('valuation_cap > ?', 0)
      pre_money_instruments.each do |instrument|
        buying_power +=  (instrument.principal / instrument.valuation_cap.to_f) * outstanding_shares * share_price
        outstanding_shares += (instrument.principal / instrument.valuation_cap.to_f) * outstanding_shares
      end
      post_money_instruments = company.financial_instruments.where(instrument_type: ["Post-Money SAFE", "Convertible Note"]).where('valuation_cap > ?', 0)
      post_money_instruments.each do |instrument|
        new_fully_diluted_shares = outstanding_shares + (((instrument.principal / instrument.valuation_cap.to_f) * outstanding_shares) / share_price)
        new_share_price = ((instrument.principal / instrument.valuation_cap.to_f) * outstanding_shares) / new_fully_diluted_shares.to_f
        buying_power += new_share_price * outstanding_shares
      end
      buying_power
    end

    def next_round(company:)
      buying_power = get_buying_power(company: company)
      company.next_round.buying_power = buying_power.round(0)
      company.next_round.implicit_valuation = company.next_round.pre_money_valuation + company.next_round.round_size + company.next_round.buying_power
      company.next_round
    end

    def convert_pre_money_instruments(company:, pre_money_instruments:)
      converted_instruments = []
      pre_money_instruments.map do |instrument|
        discounted_share_price = (company.next_round.pre_money_valuation.to_f / company.fully_diluted_total)
        discounted_share_price -= (company.next_round.pre_money_valuation.to_f / company.fully_diluted_total) * (instrument.discount_rate.to_f / 100) if instrument.discount_rate > 0
        valuation_cap_share_price = instrument.valuation_cap.to_f / company.fully_diluted_total / 10
        converted_instruments << {
            holder_id: instrument.id,
            holder_name: instrument.name,
            instrument_type: instrument.instrument_type,
            valuation_cap_denominator: company.fully_diluted_total,
            valuation_cap_share_price: valuation_cap_share_price,
            discounted_share_price: discounted_share_price,
            conversion_price: [valuation_cap_share_price, discounted_share_price].min,
            shares_converted: [instrument.principal / [valuation_cap_share_price, discounted_share_price].min, company.fully_diluted_total].min
          }
      end
      converted_instruments
    end

    def convert_post_money_instruments(company:, outstanding_shares:)
      converted_instruments = []
      post_money_instruments = company.financial_instruments.where(instrument_type: ["Post-Money SAFE", "Convertible Note"]).where('valuation_cap > ?', 0)
      post_money_instruments.map do |instrument|
        new_fully_diluted_shares = outstanding_shares + (((instrument.principal / instrument.valuation_cap.to_f) * outstanding_shares) / (company.next_round.pre_money_valuation.to_f / outstanding_shares))
        new_share_price = ((instrument.principal / instrument.valuation_cap.to_f) * outstanding_shares) / new_fully_diluted_shares.to_f
        discounted_share_price = (company.next_round.pre_money_valuation.to_f / company.fully_diluted_total)
        discounted_share_price -= (company.next_round.pre_money_valuation.to_f / company.fully_diluted_total) * (instrument.discount_rate.to_f / 100) if instrument.discount_rate > 0
        valuation_cap_share_price = instrument.valuation_cap.to_f / outstanding_shares / 10
        converted_instruments << {
          holder_id: instrument.id,
          holder_name: instrument.name,
          instrument_type: instrument.instrument_type,
          valuation_cap_denominator: new_share_price * outstanding_shares / new_share_price.to_f,
          valuation_cap_share_price: valuation_cap_share_price,
          discounted_share_price: discounted_share_price,
          conversion_price: [valuation_cap_share_price, discounted_share_price].min,
          shares_converted: [instrument.principal / [valuation_cap_share_price, discounted_share_price].min, outstanding_shares].min
        }
      end
      converted_instruments
    end

    def conversion_results(company:)
      outstanding_shares = company.fully_diluted_total
      pre_money_instruments = company.financial_instruments.where(instrument_type: ["Pre-Money SAFE", "Pre-Money Convertible Note"]).where('valuation_cap > ?', 0)
      outstanding_shares = company.fully_diluted_total
      pre_money_instruments.each { |instrument| outstanding_shares += (instrument.principal / instrument.valuation_cap.to_f) * outstanding_shares }
      convert_pre_money_instruments(company: company, pre_money_instruments: pre_money_instruments) + convert_post_money_instruments(company: company, outstanding_shares: outstanding_shares)
    end
  end
end
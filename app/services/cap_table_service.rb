class CapTableService
    def initialize(company:)
        @company = company
        @shareholders = self.get_shareholders()
    end

    def get_shareholders()
        shareholders = []
        share_price = @company.next_round.pre_money_valuation / @company.fully_diluted_total.to_f
        @company.shareholders.map do |shareholder|
          shareholders << {
            name: shareholder.name,
            fully_diluted_total: shareholder.diluted_shares,
          }
        end
        @company.financial_instruments.each do |instrument|
          conversion = @company.conversion_results.select { |conversion| conversion[:holder_id] == instrument.id }.first
          shareholders << {
            name: instrument.name,
            fully_diluted_total: conversion ? conversion[:shares_converted] : 0,
          }
        end
        @company.next_round.investors.each do |investor|
          shareholders << {
            name: investor.name,
            fully_diluted_total: (investor.amount.to_f / share_price).round(0),
          }
        end
        shareholders
      end
  
      def construct_cap_table()
        total_shares = @shareholders.sum { |shareholder| shareholder[:fully_diluted_total] } + @company.unallocated_options
        @shareholders.map do |shareholder|
          shareholder[:fully_diluted_percentage] = ((shareholder[:fully_diluted_total] / total_shares.to_f) * 100)
          shareholder
        end
        shareholders_rounded = @shareholders.map do |shareholder|
          new_shareholder = shareholder.dup
          new_shareholder[:fully_diluted_percentage] = new_shareholder[:fully_diluted_percentage].round(4)
          new_shareholder
        end
        {
          shares_excluding_options: @shareholders.sum { |shareholder| shareholder[:fully_diluted_total] },
          shares_excluding_options_percentage: (@shareholders.sum { |shareholder| shareholder[:fully_diluted_percentage] }).round(4),
          shareholders: shareholders_rounded,
          unallocated_options: @company.unallocated_options,
          unallocated_options_percentage: ((@company.unallocated_options.to_f / total_shares) * 100).round(4),
          total_shares: @shareholders.sum { |shareholder| shareholder[:fully_diluted_total] } + @company.unallocated_options,
          total_shares_percentage:(@shareholders.sum { |shareholder| shareholder[:fully_diluted_percentage] } + ((@company.unallocated_options.to_f / total_shares) * 100)).round(4)
        }
      end
end
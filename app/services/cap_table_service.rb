class CapTableService
    def initialize(company:)
        @company = company
        @shareholders = self.get_shareholders()
    end

    def get_shareholders()
        shareholders = []
        # fix percentage calculation
        @company.shareholders.map do |shareholder|
          shareholders << {
            name: shareholder.name,
            fully_diluted_total: shareholder.diluted_shares,
          }
        end
        # fix percentage calculation and fully_diluted_total
        @company.financial_instruments.each do |instrument|
          shareholders << {
            name: instrument.name,
            fully_diluted_total: @company.conversion_results.select { |conversion| conversion[:holder_id] == instrument.id }.first[:shares_converted],
          }
        end
        # fix percentage calculation and fully_diluted_total
        @company.next_round.investors.each do |investor|
          shareholders << {
            name: investor.name,
            fully_diluted_total: investor.amount * (@company.fully_diluted_total / @company.next_round.implicit_valuation),
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
          shareholder[:fully_diluted_percentage] = shareholder[:fully_diluted_percentage].round(4)
          shareholder
        end
        {
          shares_excluding_options: @shareholders.sum { |shareholder| shareholder[:fully_diluted_total] },
          shares_excluding_options_percentage: @shareholders.sum { |shareholder| shareholder[:fully_diluted_percentage] },
          shareholders: shareholders_rounded,
          unallocated_options: @company.unallocated_options,
          unallocated_options_percentage: ((@company.unallocated_options / total_shares) * 100).round(4),
          total_shares: @shareholders.sum { |shareholder| shareholder[:fully_diluted_total] } + @company.unallocated_options,
          total_shares_percentage: (@shareholders.sum { |shareholder| shareholder[:fully_diluted_percentage] } + (@company.unallocated_options / total_shares) * 100).round(4)
        }
      end
end
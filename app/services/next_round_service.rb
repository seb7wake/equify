class NextRoundService
    def initialize(company:)
        principal_less_than_valuation_cap = FinancialInstrument.arel_table[:principal].lt(FinancialInstrument.arel_table[:valuation_cap])
        @company = company
        @next_round = company.next_round
        @pre_money_instruments = @company.financial_instruments.where(instrument_type: ["Pre-Money SAFE", "Pre-Money Convertible Note"]).where('valuation_cap > ?', 0).where('principal > ?', 0).where(principal_less_than_valuation_cap)
        @post_money_instruments = @company.financial_instruments.where(instrument_type: ["Post-Money SAFE", "Convertible Note"]).where('valuation_cap > ?', 0).where('principal > ?', 0).where(principal_less_than_valuation_cap)
    end

    def get_instrument_buying_power()
        (@company.conversion_results.sum { |i| i[:shares_converted] } * (@next_round.pre_money_valuation.to_f / @company.fully_diluted_total)).to_i
      end

    def construct_next_round()
      @next_round.buying_power = self.get_instrument_buying_power()
      @next_round.implicit_valuation = @next_round.pre_money_valuation + @next_round.round_size + @next_round.buying_power
      @next_round
    end
end
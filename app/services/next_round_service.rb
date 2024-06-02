class NextRoundService
    def initialize(company:)
        @company = company
        @next_round = company.next_round
    end

    def get_instrument_buying_power()
        buying_power = 0
        outstanding_shares = @company.fully_diluted_total
        share_price = (@company.next_round.pre_money_valuation.to_f / outstanding_shares)
        pre_money_instruments = @company.financial_instruments.where(instrument_type: ["Pre-Money SAFE", "Pre-Money Convertible Note"]).where('valuation_cap > ?', 0)
        pre_money_instruments.each do |instrument|
          buying_power +=  (instrument.principal / instrument.valuation_cap.to_f) * outstanding_shares * share_price
          outstanding_shares += (instrument.principal / instrument.valuation_cap.to_f) * outstanding_shares
        end
        post_money_instruments = @company.financial_instruments.where(instrument_type: ["Post-Money SAFE", "Convertible Note"]).where('valuation_cap > ?', 0)
        post_money_instruments.each do |instrument|
          new_fully_diluted_shares = outstanding_shares + (((instrument.principal / instrument.valuation_cap.to_f) * outstanding_shares) / share_price)
          new_share_price = ((instrument.principal / instrument.valuation_cap.to_f) * outstanding_shares) / new_fully_diluted_shares.to_f
          buying_power += new_share_price * outstanding_shares
        end
        buying_power
      end

    def construct_next_round()
      @next_round.buying_power = self.get_instrument_buying_power().round(0)
      @next_round.implicit_valuation = @next_round.pre_money_valuation + @next_round.round_size + @next_round.buying_power
      @next_round
    end
end
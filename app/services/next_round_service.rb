class NextRoundService
    def initialize(company:)
        @company = company
        @next_round = company.next_round
    end

    def get_instrument_buying_power()
        shares = 0
        outstanding_shares = @company.fully_diluted_total
        # may need to adust discounted share price calculation
        share_price = (@company.next_round.pre_money_valuation.to_f / outstanding_shares)
        pre_money_instruments = @company.financial_instruments.where(instrument_type: ["Pre-Money SAFE", "Pre-Money Convertible Note", "Convertible Note"]).where('valuation_cap > ?', 0).where('principal > ?', 0)
        pre_money_instruments.each do |instrument|
          discounted_share_price = share_price
          discounted_share_price -= share_price * (instrument.discount_rate.to_f / 100) if instrument.discount_rate > 0 && @company.next_round.pre_money_valuation <= instrument.valuation_cap
          valuation_cap_share_price = instrument.valuation_cap.to_f / @company.fully_diluted_total
          outstanding_shares += (instrument.principal / instrument.valuation_cap.to_f) * outstanding_shares
          shares += instrument.principal / [valuation_cap_share_price, discounted_share_price].min
        end
        post_money_instruments = @company.financial_instruments.where(instrument_type: ["Post-Money SAFE"]).where('valuation_cap > ?', 0).where('principal > ?', 0)
        total_percent_owed_post_money_safes = post_money_instruments.sum { |instrument| instrument.principal / instrument.valuation_cap.to_f }
        outstanding_shares_new = outstanding_shares / (1.0 - total_percent_owed_post_money_safes).to_f
        post_money_instruments.each do |instrument|
          shares += (instrument.principal / instrument.valuation_cap.to_f) * outstanding_shares_new
        end
        shares * share_price
      end

    def construct_next_round()
      @next_round.buying_power = self.get_instrument_buying_power().round(0)
      @next_round.implicit_valuation = @next_round.pre_money_valuation + @next_round.round_size + @next_round.buying_power
      @next_round
    end
end
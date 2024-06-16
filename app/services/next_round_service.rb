class NextRoundService
    def initialize(company:)
        @company = company
        @next_round = company.next_round
    end

    def get_instrument_buying_power()
        shares = 0
        outstanding_shares = @company.fully_diluted_total
        share_price = (@company.next_round.pre_money_valuation.to_f / outstanding_shares)
        principal_less_than_valuation_cap = FinancialInstrument.arel_table[:principal].lt(FinancialInstrument.arel_table[:valuation_cap])
        pre_money_instruments = @company.financial_instruments.where(instrument_type: ["Pre-Money SAFE", "Pre-Money Convertible Note"]).where('valuation_cap > ?', 0).where('principal > ?', 0).where(principal_less_than_valuation_cap)
        pre_money_instruments.each do |instrument|
          discounted_share_price = share_price
          discounted_share_price -= share_price * (instrument.discount_rate.to_f / 100) if instrument.discount_rate > 0
          valuation_cap_share_price = instrument.valuation_cap.to_f / @company.fully_diluted_total
          outstanding_shares += (instrument.principal / instrument.valuation_cap.to_f) * @company.fully_diluted_total
          shares += instrument.principal / [valuation_cap_share_price, discounted_share_price].min
        end
        post_money_instruments = @company.financial_instruments.where(instrument_type: ["Post-Money SAFE", "Convertible Note"]).where('valuation_cap > ?', 0).where('principal > ?', 0).where(principal_less_than_valuation_cap)
        total_percent_owed_post_money_safes = post_money_instruments.sum do |instrument|
          discounted_percentage = 0
          if instrument.discount_rate > 0 then
            discounted_pre_money = @company.next_round.pre_money_valuation.to_f * (1 - instrument.discount_rate.to_f / 100 )
            discounted_percentage = instrument.principal / discounted_pre_money
          end
          valuation_cap_percentage = instrument.principal / instrument.valuation_cap.to_f
          [valuation_cap_percentage, discounted_percentage].max
        end
        outstanding_shares_new = outstanding_shares / (1.0 - total_percent_owed_post_money_safes).to_f
        post_money_instruments.each do |instrument|
          discounted_shares = 0
          if instrument.discount_rate > 0 then
            discounted_pre_money = @company.next_round.pre_money_valuation.to_f * (1 - instrument.discount_rate.to_f / 100 )
            discounted_percentage = instrument.principal / discounted_pre_money
            discounted_shares = discounted_percentage * outstanding_shares_new
          end
          valuation_cap_shares = (instrument.principal / instrument.valuation_cap.to_f) * outstanding_shares_new
          shares += [valuation_cap_shares, discounted_shares].max
        end
        shares * share_price
      end

    def construct_next_round()
      @next_round.buying_power = self.get_instrument_buying_power().round(0)
      @next_round.implicit_valuation = @next_round.pre_money_valuation + @next_round.round_size + @next_round.buying_power
      @next_round
    end
end
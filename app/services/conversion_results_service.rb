class ConversionResultsService

    def initialize(company:)
        @company = company
        @conversion_results = nil
        principal_less_than_valuation_cap = FinancialInstrument.arel_table[:principal].lt(FinancialInstrument.arel_table[:valuation_cap])
        @pre_money_instruments = @company.financial_instruments.where(instrument_type: ["Pre-Money SAFE", "Pre-Money Convertible Note", "Convertible Note"]).where('valuation_cap > ?', 0).where('principal > ?', 0).where(principal_less_than_valuation_cap)
        @post_money_instruments = @company.financial_instruments.where(instrument_type: "Post-Money SAFE").where('valuation_cap > ?', 0).where('principal > ?', 0).where(principal_less_than_valuation_cap)
    end

    def convert_pre_money_instruments()
        converted_instruments = []
        @pre_money_instruments.map do |instrument|
          # use discounted price method eventually alongside valuation cap method
          discounted_share_price = (@company.next_round.pre_money_valuation.to_f / @company.fully_diluted_total)
          discounted_share_price -= (@company.next_round.pre_money_valuation.to_f / @company.fully_diluted_total) * (instrument.discount_rate.to_f / 100) if instrument.discount_rate > 0 && @company.next_round.pre_money_valuation <= instrument.valuation_cap
          valuation_cap_share_price = instrument.valuation_cap.to_f / @company.fully_diluted_total
          converted_instruments << {
              holder_id: instrument.id,
              holder_name: instrument.name,
              instrument_type: instrument.instrument_type,
              valuation_cap_denominator: @company.fully_diluted_total,
              valuation_cap_share_price: valuation_cap_share_price,
              discounted_share_price: discounted_share_price,
              conversion_price: [valuation_cap_share_price, discounted_share_price].min,
              shares_converted: instrument.principal / [valuation_cap_share_price, discounted_share_price].min
            }
        end
        converted_instruments
      end

      # def discounted_price_method(instrument:, outstanding_shares:)
      #   discounted_pre_money_valuation = instrument.discount_rate * @company.pre_money_valuation
      #   safe_percentage = instrument.principal / discounted_pre_money_valuation.to_f
      #   shares = safe_percentage * outstanding_shares
      # end
  
      def convert_post_money_instruments(outstanding_shares:)
        converted_instruments = []
        total_percent_owed = @post_money_instruments.sum { |instrument| instrument.principal / instrument.valuation_cap.to_f }
        outstanding_shares = outstanding_shares / (1.0 - total_percent_owed.to_f).to_f
        puts "outstanding_shares: #{total_percent_owed}"
        @post_money_instruments.map do |instrument|
          new_share_price = (instrument.valuation_cap.to_f / outstanding_shares)
          # add in discounted price method if discount rate is greater than 0 and pre_money_valuation is less than valuation_cap
          discounted_share_price = (@company.next_round.pre_money_valuation.to_f / @company.fully_diluted_total)
          discounted_share_price -= (@company.next_round.pre_money_valuation.to_f / @company.fully_diluted_total) * (instrument.discount_rate.to_f / 100) if instrument.discount_rate > 0
          converted_instruments << {
            holder_id: instrument.id,
            holder_name: instrument.name,
            instrument_type: instrument.instrument_type,
            valuation_cap_denominator: outstanding_shares,
            valuation_cap_share_price: new_share_price.round(4),
            discounted_share_price: discounted_share_price.round(4),
            conversion_price: [new_share_price, discounted_share_price].min.round(4),
            shares_converted: (instrument.principal / instrument.valuation_cap.to_f) * outstanding_shares
          }
        end
        converted_instruments
      end
  
      def construct_conversion_results()
        outstanding_shares = @company.fully_diluted_total
        @pre_money_instruments.each { |instrument| outstanding_shares += (instrument.principal / instrument.valuation_cap.to_f) * @company.fully_diluted_total }
        self.convert_pre_money_instruments() + self.convert_post_money_instruments(outstanding_shares: outstanding_shares)
      end
end
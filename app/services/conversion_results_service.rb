class ConversionResultsService

    def initialize(company:)
        @company = company
        @conversion_results = nil
        @pre_money_instruments = @company.financial_instruments.where(instrument_type: ["Pre-Money SAFE", "Pre-Money Convertible Note"]).where('valuation_cap > ?', 0)
        @post_money_instruments = @company.financial_instruments.where(instrument_type: ["Post-Money SAFE", "Convertible Note"]).where('valuation_cap > ?', 0)
    end

    def convert_pre_money_instruments()
        converted_instruments = []
        @pre_money_instruments.map do |instrument|
          discounted_share_price = (@company.next_round.pre_money_valuation.to_f / @company.fully_diluted_total)
          discounted_share_price -= (@company.next_round.pre_money_valuation.to_f / @company.fully_diluted_total) * (instrument.discount_rate.to_f / 100) if instrument.discount_rate > 0
          valuation_cap_share_price = instrument.valuation_cap.to_f / @company.fully_diluted_total / 10
          converted_instruments << {
              holder_id: instrument.id,
              holder_name: instrument.name,
              instrument_type: instrument.instrument_type,
              valuation_cap_denominator: @company.fully_diluted_total,
              valuation_cap_share_price: valuation_cap_share_price,
              discounted_share_price: discounted_share_price,
              conversion_price: [valuation_cap_share_price, discounted_share_price].min,
              shares_converted: [instrument.principal / [valuation_cap_share_price, discounted_share_price].min, @company.fully_diluted_total].min
            }
        end
        converted_instruments
      end
  
      def convert_post_money_instruments(outstanding_shares:)
        converted_instruments = []
        @post_money_instruments.map do |instrument|
          new_fully_diluted_shares = outstanding_shares + (((instrument.principal / instrument.valuation_cap.to_f) * outstanding_shares) / (@company.next_round.pre_money_valuation.to_f / outstanding_shares))
          new_share_price = ((instrument.principal / instrument.valuation_cap.to_f) * outstanding_shares) / new_fully_diluted_shares.to_f
          discounted_share_price = (@company.next_round.pre_money_valuation.to_f / @company.fully_diluted_total)
          discounted_share_price -= (@company.next_round.pre_money_valuation.to_f / @company.fully_diluted_total) * (instrument.discount_rate.to_f / 100) if instrument.discount_rate > 0
          valuation_cap_share_price = instrument.valuation_cap.to_f / outstanding_shares / 10
          converted_instruments << {
            holder_id: instrument.id,
            holder_name: instrument.name,
            instrument_type: instrument.instrument_type,
            valuation_cap_denominator: new_share_price * outstanding_shares / new_share_price.to_f,
            valuation_cap_share_price: valuation_cap_share_price.round(4),
            discounted_share_price: discounted_share_price.round(4),
            conversion_price: [valuation_cap_share_price, discounted_share_price].min.round(4),
            shares_converted: [instrument.principal / [valuation_cap_share_price, discounted_share_price].min, outstanding_shares].min
          }
        end
        converted_instruments
      end
  
      def construct_conversion_results()
        outstanding_shares = @company.fully_diluted_total
        @pre_money_instruments.each { |instrument| outstanding_shares += (instrument.principal / instrument.valuation_cap.to_f) * outstanding_shares }
        self.convert_pre_money_instruments() + self.convert_post_money_instruments(outstanding_shares: outstanding_shares)
      end
end
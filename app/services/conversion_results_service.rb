class ConversionResultsService

    def initialize(company:)
        @company = company
        @outstanding_shares = @company.fully_diluted_total
        @total_discounted_shares = 0
        principal_less_than_valuation_cap = FinancialInstrument.arel_table[:principal].lt(FinancialInstrument.arel_table[:valuation_cap])
        @pre_money_instruments = @company.financial_instruments.where(instrument_type: ["Pre-Money SAFE", "Pre-Money Convertible Note"]).where('valuation_cap > ?', 0).where('principal > ?', 0).where(principal_less_than_valuation_cap)
        @post_money_instruments = @company.financial_instruments.where(instrument_type: ["Post-Money SAFE", "Convertible Note"]).where('valuation_cap > ?', 0).where('principal > ?', 0).where(principal_less_than_valuation_cap)
    end

    def convert_pre_money_instruments()
        converted_instruments = []
        @pre_money_instruments.map do |instrument|
          discounted_share_price = (@company.next_round.pre_money_valuation.to_f / @company.fully_diluted_total)
          discounted_share_price -= (@company.next_round.pre_money_valuation.to_f / @company.fully_diluted_total) * (instrument.discount_rate.to_f / 100.0) if instrument.discount_rate > 0
          valuation_cap_share_price = instrument.valuation_cap.to_f / @company.fully_diluted_total
          @outstanding_shares += instrument.principal / [valuation_cap_share_price, discounted_share_price].min
          converted_instruments << {
              holder_id: instrument.id,
              holder_name: instrument.name,
              instrument_type: instrument.instrument_type,
              valuation_cap_denominator: @company.fully_diluted_total,
              valuation_cap_share_price: valuation_cap_share_price.round(4),
              discounted_share_price: discounted_share_price.round(4),
              conversion_price: [valuation_cap_share_price, discounted_share_price].min.round(4),
              shares_converted: instrument.principal / [valuation_cap_share_price, discounted_share_price].min,
              created_at: instrument.created_at
            }
        end
        converted_instruments
      end

      def get_discounted_percentage(instrument)
        instrument.principal / (@company.next_round.pre_money_valuation.to_f * (1.0 - instrument.discount_rate.to_f / 100.0 ))
      end

      def get_valuation_cap_shares(instrument, total_percent)
        (instrument.principal / instrument.valuation_cap.to_f) * (@outstanding_shares / (1.0 - total_percent ).to_f)
      end

      def safe_price_method_conversion(total_discounted_shares)
        total_percent = @post_money_instruments.sum { |i| i.principal / i.valuation_cap.to_f }.to_f
        total_percent_owed =  @post_money_instruments.sum do |instrument| 
          discounted_percentage = 0
          if instrument.discount_rate > 0
            discounted_percentage = get_discounted_percentage(instrument)
          end
          valuation_cap_percentage = instrument.principal / instrument.valuation_cap.to_f
          valuation_cap_shares = get_valuation_cap_shares(instrument, total_percent)
          discounted_shares = (discounted_percentage * @company.fully_diluted_total).round(0)
          if valuation_cap_shares > discounted_shares
            valuation_cap_percentage
          else
            total_discounted_shares += discounted_shares
            0
          end
        end
        total_percent_owed
      end
  
      def convert_post_money_instruments
        converted_instruments = []
        total_percent = calculate_total_percent()
        total_percent_owed = calculate_total_percent_owed_and_discounted_shares(total_percent)
        adjusted_outstanding_shares = calculate_adjusted_outstanding_shares(total_percent_owed)
        converted_instruments = convert_all_instruments(adjusted_outstanding_shares)
        update_valuation_cap_denominator(converted_instruments)
      end
    
      def calculate_discounted_percentage(instrument)
        instrument.principal / (@company.next_round.pre_money_valuation.to_f * (1.0 - instrument.discount_rate.to_f / 100.0))
      end
    
      def calculate_valuation_cap_percentage(instrument)
        instrument.principal / instrument.valuation_cap.to_f
      end
    
      def calculate_valuation_cap_shares(instrument, total_percent)
        (instrument.principal / instrument.valuation_cap.to_f) * (@outstanding_shares / (1.0 - total_percent).to_f)
      end
    
      def calculate_discounted_shares(discounted_percentage)
        (discounted_percentage * @company.fully_diluted_total).round(0)
      end
    
      def calculate_total_percent()
        @post_money_instruments.sum { |i| i.principal / i.valuation_cap.to_f }.to_f
      end
    
      def calculate_total_percent_owed_and_discounted_shares(total_percent)
        @post_money_instruments.sum do |instrument|
          discounted_percentage = 0
          discounted_percentage = calculate_discounted_percentage(instrument) if instrument.discount_rate > 0
          valuation_cap_percentage = calculate_valuation_cap_percentage(instrument)
          valuation_cap_shares = calculate_valuation_cap_shares(instrument, total_percent)
          discounted_shares = calculate_discounted_shares(discounted_percentage)
          if valuation_cap_shares > discounted_shares
            valuation_cap_percentage
          else
            @total_discounted_shares += discounted_shares
            0
          end
        end
      end
    
      def calculate_adjusted_outstanding_shares(total_percent_owed)
        (@outstanding_shares + @total_discounted_shares) / (1.0 - total_percent_owed).to_f
      end
    
      def convert_all_instruments(adjusted_outstanding_shares)
        @post_money_instruments.map do |instrument|
          new_share_price = (instrument.valuation_cap.to_f / adjusted_outstanding_shares)
          discounted_share_price = @company.next_round.pre_money_valuation.to_f * (1 - instrument.discount_rate.to_f / 100.0) / @company.fully_diluted_total
          discounted_shares_converted = instrument.principal / discounted_share_price.to_f
          valuation_cap_shares_converted = (instrument.principal / instrument.valuation_cap.to_f) * adjusted_outstanding_shares
          {
            holder_id: instrument.id,
            holder_name: instrument.name,
            instrument_type: instrument.instrument_type,
            valuation_cap_share_price: new_share_price.round(4),
            discounted_share_price: discounted_share_price.round(4),
            conversion_price: [new_share_price, discounted_share_price].min.round(4),
            shares_converted: [valuation_cap_shares_converted, discounted_shares_converted].max.to_i,
            created_at: instrument.created_at
          }
        end
      end
    
      def update_valuation_cap_denominator(converted_instruments)
        valuation_cap_denominator = @outstanding_shares + converted_instruments.sum { |instrument| instrument[:shares_converted] }
        converted_instruments.each { |instrument| instrument[:valuation_cap_denominator] = valuation_cap_denominator }
        converted_instruments
      end
  
      def construct_conversion_results()
        # @pre_money_instruments.each { |instrument| @outstanding_shares += (instrument.principal / instrument.valuation_cap.to_f) * @company.fully_diluted_total }
        results = self.convert_pre_money_instruments()
        results += self.convert_post_money_instruments()
        results.sort_by { |result| result[:created_at] }
      end
end
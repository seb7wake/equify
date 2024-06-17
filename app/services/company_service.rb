require_relative "next_round_service"
require_relative "conversion_results_service"
require_relative "cap_table_service"

class CompanyService
    def initialize(company_id:)
        @company = Company.find(company_id)
        @shareholders = Shareholder.where(company_id: company_id)
    end

    def self.create_company(company_name)
      company = Company.create!(name: company_name, unallocated_options: 500000)
      next_round = NextRound.create!(company_id: Company.last.id)
      Investor.create!(name: "John Doe", amount: 500000, next_round_id: next_round.id)
      Investor.create!(name: "Jane Doe", amount: 500000, next_round_id: next_round.id)
      Shareholder.create!(name: "Common Shareholders", company_id: Company.last.id, diluted_shares: 5000000, outstanding_options: 0)
      Shareholder.create!(name: "Preferred Shareholders", company_id: Company.last.id, diluted_shares: 3500000, outstanding_options: 0)
      Shareholder.create!(name: "Warrants", company_id: Company.last.id, diluted_shares: 1000000, outstanding_options: 0)
      FinancialInstrument.create!(company_id: Company.last.id, name: "Sebastian Wakefield", instrument_type: "Post-Money SAFE", principal: 100000, valuation_cap: 3000000, discount_rate: 20.0, interest_rate: 0.0)
      FinancialInstrument.create!(company_id: Company.last.id, name: "Elon Musk", instrument_type: "Post-Money SAFE", principal: 100000, valuation_cap: 4000000, discount_rate: 20.0, interest_rate: 0.0)
      FinancialInstrument.create!(company_id: Company.last.id, name: "Peter Thiel", instrument_type: "Post-Money SAFE", principal: 250000, valuation_cap: 5000000, discount_rate: 20.0, interest_rate: 0.0)
      company
    end

    def construct_company()
      @company.fully_diluted_shares = @shareholders.sum(:diluted_shares)
      @company.outstanding_options = @shareholders.sum(:outstanding_options)
      @company.shareholder_fully_diluted = @company.fully_diluted_shares + @company.outstanding_options
      @company.fully_diluted_total = @company.shareholder_fully_diluted + @company.unallocated_options
      @company.fully_diluted_subtotal_percentage = ((@company.shareholder_fully_diluted / @company.fully_diluted_total.to_f) * 100).round(2)
      @company.conversion_results = ConversionResultsService.new(company: @company).construct_conversion_results()
      @company.next_round = NextRoundService.new(company: @company).construct_next_round()
      @company.cap_table = CapTableService.new(company: @company).construct_cap_table()
      @company
    end
end
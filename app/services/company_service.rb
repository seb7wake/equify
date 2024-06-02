require_relative "next_round_service"
require_relative "conversion_results_service"
require_relative "cap_table_service"

class CompanyService
    def initialize(company_id:)
        @company = Company.find(company_id)
        @shareholders = Shareholder.where(company_id: company_id)
    end

    def construct_company()
      @company.fully_diluted_shares = @shareholders.sum(:diluted_shares)
      @company.outstanding_options = @shareholders.sum(:outstanding_options)
      @company.shareholder_fully_diluted = @company.fully_diluted_shares + @company.outstanding_options
      @company.fully_diluted_total = @company.shareholder_fully_diluted + @company.unallocated_options
      @company.fully_diluted_subtotal_percentage = ((@company.shareholder_fully_diluted / @company.fully_diluted_total.to_f) * 100).round(2)
      @company.next_round = NextRoundService.new(company: @company).construct_next_round()
      @company.conversion_results = ConversionResultsService.new(company: @company).construct_conversion_results()
      @company.cap_table = CapTableService.new(company: @company).construct_cap_table()
      @company
    end
end
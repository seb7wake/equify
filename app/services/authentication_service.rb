class AuthenticationService
    def initialize(company_name:)
      @company_name = company_name
    end
  
    def authenticate()
      company = Company.find_by(name: @company_name)
      if !company
        company = CompanyService.create_company(@company_name)
      end
      CompanyService.new(company_id: company.id).construct_company()
    end

    
end
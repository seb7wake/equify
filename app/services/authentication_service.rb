class AuthenticationService
    def initialize(company_name:)
      @company_name = company_name
    end
  
    def authenticate()
      company = Company.find_by(name: @company_name)
      if !company
        company = create_company()
      end
      CompanyService.new(company_id: company.id).construct_company()
    end

    def create_company()
      company = Company.create!(name: @company_name)
      NextRound.create!(company_id: Company.last.id)
      company.investors.create!(name: "John Doe", amount: 500000)
      company.investors.create!(name: "Jane Doe", amount: 500000)
      company
    end
end
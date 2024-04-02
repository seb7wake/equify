# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :create_company, mutation: Mutations::CreateCompany
    field :update_company, mutation: Mutations::UpdateCompany
    field :create_user, mutation: Mutations::CreateUser
    field :create_shareholder, mutation: Mutations::CreateShareholder
    field :update_shareholder, mutation: Mutations::UpdateShareholder
    field :delete_shareholder, mutation: Mutations::DeleteShareholder
    field :create_financial_instrument, mutation: Mutations::CreateFinancialInstrument
    field :update_financial_instrument, mutation: Mutations::UpdateFinancialInstrument
    field :delete_financial_instrument, mutation: Mutations::DeleteFinancialInstrument
  end
end

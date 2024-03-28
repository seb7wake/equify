# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :create_company, mutation: Mutations::CreateCompany
    field :create_user, mutation: Mutations::CreateUser
    field :create_shareholder, mutation: Mutations::CreateShareholder
    field :update_shareholder, mutation: Mutations::UpdateShareholder
    field :delete_shareholder, mutation: Mutations::DeleteShareholder
  end
end

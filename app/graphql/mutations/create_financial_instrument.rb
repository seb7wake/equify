# frozen_string_literal: true

module Mutations
  class CreateFinancialInstrument < BaseMutation
   argument :name, String, required: true
    argument :company_id, Integer, required: true
    argument :principal, Integer, required: true
    argument :valuation_cap, Integer, required: true
    argument :instrument_type, String, required: true
    argument :discount_rate, Float, required: false
    argument :interest_rate, Float, required: false
    argument :issue_date, GraphQL::Types::ISO8601DateTime, required: false
    argument :conversion_date, GraphQL::Types::ISO8601DateTime, required: false

    type Types::FinancialInstrumentType

    def resolve(name:, company_id:, principal:, valuation_cap:, instrument_type:, discount_rate: nil, interest_rate: nil, issue_date: nil, conversion_date: nil)
      company = Company.find(company_id)
      if company.nil?
        raise GraphQL::ExecutionError, "company_id #{company_id} not found"
      end
      FinancialInstrument.create!(name: name, company: company, principal: principal, valuation_cap: valuation_cap, instrument_type: instrument_type, discount_rate: discount_rate, interest_rate: interest_rate, issue_date: issue_date, conversion_date: conversion_date)
      end
  end
end

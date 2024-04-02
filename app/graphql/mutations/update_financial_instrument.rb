module Mutations
    class UpdateFinancialInstrument < BaseMutation
        argument :financial_instrument_id, Integer, required: true
        argument :company_id, Integer, required: true
        argument :name, String, required: true
        argument :instrument_type, String, required: true
        argument :discount_rate, Float, required: false
        argument :interest_rate, Float, required: false
        argument :principal, Integer, required: false
        argument :valuation_cap, Integer, required: false
        argument :issue_date, GraphQL::Types::ISO8601DateTime, required: false
        argument :conversion_date, GraphQL::Types::ISO8601DateTime, required: false

        type Types::FinancialInstrumentType

        def resolve(financial_instrument_id:, name:, instrument_type:, principal:,  valuation_cap:, company_id:, discount_rate: nil, interest_rate: nil, issue_date: nil, conversion_date: nil)
            financial_instrument = FinancialInstrument.find(financial_instrument_id)
            company = Company.find(company_id)
            if company.nil?
                raise GraphQL::ExecutionError, "company_id #{company_id} not found"
            end
            accrued_interest = 0
            if conversion_date.to_datetime && issue_date.to_datetime && conversion_date.to_datetime > issue_date.to_datetime && interest_rate && interest_rate > 0 then 
                maturity = (conversion_date.to_datetime - issue_date.to_datetime).to_i
                accrued_interest = principal * (interest_rate.to_f / 100) * (maturity / 365)
            end
            if financial_instrument.update!(name: name, instrument_type: instrument_type, principal: principal, valuation_cap: valuation_cap, company: company, discount_rate: discount_rate, interest_rate: interest_rate, issue_date: issue_date, conversion_date: conversion_date, accrued_interest: accrued_interest)
                financial_instrument.principal_and_interest = financial_instrument.principal + financial_instrument.accrued_interest
                financial_instrument
            else
                raise GraphQL::ExecutionError, financial_instrument.errors.full_messages.join(", ")
            end
        end
    end
end
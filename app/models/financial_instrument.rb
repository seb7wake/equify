class FinancialInstrument < ApplicationRecord
  attr_accessor :principal_and_interest
  belongs_to :company
end

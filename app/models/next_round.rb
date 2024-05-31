class NextRound < ApplicationRecord
    attr_accessor :buying_power
    belongs_to :company
    has_many :investors
  end
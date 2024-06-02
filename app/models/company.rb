class Company < ApplicationRecord
    attr_accessor :fully_diluted_shares, :outstanding_options, :shareholder_fully_diluted, :fully_diluted_total, :fully_diluted_subtotal_percentage, :conversion_results, :cap_table

    has_many :users, dependent: :destroy
    has_many :shareholders, -> { order "created_at  DESC" }, dependent: :destroy
    has_many :financial_instruments, -> { order "created_at  DESC"},  dependent: :destroy
    has_one :next_round, dependent: :destroy
end

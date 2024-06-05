class ChangeColumnInNextRound < ActiveRecord::Migration[7.1]
  def change
    change_column :next_rounds, :round_size, :bigint, default: 1000000
    change_column :next_rounds, :pre_money_valuation, :bigint, default: 8000000
    change_column :next_rounds, :buying_power, :bigint
    change_column :next_rounds, :implicit_valuation, :bigint
  end
end

class CreateNextRound < ActiveRecord::Migration[7.1]
  def change
    create_table :next_rounds do |t|
      t.integer :round_size, null: false, default: 1000000
      t.integer :pre_money_valuation, null: false, default: 8000000
      t.references :company, null: false, foreign_key: true
      t.integer :buying_power
      t.integer :implicit_valuation

      t.timestamps
    end
  end
end

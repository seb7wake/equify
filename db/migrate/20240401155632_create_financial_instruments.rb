class CreateFinancialInstruments < ActiveRecord::Migration[7.1]
  def change
    create_table :financial_instruments do |t|
      t.references :company, null: false, foreign_key: true
      t.string :name, null: false
      t.string :instrument_type, null: false
      t.integer :principal, null: false
      t.integer :valuation_cap, null: false
      t.float :discount_rate
      t.float :interest_rate
      t.datetime :issue_date
      t.datetime :conversion_date

      t.timestamps
    end
  end
end

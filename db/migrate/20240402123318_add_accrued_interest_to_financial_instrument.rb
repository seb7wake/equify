class AddAccruedInterestToFinancialInstrument < ActiveRecord::Migration[7.1]
  def change
    add_column :financial_instruments, :accrued_interest, :integer
  end
end

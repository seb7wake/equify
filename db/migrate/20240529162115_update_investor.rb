class UpdateInvestor < ActiveRecord::Migration[7.1]
  def change
    change_table :investors do |t|
      t.rename :amout, :amount
    end
  end
end

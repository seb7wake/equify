class AddColumncToCompany < ActiveRecord::Migration[7.1]
  def change
    add_column :companies, :next_round_pre_money, :integer
  end
end

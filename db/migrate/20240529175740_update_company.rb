class UpdateCompany < ActiveRecord::Migration[7.1]
  def change
    # remove the column `pre_money_valuation` from the table `companies`
    remove_column :companies, :next_round_pre_money, :integer
    # remove the column `round_size` from the table `next_rounds`
    remove_column :companies, :next_round_size, :integer
  end
end

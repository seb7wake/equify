class AddColumncToCompanyRoundSize < ActiveRecord::Migration[7.1]
  def change
    add_column :companies, :next_round_size, :integer
  end
end

class ChangeDefaultForColumnName < ActiveRecord::Migration[7.1]
  def change
    change_column_default :companies, :next_round_pre_money, 8000000
    change_column_default :companies, :next_round_size, 1000000
  end
end

class CompanyNameUnique < ActiveRecord::Migration[7.1]
  def change
    add_index :companies, :name, unique: true
  end
end

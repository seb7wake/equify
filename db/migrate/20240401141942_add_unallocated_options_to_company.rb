class AddUnallocatedOptionsToCompany < ActiveRecord::Migration[7.1]
  def change
    add_column :companies, :unallocated_options, :integer, default: 1000000
  end
end

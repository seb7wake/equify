class CreateShareholders < ActiveRecord::Migration[7.1]
  def change
    create_table :shareholders do |t|
      t.integer :diluted_shares
      t.string :name
      t.integer :outstanding_options
      t.references :company, null: false, foreign_key: true

      t.timestamps
    end
  end
end

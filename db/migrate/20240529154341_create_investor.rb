class CreateInvestor < ActiveRecord::Migration[7.1]
  def change
    create_table :investors do |t|
      t.string :name
      t.integer :amout
      t.references :next_round, null: false, foreign_key: true

      t.timestamps
    end
  end
end

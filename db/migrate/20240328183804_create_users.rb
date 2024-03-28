class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.references :company, null: false, foreign_key: true
      t.string :email

      t.timestamps
    end
  end
end

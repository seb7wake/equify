# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_04_02_123318) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "companies", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "unallocated_options", default: 1000000
  end

  create_table "financial_instruments", force: :cascade do |t|
    t.bigint "company_id", null: false
    t.string "name", null: false
    t.string "instrument_type", null: false
    t.integer "principal", null: false
    t.integer "valuation_cap", null: false
    t.float "discount_rate"
    t.float "interest_rate"
    t.datetime "issue_date"
    t.datetime "conversion_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "accrued_interest"
    t.index ["company_id"], name: "index_financial_instruments_on_company_id"
  end

  create_table "shareholders", force: :cascade do |t|
    t.integer "diluted_shares"
    t.string "name"
    t.integer "outstanding_options"
    t.bigint "company_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["company_id"], name: "index_shareholders_on_company_id"
  end

  create_table "users", force: :cascade do |t|
    t.bigint "company_id", null: false
    t.string "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["company_id"], name: "index_users_on_company_id"
  end

  add_foreign_key "financial_instruments", "companies"
  add_foreign_key "shareholders", "companies"
  add_foreign_key "users", "companies"
end

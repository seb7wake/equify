class Company < ApplicationRecord
    has_many :users, dependent: :destroy
    has_many :shareholders, dependent: :destroy
end

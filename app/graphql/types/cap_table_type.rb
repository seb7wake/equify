module Types
    class CapTableType < Types::BaseObject
        field :shares_excluding_options, Integer, null: false
        field :shares_excluding_options_percentage, Float, null: false
        field :unallocated_options, Integer, null: false
        field :unallocated_options_percentage, Float, null: false
        field :total_shares, Integer, null: false
        field :total_shares_percentage, Float, null: false
        field :shareholders, [Types::CapTableShareholderType], null: false
    end
end
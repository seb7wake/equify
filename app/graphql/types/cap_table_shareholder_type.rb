module Types
    class CapTableShareholderType < Types::BaseObject
        field :name, String, null: false
        field :fully_diluted_total, Integer
        field :fully_diluted_percentage, Float
    end
end
require "test_helper"

class CompanyTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
  def setup
    @company = companies(:one)
  end

  test "should be valid" do
    assert @company.valid?
  end
end

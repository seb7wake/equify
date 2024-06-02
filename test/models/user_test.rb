require "test_helper"

class UserTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
  def setup
    @company = companies(:one)
    @user = @company.users.build(email: "seb@wake.com", company_id: @company.id)
  end

  test "should be valid" do
    assert @user.valid?
  end
  
end

class AddBankAccountHrefToUsers < ActiveRecord::Migration
  def change
    add_column :users, :bank_account_href, :string
  end
end

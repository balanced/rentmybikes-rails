class RenameUriToHref < ActiveRecord::Migration
  def change
    rename_column :rentals, :debit_uri, :debit_href
    rename_column :rentals, :credit_uri, :credit_href
    rename_column :users, :customer_uri, :customer_href
    
    add_index :users, :customer_href
  end
end

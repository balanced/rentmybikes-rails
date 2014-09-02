class DropDebitCreditHrefFieldsFromRentals < ActiveRecord::Migration
  def change
    remove_column :rentals, :debit_href
    remove_column :rentals, :credit_href
  end
end

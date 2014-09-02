class AddOrderHrefToRentals < ActiveRecord::Migration
  def change
    add_column :rentals, :order_href, :string
  end
end

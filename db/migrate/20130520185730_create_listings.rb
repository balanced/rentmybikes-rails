class CreateListings < ActiveRecord::Migration
  def change
    create_table :listings do |t|
      t.integer :bicycle_id
      t.string :title
      t.text :description
      t.integer :price
      t.string :bicycle_type
      t.integer :user_id
      t.string :location
      t.timestamps
    end
  end
end

class Rental < ActiveRecord::Base
  belongs_to :buyer, :class_name => 'User'
  belongs_to :owner, :class_name => 'User'
  belongs_to :listing

  attr_accessible :buyer_id, :owner_id, :listing_id, :order_href
end

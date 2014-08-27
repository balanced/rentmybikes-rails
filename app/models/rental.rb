class Rental < ActiveRecord::Base
  belongs_to :buyer, :class_name => 'User'
  belongs_to :owner, :class_name => 'User'
  belongs_to :listing

  attr_accessible :debit_href, :credit_href, :buyer_id, :owner_id, :listing_id
end

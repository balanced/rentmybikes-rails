class Listing < ActiveRecord::Base
  belongs_to :user
  has_many :rentals

  attr_accessible :name, :user_id, :location, :title, :description, :bicycle_type, :price

  def rent(params = {})
    puts params.inspect
    renter = params[:renter]
    user = params[:user] || User.find_by(customer_uri: renter.href)
    user_id = user.nil? ? nil : user.id

    # TODO: if a renter already has a valid card, then, use that to charge
    # otherwise, the card_uri should be used as the source

    card = Balanced::Card.fetch(params[:card_uri])
    card.associate_to_customer(renter)

    # debit buyer amount of listing
    debit = card.debit(
        amount: self.price,
        description: self.description
        #on_behalf_of: owner, # we'll replace this with the Order resource soon
    )

    # credit owner of bicycle amount of listing.
    # 
    # since this is an example, we're showing how to issue a credit
    # immediately. normally you should wait for order fulfillment
    # before crediting.

    credit = self.user.balanced_bank_account.credit(
      amount: self.price,
      description: self.description
    )

    rental = Rental.new(
      debit_uri: debit.href,
      credit_uri: credit.href,
      listing_id: self.id,
      buyer_id: user_id,
      owner_id: self.user.id
    )
    rental.save
  end
end

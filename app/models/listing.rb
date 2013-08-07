class Listing < ActiveRecord::Base
  belongs_to :user
  has_many :rentals

  attr_accessible :name, :user_id, :location, :title, :description, :bicycle_type, :price, :owner_uri

  def rent(params = {})

    renter = params[:renter]
    user = params[:user] || User.find_by(:customer_uri => renter.uri)

    # TODO: if a renter already has a valid card, then, use that to charge
    # otherwise, the card_uri should be used as the source
    renter.add_card(params[:card_uri])

    owner = self.user.balanced_customer

    # debit buyer amount of listing

    debit = renter.debit(
        :amount => self.price*100,
        :description => self.description,
        :on_behalf_of => owner,
    )

    # credit owner of bicycle amount of listing
    # since this is an example, we're showing how to issue a credit
    # immediately.
    #
    # obviously, you should take advantage of escrow

    credit = owner.credit(
      :amount => self.price,
      :description => self.description
    )

    rental = Rental.new(
      :debit_uri  => debit.uri,
      :credit_uri => credit.uri,
      :listing_id => self.id,
      :buyer => user,
      :owner => self.user,
    )
    rental.save

  end

end

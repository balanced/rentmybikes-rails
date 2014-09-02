class RentalsController < ApplicationController

  def create
    # user represents a user in our database who wants to rent a bicycle
    # buyer is a Balanced::Customer object that knows about payment information for user
    # or guest who wants to rent a bicycle

    buyer, user = nil, nil

    # logic to handle guest/not signed in users

    if user_signed_in?
      buyer = current_user.balanced_customer
    else
      buyer = User.create_balanced_customer(
        :name  => params[:"guest-name"],
        :email => params[:"guest-email_address"]
      )
    end

    listing = Listing.find(params[:listing_id])
    listing.rent(renter: buyer, card_href: params[:card_href])
    render :confirmation
  end


end

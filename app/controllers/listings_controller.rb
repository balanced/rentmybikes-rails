class ListingsController < ApplicationController
  before_filter :require_sign_in, :only => [:edit, :update]
  before_filter :listing_owner_required, :only => [:edit, :update]

  def index
    @listings = Listing.all
  end

  def show
    @listing = Listing.find(params[:id])
  end

  def create
    # generate marketplace object
    marketplace = Balanced::Marketplace.my_marketplace
    user, owner = nil, nil
    bank_account_uri = params[:bank_account_uri]
    # logic to handle guest/not signed in users
    if user_signed_in?
      user = current_user
      owner = user.balanced_customer
    else
        owner = User.create_balanced_customer(
        :name  => params[:'guest-name'],
        :email => params[:'guest-email_address']
        )
    end

    # add bank account uri passed back from balanced.js

    owner.add_bank_account(bank_account_uri)
    if user_signed_in?
      @listing = current_user.listings.new
    else
      @listing = Listing.new
    end
    @listing.title = params[:listing_title]
    @listing.description = params[:listing_description]
    @listing.location = params[:listing_location]
    @listing.bicycle_type = params[:listing_bike_type]
    @listing.price = (params[:listing_rent_price].to_i*100).to_s

    if @listing.save!
      render :confirmation
    else
      render :new
    end
  end

  def new
    @random_listing = Listing.find(rand(Listing.all.length)+1)
  end

  def edit
    @listing = current_user.listings.find(params[:id])
  end

  def update
    @listing = current_user.listings.find(params[:id])
    if @listing.update_attributes(params[:listing])
      @listing.price = @listing.price*100
      @listing.save!
      flash[:notice] = "Listing updated successfully."
      redirect_to listing_path(@listing)
    else
      flash[:error] = "There was a problem updating the listing."
      render :action => :edit
    end
  end

private
  def require_sign_in
    head :forbidden unless (user_signed_in? && current_user.present?)
  end
  
  def listing_owner_required
    head :forbidden unless (@listing.present? && user_signed_in? && @listing.users.include?(current_user))
  end

end


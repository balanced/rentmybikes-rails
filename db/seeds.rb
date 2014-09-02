# create dummy user
user = User.create(email: 'asdf@asdf.com',
                   name: 'Jimbo Jenkins',
                   password: 'asdfasdf',
                   password_confirmation: 'asdfasdf')

# create a bicycle owner
owner = user.balanced_customer

# add a bank account to be able to receive payments (credits)
bank_account = Balanced::BankAccount.new(
                 account_number: '1234567980',
                 routing_number: '011500337',
                 name: 'Jimbo Jenkins',
                 account_type: 'checking'
               ).save

bank_account.associate_to_customer(owner)
user.bank_account_href = bank_account.href
user.save

Listing.create(
  user_id: 1,
  title: "panasonic fixie",
  price: 1500,
  bicycle_type: "fixie",
  description: "Early 80's panasonic 10spd frame with
  a nice new chrome fork, aluminum bars, nice aluminum
  stem, weinman singlespeed/fixed wheel set (velocity
  style rims).",
  location: "Palo Alto, CA"
)

Listing.create(
  user_id: 1,
  title: "cosmic cx 1.0",
  price: 1800,
  bicycle_type: "hybrid",
  description: "The Cozmic CX 1.0 features a butted
  frame (reduces weight) combined with hydraulic brakes
  to give amazing stopping power with light feel. The
  forks feature lock out and pre load adjustment-useful
  if you are riding along the road to work,
  or to the race.",
  location: "San Francisco, CA"
)

Listing.create(
  user_id: 1,
  title: "myata vintage road bike",
  price: 1200,
  bicycle_type: "road",
  description: "This 12-speed Miyata 512 is built on
  a lugged, triple-butted, CroMo frame. A solid ride with
  a tight race geometry to keep it quick and easy to
  handle.",
  location: "San Francisco, CA"
)

Listing.create(
  user_id: 1,
  title: "roberts cycles clubman",
  price: 1000,
  bicycle_type: "touring",
  description: "The Clubman is tough enough, yet
  comfortable enough for regular commuting. The tubing
  is slightly heavier-duty than the Audax to take larger
  panniers. Tubing is Reynolds 853 & 725 with 531 Forks.",
  location: "San Francisco, CA"
)


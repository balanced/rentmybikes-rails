rentmybike
===

[![Code Climate](https://codeclimate.com/github/balanced/rentmybikes-rails.png)](https://codeclimate.com/github/balanced/rentmybikes-rails)

Reference implementation of [Balanced](https://www.balancedpayments.com) for
collecting and charging credit cards, and collecting and crediting bank accounts.

Uses jQuery, [Less](http://lesscss.org/), Ruby(>=1.9.3), Rails (>= 4.0.0.rc1), [Devise](https://github.com/plataformatec/devise), PosgreSQL, and
[Bootstrap](http://twitter.github.com/bootstrap/).

If you'd like to deploy signup for a [Heroku](http://www.heroku.com/signup)
account if you dont already have one and install [Toolbelt]
(https://toolbelt.heroku.com/).

Live Site
---
[http://rentmybike-rails.herokuapp.com](http://rentmybike-rails.herokuapp.com)

Resources
---
* [Balanced Ruby Client](https://github.com/balanced/balanced-ruby)
* [Balanced API docs](https://www.balancedpayments.com/docs/api?language=ruby)
* [Balanced JavaScript resources/tokenizing sensitive information](https://balancedpayments.com/docs/overview?language=ruby#tokenizing-sensitive-information)


Install
---

    $ git clone https://github.com/balanced/rentmybikes-rails.git
    $ cd rentmybikes
    $ bundle install
    $ rake db:create
    $ rake db:migrate
    $ foreman run rake db:seed (if you want to seed database - also requires foreman gem)


Configure
---

Create an .env file for the app by renaming .env.sample to .env

* Set `BALANCED_SECRET` to your secret key. Get one from [Balanced] (https://www.balancedpayments.com/marketplaces/start) if you dont have one.

Example:

```ruby
BALANCED_SECRET='your-balanced-secret'
```

Edit the following in `rentmybike/config/initializers/devise.rb`:

* Configure the e-mail address which will be shown in Devise::Mailer

Edit the following in `rentmybike/config/database.yml`:

* Set all necessary fields for your database.

Example:

```
common: &common
adapter: postgresql
username:
password:
host: localhost
timeout: 5000
```

```
development:
<<: *common
database: rentmybike_dev
```

```test:
<<: *common
database: rentmybike_test
```



Run
---

    $ foreman start

or if you dont have [Toolbelt] (https://toolbelt.heroku.com/)

    $ rails s


Deploy
---
    $ cd rentmybikes
    $ heroku create
    $ git push origin heroku
    $ heroku ps:scale web=1
    $ heroku open

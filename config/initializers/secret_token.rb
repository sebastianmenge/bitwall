# Be sure to restart your server when you modify this file.

# Your secret key is used for verifying the integrity of signed cookies.
# If you change this key, all old signed cookies will become invalid!

# Make sure the secret is at least 30 characters and all random,
# no regular words or you'll be exposed to dictionary attacks.
# You can use `rake secret` to generate a secure secret key.

# Make sure your secret_key_base is kept private
# if you're sharing your code publicly.
Bitwall::Application.config.secret_key_base = '6cba1d64bf756f708aa625343ce6a6b115051cc5fb76661f24ca30727b52aafc54feb5d785bf377b07e1f3297c5746ea75b68fc90ebe4e38bf70cd5ff9e5ad39'

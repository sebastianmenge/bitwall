raw_config = File.read("#{Rails.root}/config/config.yml")
CONFIG ||= YAML.load(raw_config)[Rails.env]

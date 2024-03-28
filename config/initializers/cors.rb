Rails.application.config.middleware.insert_before 0, Rack::Cors do
    allow do
      origins '*' # Be more specific in a real application
      resource '*',
        headers: :any,
        methods: %i[get post put patch delete options head],
        expose: ['Authorization'] # Add this line
    end
  end
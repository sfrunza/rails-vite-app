Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    if Rails.env.development?
      origins "localhost:3000", "localhost:3001", "http://localhost:5173"
    else
      origins "https://rails-api-with-auth-4f67f5bd980d.herokuapp.com"
    end

    resource "*",
             headers: :any,
             methods: %i[get post put patch delete options head],
             credentials: true
  end
end

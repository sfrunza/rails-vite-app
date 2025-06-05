Rails.application.routes.draw do
  mount ActionCable.server => "/cable"

  namespace :api do
    namespace :v1 do
      resource :session, only: %i[ create show destroy ]
      resources :passwords, param: :token

      resources :users, only: %i[ show ]

      resources :services, only: %i[index create destroy] do
        collection { post :bulk_update }
      end

      # resources :extra_services, only: %i[index create destroy] do
      #   collection { post :bulk_update }
      # end

      # resources :packings, only: %i[index update create destroy] do
      #   collection { post :bulk_update }
      # end

      # resources :trucks, only: %i[index create destroy] do
      #   collection { post :bulk_update }
      # end

      # resources :rates, only: %i[index create] do
      #   collection { post :bulk_update }
      # end

      # resources :calendar_rates, only: %i[index create update destroy]
      # resources :employees, only: %i[index show create update]

      # resources :users do
      #   member { patch :update_password }
      #   collection { get :check_email }
      # end

      # resources :settings, only: %i[index create] do
      #   collection { post :bulk_update }
      # end

      # resources :move_sizes, only: %i[index create update destroy] do
      #   collection { post :bulk_update }
      # end

      # resources :entrance_types, only: %i[index create destroy] do
      #   collection { post :bulk_update }
      # end

      # resources :requests do
      #   post :unpair, on: :member
      #   post "pair", on: :member
      #   get "status_counts", on: :collection
      #   post :images, on: :member
      #   delete "/images/:image_id", to: "requests#delete_image", on: :member
      #   post :clone, on: :member
      # end

      # resources :search, only: %i[index]
    end
  end

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  get "*path",
    to: "fallback#index",
    constraints: ->(request) { !request.xhr? && request.format.html? }
end

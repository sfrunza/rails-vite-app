class CreateRates < ActiveRecord::Migration[8.0]
  def change
    create_table :rates do |t|
      t.integer :extra_mover_rate
      t.integer :extra_truck_rate
      t.boolean :enable
      t.string :name
      t.string :color
      t.jsonb :movers_rates,
              default: {
                "2": {
                  hourly_rate: 10_000
                },
                "3": {
                  hourly_rate: 10_000
                },
                "4": {
                  hourly_rate: 10_000
                },
                "5": {
                  hourly_rate: 10_000
                },
                "6": {
                  hourly_rate: 10_000
                },
                "7": {
                  hourly_rate: 10_000
                },
                "8": {
                  hourly_rate: 10_000
                },
                "9": {
                  hourly_rate: 10_000
                },
                "10": {
                  hourly_rate: 10_000
                }
              }

      t.timestamps
    end
  end
end

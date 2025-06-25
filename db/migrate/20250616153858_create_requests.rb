class CreateRequests < ActiveRecord::Migration[7.0]
  def change
    create_table :requests do |t|
      t.references :customer, foreign_key: { to_table: :users }, null: true
      t.references :foreman, foreign_key: { to_table: :users }, null: true
      t.references :service, null: false, foreign_key: true
      t.references :packing, null: false, foreign_key: true, default: 1
      t.references :move_size, null: true, foreign_key: true
      t.references :paired_request, null: true, foreign_key: { to_table: :requests }, index: true

      t.datetime :moving_date

      t.datetime :delivery_date_window_start
      t.datetime :delivery_date_window_end
      t.datetime :schedule_date_window_start
      t.datetime :schedule_date_window_end
      t.integer :status, default: 0
      t.jsonb :extra_services, default: []
      t.jsonb :details,
              default: {
                delicate_items_question_answer: "",
                bulky_items_question_answer: "",
                disassemble_items_question_answer: "",
                comments: "",
                is_touched: false
              },
              null: false
      t.integer :start_time_window
      t.integer :end_time_window
      t.integer :start_time_window_delivery
      t.integer :end_time_window_delivery
      t.integer :start_time_window_schedule
      t.integer :end_time_window_schedule
      t.boolean :is_same_day_delivery, default: false
      t.boolean :is_delivery_now, default: false
      t.boolean :is_calculator_disabled, default: false
      t.jsonb :work_time, default: { min: 0, max: 0 }
      t.jsonb :total_time, default: { min: 0, max: 0 }
      t.jsonb :total_price, default: { min: 0, max: 0 }
      t.integer :rate, default: 0
      t.integer :travel_time, default: 0
      t.integer :deposit, default: 10_000
      t.boolean :is_moving_from_storage, default: false
      t.integer :min_total_time, default: 120, null: false
      t.integer :crew_size
      t.integer :crew_size_delivery
      t.boolean :can_edit_request, default: true, null: false
      t.text :sales_notes
      t.text :driver_notes
      t.text :customer_notes
      t.text :dispatch_notes
      t.jsonb :stops, default: []
      t.jsonb :origin,
              default: {
                street: "",
                city: "",
                state: "",
                zip: "",
                apt: "",
                floor: nil,
                location: {
                  lat: 0,
                  lng: 0
                }
              },
              null: false
      t.jsonb :destination,
              default: {
                street: "",
                city: "",
                state: "",
                zip: "",
                apt: "",
                floor: nil,
                location: {
                  lat: 0,
                  lng: 0
                }
              },
              null: false
      t.datetime :booked_at

      t.timestamps
    end

    # Add indexes for better query performance
    add_index :requests, :status
    add_index :requests, :is_moving_from_storage
    add_index :requests, :can_edit_request
  end
end

class CreateCalendarRates < ActiveRecord::Migration[8.0]
  def change
    create_table :calendar_rates do |t|
      t.date :date
      t.boolean :enable_automation
      t.boolean :enable_auto_booking
      t.boolean :is_blocked
      t.references :rate, null: true, foreign_key: true

      t.timestamps
    end
    add_index :calendar_rates, :date
  end
end

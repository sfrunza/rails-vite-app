class CreateServices < ActiveRecord::Migration[8.0]
  def change
    create_table :services do |t|
      t.string :name
      t.boolean :enabled, default: true
      t.integer :miles_setting
      t.integer :index
      t.boolean :is_default, default: false

      t.timestamps
    end
  end
end

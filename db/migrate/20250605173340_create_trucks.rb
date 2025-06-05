class CreateTrucks < ActiveRecord::Migration[8.0]
  def change
    create_table :trucks do |t|
      t.string :name
      t.boolean :is_active, default: true

      t.timestamps
    end
  end
end

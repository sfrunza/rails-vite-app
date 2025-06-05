class CreateExtraServices < ActiveRecord::Migration[8.0]
  def change
    create_table :extra_services do |t|
      t.string :name
      t.integer :price
      t.boolean :enabled, default: true
      t.integer :index

      t.timestamps
    end
  end
end

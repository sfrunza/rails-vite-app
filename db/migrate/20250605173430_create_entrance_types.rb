class CreateEntranceTypes < ActiveRecord::Migration[8.0]
  def change
    create_table :entrance_types do |t|
      t.string :name, null: false
      t.string :form_name, null: false
      t.integer :index, default: 0

      t.timestamps
    end
  end
end

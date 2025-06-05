class CreateMoveSizes < ActiveRecord::Migration[8.0]
  def change
    create_table :move_sizes do |t|
      t.string :name, null: false
      t.text :description
      t.integer :index, default: 0
      t.integer :dispersion
      t.integer :truck_count
      t.integer :weight
      t.integer :volume
      t.jsonb :volume_with_dispersion, default: { min: 0, max: 0 }
      t.jsonb :crew_size_settings,
              default: [
                [ 2, 2, 2, 2, 2, 2, 2 ],
                [ 2, 2, 2, 2, 2, 2, 2 ],
                [ 2, 2, 2, 2, 2, 2, 2 ],
                [ 2, 2, 2, 3, 2, 2, 2 ],
                [ 2, 2, 2, 2, 2, 2, 2 ],
                [ 2, 2, 2, 2, 2, 2, 2 ],
                [ 2, 2, 2, 2, 2, 2, 2 ],
                [ 2, 2, 2, 2, 2, 2, 2 ]
              ]

      t.timestamps
    end
  end
end

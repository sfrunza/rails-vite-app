class CreateMoverRequests < ActiveRecord::Migration[7.0]
  def change
    create_table :mover_requests do |t|
      t.references :request, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end

    add_index :mover_requests, [ :request_id, :user_id ], unique: true
  end
end

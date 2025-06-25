class CreateJoinTableRequestsTrucks < ActiveRecord::Migration[8.0]
  def change
    create_join_table :requests, :trucks do |t|
      t.index %i[request_id truck_id]
      t.index %i[truck_id request_id]
    end
  end
end

class CreateGlobalSettings < ActiveRecord::Migration[8.0]
  def change
    create_table :global_settings do |t|
      t.timestamps
    end
  end
end

puts "Deleting old records..."

Request.delete_all
Service.delete_all
Packing.delete_all
EntranceType.delete_all
CalendarRate.delete_all
Rate.delete_all
Truck.delete_all
Session.delete_all
User.delete_all

User.create!(
  first_name: "Aurel",
  last_name: "Busuioc",
  email_address: "frunza.sergiu3@gmail.com",
  password: "111111",
  role: "admin"
)
User.create!(
  first_name: "manager",
  last_name: "manager",
  email_address: "manager@mail.com",
  password: "111111",
  role: "manager"
)
User.create(
  first_name: "Test1",
  last_name: "Test1",
  email_address: "test1@mail.com",
  password: "111111"
)
User.create(
  first_name: "Test2",
  last_name: "Test2",
  email_address: "test2@mail.com",
  password: "111111"
)
User.create(
  first_name: "Helper",
  last_name: "Helper",
  email_address: "helper@mail.com",
  role: "helper",
  password: "111111"
)
User.create(
  first_name: "Helper2",
  last_name: "Helper2",
  email_address: "helper2@mail.com",
  role: "helper",
  password: "111111"
)
User.create(
  first_name: "Helper3",
  last_name: "Helper3",
  email_address: "helper3@mail.com",
  role: "helper",
  password: "111111"
)
User.create(
  first_name: "Helper4",
  last_name: "Helper4",
  email_address: "helper4@mail.com",
  role: "helper",
  password: "111111"
)
User.create(
  first_name: "Driver",
  last_name: "Driver",
  email_address: "driver@mail.com",
  role: "driver",
  password: "111111"
)
User.create(
  first_name: "Driver2",
  last_name: "Driver2",
  email_address: "driver2@mail.com",
  role: "driver",
  password: "111111"
)
User.create(
  first_name: "Foreman",
  last_name: "Foreman",
  email_address: "foreman@mail.com",
  role: "foreman",
  password: "111111"
)
User.create(
  first_name: "Foreman2",
  last_name: "Foreman2",
  email_address: "foreman2@mail.com",
  role: "foreman",
  password: "111111"
)
User.create(
  first_name: "Admin",
  last_name: "Admin",
  email_address: "admin@mail.com",
  role: "admin",
  password: "111111"
)

User.create(
  first_name: "Customer1",
  last_name: "Customer1",
  email_address: "customer1@mail.com",
  password: "111111"
)
User.create(
  first_name: "Customer2",
  last_name: "Customer2",
  email_address: "customer2@mail.com",
  password: "111111"
)

User.create(
  first_name: "Customer3",
  last_name: "Customer3",
  email_address: "customer3@mail.com",
  password: "111111"
)

Service.create!(
  name: "Local move",
  enabled: true,
  miles_setting: 150,
  index: 0,
  is_default: true
)

Service.create!(
  name: "Flat Rate",
  enabled: true,
  miles_setting: 150,
  index: 1,
  is_default: true
)

Service.create!(
  name: "Loading help",
  enabled: true,
  miles_setting: 0,
  index: 2,
  is_default: true
)

Service.create!(
  name: "Unloading help",
  enabled: true,
  miles_setting: 0,
  index: 3,
  is_default: true
)

Service.create!(
  name: "Inside move",
  enabled: true,
  miles_setting: 0,
  index: 4,
  is_default: true
)

Service.create!(
  name: "Packing only",
  enabled: true,
  miles_setting: 0,
  index: 5,
  is_default: true
)

Service.create!(
  name: "Moving & Storage",
  enabled: true,
  miles_setting: 0,
  index: 6,
  is_default: true
)

Service.create!(
  name: "Overnight Truck Storage",
  enabled: true,
  miles_setting: 0,
  index: 7,
  is_default: true
)

Rate.create(name: "Discount", color: "#00a455", enable: true)
Rate.create(name: "Regular", color: "#0044ff", enable: true)
Rate.create(name: "Subpeak", color: "#ffa500", enable: true)
Rate.create(name: "Peak", color: "#ff5400", enable: true)
Rate.create(name: "High Peak", color: "#fb0009", enable: true)

Truck.create(name: "18 FT")
Truck.create(name: "20 FT")
Truck.create(name: "26 FT")

Packing.create(
  name: "I will pack by myself",
  description: "This is some description.",
  is_default: true,
  labor_increase: 0,
  index: 0
)

Packing.create(
  name: "I need Partial Packing Help",
  description: "This is some description.",
  is_default: false,
  labor_increase: 25,
  index: 1
)

Packing.create(
  name: "I need Full Packing Service",
  description: "This is some description.",
  is_default: false,
  labor_increase: 50,
  index: 2
)

EntranceType.create(
  name: "1st Floor",
  form_name: "1",
)

EntranceType.create(
  name: "2nd Floor",
  form_name: "2",
)

EntranceType.create(
  name: "3rd Floor",
  form_name: "3",
)

EntranceType.create(
  name: "Elevator",
  form_name: "Elevator",
)

EntranceType.create(
  name: "Private House",
  form_name: "House",
)

CalendarRate.create_full_year

# Create requests

customer_ids = User.where(role: "customer").pluck(:id)
service_ids = Service.pluck(:id)
packing_ids = Packing.pluck(:id)
move_size_ids = MoveSize.pluck(:id)

puts "Creating 100 requests..."

requests_to_create = 100
batch_size = 10
progress = 0

(requests_to_create / batch_size).times do
  requests =
    batch_size.times.map do
      {
        customer_id: customer_ids.sample,
        status: %w[
          pending
          pending_info
          pending_date
          hold
          not_confirmed
          confirmed
          not_available
          completed
          spam
          canceled
          refused
          closed
          expired
          archived
        ].sample,
        moving_date: rand(1.month.ago..3.months.from_now),
        service_id: service_ids.sample,
        packing_id: packing_ids.sample,
        move_size_id: move_size_ids.sample
      }
    end

  Request.insert_all!(requests)

  progress += batch_size
  puts "Created #{progress} requests..."
end

puts "Finished creating requests!"
puts "Total requests: #{Request.count}"

puts "Seeding complete!"

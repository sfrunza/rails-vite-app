json.calendar_rates @calendar_rates.each_with_object({}) { |rate, hash|
    formatted_date = rate[1].strftime("%Y-%m-%d")
    hash[formatted_date] = {
      id: rate[0],
      formatted_date: formatted_date,
      rate_id: rate[2],
      enable_automation: rate[3],
      enable_auto_booking: rate[4],
      is_blocked: rate[5]
    }
}

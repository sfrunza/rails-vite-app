class RequestsChannel < ApplicationCable::Channel
  def subscribed
    stop_all_streams
    stream_from "requests"
  end

  def unsubscribed
    stop_all_streams
  end
end

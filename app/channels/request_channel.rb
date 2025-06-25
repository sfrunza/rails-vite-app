class RequestChannel < ApplicationCable::Channel
  def subscribed
    stop_all_streams
    stream_from "request_#{params[:request_id]}"
  end

  def unsubscribed
    stop_all_streams
  end
end

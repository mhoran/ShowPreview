class Show
  include HTTParty
  base_uri 'api.songkick.com'
  default_params :apikey => 'musichackdayboston'
  format :json

  def self.all(artist_name)
    self.get("/api/3.0/events.json", :query => {:artist_name => artist_name})
  end

  def artists
    []
  end
end

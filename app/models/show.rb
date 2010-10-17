class Show
  include HTTParty
  base_uri 'api.songkick.com'
  default_params :apikey => 'musichackdayboston'
  format :json

  def self.all(artist_name, latitude, longitude, page = 1)
    q = { :artist_name => artist_name, :location => "geo:#{latitude},#{longitude}", :page => page }
    p = self.get('/api/3.0/events.json', :query => q)['resultsPage']
    if p && p['results'] && page * p['perPage'] <= p['totalEntries']
      p['results']['event'] | self.all(artist_name, latitude, longitude, page.next)
    else
      []
    end
  end
end

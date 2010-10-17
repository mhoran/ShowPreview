class Show
  include HTTParty
  base_uri 'api.songkick.com'
  default_params :apikey => 'musichackdayboston'
  format :json

  def self.all(artist_name, latitude, longitude, page = 1)
    q = { :artist_name => artist_name, :location => "geo:#{latitude},#{longitude}", :page => page }
    res = self.get('/api/3.0/events.json', :query => q)['resultsPage']
    r = []
    if res && res['results'] && page.pred * res['perPage'] <= res['totalEntries']
      r = res['results']['event'] | self.all(artist_name, latitude, longitude, page.next)
    end
    r
  end
end

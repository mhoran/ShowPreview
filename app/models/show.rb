class Show
  include HTTParty
  base_uri 'api.songkick.com'
  default_params :apikey => 'musichackdayboston'
  format :json

  def self.all(artist_name, latitude, longitude, page = 1)
    q = { :artist_name => artist_name, :location => "geo:#{latitude},#{longitude}", :page => page, :per_page => 1 }
    res = self.get('/api/3.0/events.json', :query => q)['resultsPage']
    if res && res['results']
      r = res['results']['event'] 
      if page * res['perPage'] < res['totalEntries']
        r += self.all(artist_name, latitude, longitude, page.next)
      end
    else
      r = []
    end
    r
  end
end

class Artist
  include HTTParty
  base_uri 'developer.echonest.com'
  default_params :api_key => 'TH75GDXMUNRGGZJYV'
  format :json

  def songs(params = {})
    q = params.merge(:artist_id => "musicbrainz:artist:#{@mbid}", :sort => 'song_hotttnesss-desc', :limit => true)
    a = [q.to_params, 'bucket=id:7digital', 'bucket=tracks']
    r = self.class.get('/api/v4/playlist/static', :query => a)['response']
    r && r['status']['code'] == 0 ? r['songs'] : []
  end

  def self.find(mbid)
    self.new(mbid)
  end

  private

  def initialize(mbid)
    @mbid = mbid
  end
end

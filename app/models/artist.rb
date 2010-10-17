class Artist
  include HTTParty
  base_uri 'developer.echonest.com'
  default_params :api_key => 'N6E4NIOVYMTHNDM8J'
  format :json

  def songs(options = {})
    q = options.merge(:id => "musicbrainz:artist:#{@mbid}")
    r = self.class.get('/api/v4/artist/audio', :query => q)['response']
    # songs should be unique
    r && r['status']['code'] == 0 ? r['audio'] : []
  end

  def self.find(mbid)
    self.new(mbid)
  end

  private

  def initialize(mbid)
    @mbid = mbid
  end
end

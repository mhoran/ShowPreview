class ArtistsController < ApplicationController
  def songs
    @artist = Artist.new(params[:id])
    respond_to do |format|
      format.json { render :json => @artist.songs(:results => 3) }
    end
  end
end

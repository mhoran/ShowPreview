class ShowsController < ApplicationController
  def search
    @shows = Show.all(params[:artist_name], params[:latitude], params[:longitude])
    respond_to do |format|
      format.json { render :json => @shows.first }
    end
  end
end

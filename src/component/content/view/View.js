import React, { Component } from 'react'
import UserRepository from '@service/user/UserRepository';

import Skeleton from '@component/Skeleton';

import './View.css';

export default class View extends Component {

	constructor(props) {
		super();
		this.ur = UserRepository;

		this.state = {
			series: null,
		}

		let self = this;

		// TODO
		// Checken ob der nutzer die Serie hat, falls nicht lade die 
		// Series aus dem SeriesRepository, falls doch lade sie vom Nutzer
		// Und zeige gleichzeitig an ob er schon was gesehen hat etc.

		this.ur.getSeries(props.match.params.id, (series) => {
			self.setState({
				series: series
			});
		});
		
		this.getImageSrc = this.getImageSrc.bind(this);
	}

	componentDidMount() {
	}
	
	getImageSrc() {
		const url = this.state.series.posterUrl;
		if (url.endsWith('jpg')) {
			return url.replace('w300', 'w500');
		} else {
			return 'bright-squares.53c1ec5f96d716d4265e.png';
		}
	}

  	render() {
		let self = this;

		const buildEpisodeName = (episode) => {
			const episodeNumber = episode.episode < 10 ? `0${episode.episode}` : `${episode.episode}`;
			const seasonNumber = episode.season < 10 ? `0${episode.season}` : `${episode.season}`;
			return `S${seasonNumber}E${episodeNumber} - ${episode.name} vom ${episode.airDate}`;
		}

		const mapEpisode = (episode) => {
			return(
				<div className="episode-container">
					<span className={ 'fa ' + (episode.watched ? 'fa-check-square-o' : 'fa-square-o') }></span>
					{ buildEpisodeName(episode) }
				</div>
			);
		}

		const mapSeason = (season) => {
			return(
				<div className="season-wrapper">
					{season.name}
					<div className="episodes-wrapper">
						{ season.episodes.map(mapEpisode) }
					</div>
				</div>
			);
		}

		const mapGenres = (genre) => {
			return(
				<div className="genre-badge">
					{ genre.name }
				</div>
			);
		}

		const renderSeries = () => {
			if (self.state.series != null) {

				return (
					<div className="series-container">
						<div className="series-header">
							<img src={ self.getImageSrc() } alt="" />
							<div className="series-name-wrapper">
								<div className="series-name">
									{ self.state.series.name }
								</div>
							</div>
							<div className="genre-wrapper">
								{ self.state.series.genres.map(mapGenres) }
							</div>
						</div>
						{ self.state.series.overview }<br />
						{ self.state.series.seasons.map(mapSeason) }
					</div>
				);
			}
		}

		return (
			<Skeleton>
				<div className="view-series-wrapper">
					{ renderSeries() }
				</div>
			</Skeleton>
		)
  }
}
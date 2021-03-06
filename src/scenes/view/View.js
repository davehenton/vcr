import React from 'react'
import { Link } from "react-router-dom";

import SeriesRepository from '@service/series/SeriesRepository';

import AbstractSeries from '@components/abstract/AbstractSeries';

import { Tabs, Tab } from '@components/tabs';

import Skeleton from '@scenes/skeleton/Skeleton';

import './View.css';

export default class View extends AbstractSeries {

	constructor(props) {
		super();
		this.sr = new SeriesRepository();

		this.state = {
			series: null,
			changed: false,
			bsto: '',
			otaku: ''
		}

		const self = this;

		this.ur.getSeries(props.match.params.id, (series) => {
			self.setState({
				series: series
			});
		});

		this.handleLinkInput = this.handleLinkInput.bind(this)
		this.savePreferences = this.savePreferences.bind(this)
		
		this.sr.getBurningSeriesLink(props.match.params.id).then(bsto => {
			this.setState({
				bsto: bsto || ''
			})
		})

		this.sr.getLinksOfSeries(props.match.params.id).then(links => {
			if (links)
				this.setState({
					otaku: links.otaku || '',
					bsto: links.bsto || (this.state.bsto || '')
				})
		})
	}

	componentDidMount() {
	}

	handleLinkInput(e) {
		switch (e.target.id) {
			case "otaku":
				this.setState({
					otaku: e.target.value,
					changed: true
				});
				break;
			case "bsto":
				this.setState({
					bsto: e.target.value,
					changed: true
				});
				break;
		}
	}

	savePreferences() {
		const links = {
			bsto: this.state.bsto,
			otaku: this.state.otaku
		}
		this.sr.saveLinkToSeries(this.state.series.id, '', links).then(() => {
			this.setState({
				changed: false
			});
		});
	}

  	render() {
		let self = this;

		const buildEpisodeNumber = (episode) => {
			const episodeNumber = episode.episode < 10 ? `0${episode.episode}` : `${episode.episode}`;
			const seasonNumber = episode.season < 10 ? `0${episode.season}` : `${episode.season}`;
			return `S${seasonNumber}E${episodeNumber}`;
		}

		const mapEpisode = (episode, index) => {
			return(
				<tr key={ episode.episode }>
					<td>
						<button onClick={ this.toggleEpisode.bind(this, episode, index) }>
							<span className={ 'fa ' + (episode.watched ? 'fa-check-square-o' : 'fa-square-o') }></span>
						</button>
					</td>
					<td>
						{ buildEpisodeNumber(episode) }
					</td>
					<td>
						{ episode.name }
					</td>
					<td>
						{ this.dateFormat(episode.airDate) }
					</td>
				</tr>
			);
		}

		const mapSeason = (season, index) => {
			return(
				<Tab key={ season.seasonNumber } title={ `Staffel ${index + 1}` }>
					<table key={ season.seasonNumber } className="season-wrapper">
						<thead>
							<tr>
								<th>
									<button 
										className="fa fa-eye" 
										onClick={ this.toggleSeason.bind(this, season) }>
									</button>
								</th>
							</tr>
						</thead>
						<tbody className="episodes-wrapper">
							{ season.episodes ? season.episodes.map(mapEpisode) : '' }
						</tbody>
					</table>
				</Tab>
			);
		}

		const mapGenres = (genre, index) => {
			return(
				<div key={ index } className="genre-badge">
					{ genre }
				</div>
			);
		}

		const renderSeries = () => {
			if (self.state.series != null) {
				return (
					<div className="series-container">
						<div className="series-header">
							<img src={ self.getImageSrc(500) } alt="" />
							<Link className="series-header--link" to="/">
								<span className="fa fa-arrow-left fa-2x"></span>
							</Link>
							<div className="series-name-wrapper">
								<div className="series-name">
									{ self.state.series.name }
								</div>
							</div>
							<div className="genre-wrapper">
								{ self.state.series.genres.map(mapGenres) }
							</div>
						</div>
						<div className="series-actions">
							<div className="input-container">
								<label>bs.to</label>
								<input id="bsto" type="type" placeholder="https://bs.to/example" value={ this.state.bsto } onChange={ this.handleLinkInput } />
								<label>otakustream</label>
								<input id="otaku" type="type" placeholder="https://otakustream.tv/anime/xyz/" value={ this.state.otaku } onChange={ this.handleLinkInput } />
							</div>
							<div className="spacer"></div>
							{ this.state.changed ? <button className="save" onClick={ this.savePreferences }>Speichern</button> : '' }
						</div>
						<div className="series-content">
							<div className="series-content--description">
								{ self.state.series.overview }
							</div>
							<Tabs defaultActiveTabIndex={ 0 }>
								{ self.state.series.seasons.map(mapSeason) }
							</Tabs>
						</div>
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

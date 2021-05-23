import React from 'react'
import Axios from 'axios'

import ListMusic from './Layouts/ListMusic'

class App extends React.Component {
    state = {
        ResultData: null,
        DetailData: null,
        SearchValue: '',
        LimitMusic: 25,
        IndexPlayer: 0,
        ListMusic: null,
        MusicPlayer: false,
        PLayFast: false,
        Duration: 0,
        CurrentTime: 0,
        IsPLaying: true,
        Song: new Audio(),
        Config: {
            url: 'https://itunes.apple.com/search?term="bruno mars"&limit=25',
            method: 'post',
        },
    }

    async componentDidMount() {
        let DataIdMusic = []
        this.MusicDefault()

        Axios(this.state.Config).then((response) => {
            console.log(response.data)
            this.setState({ 
                ResultData: response.data,
            })

            for ( let i = 0; i < response.data.results.length; i++ ) {
                DataIdMusic[i] = response.data.results[i].collectionId
            }

            setTimeout(() => {
                this.setState({
                    ListMusic: DataIdMusic
                })
            }, 25)
        }).catch((error) => {
            console.log(error)
        })
    }

    componentDidUpdate = (prevProps, prevState) => {
        console.log(this.state.ListMusic)
        if ( prevState.SearchValue !== this.state.SearchValue ) {
            this.setState({
                ...this.state,
                Config: {
                    ...this.state.Config,
                    url: 'https://itunes.apple.com/search?term='+ this.state.SearchValue +'&limit=' + this.state.LimitMusic,
                }
            })
            setTimeout(() => {
                Axios(this.state.Config).then((response) => {
                    console.log(response.data)
                    this.setState({ 
                        ...this.state,
                        ResultData: response.data,
                    })
                }).catch((error) => {
                    console.log(error)
                })
            }, 25)
        }
    }

    SearchValue = () => {
        let SearchData = document.getElementById('search-bar').value
        this.setState({ SearchValue: SearchData })
    }

    TrackClick = (track) => {
        track.preventDefault()
        let dataId = track.currentTarget.getAttribute('iddata')
        let setting = {
            url: 'https://itunes.apple.com/lookup?id=' + dataId,
            method: 'post',
        }

        // Lookup Detail Songs
        setTimeout(()=>{
            Axios(setting).then((response) => {
                this.setState({
                    DetailData: response.data.results[0],
                })
            }).catch((err) => {
                console.log(err)
            })
        },10)

        setTimeout(() => {
            this.StopSong()
            this.setState({
                MusicPlayer: true
            })
            setTimeout(() => {
                this.PlaySong()
            }, 25)
        },1000)
    }

    MusicDefault = () => {
        
    }

    PlaySong = (PlayFast = null) => {
        let Range = document.querySelector('#music-duration')
        // Get Auto Change And Auto Play Music When Clicked On Songs List
        if ( PlayFast === 'clicked' ) {
            // If Audio On Play
            if ( this.state.IsPLaying ) {
                this.StopSong()
                console.log('Played A Song : ', this.state.IsPLaying)
                console.log(this.state.DetailData.previewUrl)
                console.log(this.state.Song)
                setTimeout(()=>{
                    // Define New Songs
                    this.state.Song.src = this.state.DetailData.previewUrl
                    setTimeout(()=>{
                        this.state.Song.play()
                    }, 25)
                }, 15)
            } else {
                this.setState({ IsPLaying: true })
                console.log('Not Played : ', this.state.IsPLaying)
            }
        // When By Button Play
        } else {
            console.log('not clicked')
            // Audio Will Play
            console.log('Played A Song : ', this.state.IsPLaying)
            console.log(this.state.DetailData.previewUrl)
            console.log(this.state.Song)
            setTimeout(()=>{
                // Define New Songs
                this.state.Song.src = this.state.DetailData.previewUrl
                setTimeout(()=>{
                    this.state.Song.play()
                }, 25)
            }, 15)
        }

        Range.addEventListener('change', () => {
            this.state.Song.currentTime = Range.value
        })

        this.state.Song.addEventListener('timeupdate', () => {
            Range.value = this.state.Song.currentTime
        })
    }

    StopSong = () => {
        this.state.Song.pause()
        this.state.Song.currentTime = 0
        this.state.Song.removeAttribute('src')
        // Checking Source Remove
        console.log(this.state.Song)
    }

    PauseButton = () => {
        let Range = document.querySelector('#music-duration')
        this.state.Song.pause()

        Range.addEventListener('change', () => {
            this.state.Song.currentTime = Range.value
        })

        this.state.Song.addEventListener('timeupdate', () => {
            Range.value = this.state.Song.currentTime
        })
    }

    PlayButton = () => {
        let Range = document.querySelector('#music-duration')
        if ( this.state.IsPLaying ) {
            this.StopSong()
            console.log('Played A Song : ', this.state.IsPLaying)
            console.log(this.state.DetailData.previewUrl)
            console.log(this.state.Song)
            setTimeout(()=>{
                // Define New Songs
                this.state.Song.src = this.state.DetailData.previewUrl
                setTimeout(()=>{
                    this.state.Song.play()
                }, 10)
            }, 5)
        } else {
            this.setState({ IsPLaying: true })
            console.log('Not Played : ', this.state.IsPLaying)
        }

        Range.addEventListener('change', () => {
            this.state.Song.currentTime = Range.value
        })

        this.state.Song.addEventListener('timeupdate', () => {
            Range.value = this.state.Song.currentTime
        })
    }

    render() {
        return(
            <section id="iTunes">
                <div className="main-content">
                    <div className="box-content search-box">
                        <div className="search-bar">
                            <input name="search-bar" id="search-bar" placeholder="search your music.." />
                            <button type="button" onClick={ this.SearchValue }>Search</button>
                        </div>
                    </div>
                    <div className="box-content list-music">
                        <div className="title-box">
                            <h4>List Of Music</h4>
                        </div>
                        <div className="wrapper-list">
                            {
                                this.state.ResultData !== null ?
                                    this.state.ResultData.results.map((Data, index) => {
                                        return(
                                            <ListMusic
                                                key={ index }
                                                index={ index }
                                                dataId={ Data.trackId }
                                                images={ Data.artworkUrl100 }
                                                titleSongs={ Data.trackName }
                                                artistName={ Data.artistName }
                                                album={ Data.collectionName }
                                                trackClick={ this.TrackClick }
                                            />
                                        )
                                    })
                                : <ListMusic />
                            }
                        </div>
                    </div>
                    <div className="box-content music-player">
                        <div className={ this.state.MusicPlayer ? 'wrapper-music-player active' : 'wrapper-music-player hide' }>
                            <div className="wrapper-box">
                                <div className="image-music">
                                    <div className="image" style={
                                        this.state.DetailData ? { backgroundImage: "url("+ this.state.DetailData.artworkUrl100 +")" }
                                        : { backgroundImage: "url()" }
                                    }></div>
                                </div>
                                <div className="box-player">
                                    <div className="description-music">
                                        <h4 className="title-player">{ this.state.DetailData ? this.state.DetailData.trackName : ''}</h4>
                                        <span className="artist-name">
                                            <p>Artist : </p>
                                            { this.state.DetailData ? this.state.DetailData.artistName : '' }
                                        </span>
                                    </div>
                                </div>
                            
                            </div>
                            <div className="player-music">
                                <div className="range-box">
                                    <input type="range" id="music-duration" defaultValue="0" min="0"/>
                                </div>
                                <div className="button-box">
                                    <button id="prev" className="prev">Prev</button>
                                    <button onClick={ this.PauseButton } id="pause" className="pause">Pause</button>
                                    <button onClick={ this.PlayButton } id="play" className="play">Play</button>
                                    <button id="next" className="next">Next</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default App
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
        LastIndexPlayer: 0,
        ListMusic: null,
        MusicPlayer: false,
        Duration: 0,
        CurrentTime: 0,
        IsPLaying: true,
        Song: new Audio(),
        Config: {
            url: 'https://itunes.apple.com/search?term=""&media=music&limit=25',
            method: 'post',
        },
    }

    async componentDidMount() {
        this.StopSong()
        let DataIdMusic = []

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
            }, 5)
        }).catch((error) => {
            console.log(error)
        })
    }

    componentDidUpdate = (prevProps, prevState) => {
        
        // Change Search Index
        if ( prevState.SearchValue !== this.state.SearchValue ) {
            this.setState({
                ...this.state,
                Config: {
                    ...this.state.Config,
                    url: 'https://itunes.apple.com/search?term='+ this.state.SearchValue +'&media=music&limit=' + this.state.LimitMusic,
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

        // Changed Icon When Index Player Has Change
        if ( prevState.IndexPlayer !== this.state.IndexPlayer ) {

            // When Play, Circle Got Hiding
            document.querySelector('#list-'+ this.state.IndexPlayer +' .button-play-circle').classList.add('hide')
            // After Circle Hiding, Wave Indexed Got Show
            document.querySelector('#list-'+ this.state.IndexPlayer +' .button-play-wave').classList.remove('hide')

            // Previous Index Icon Got Normal Again
            this.setState({ LastIndexPlayer: prevState.IndexPlayer })
            if ( prevState.IndexPlayer !== this.state.LastIndexPlayer ) {
                
                document.querySelector('#list-'+ prevState.IndexPlayer +' .button-play-circle').classList.remove('hide')
                document.querySelector('#list-'+ prevState.IndexPlayer +' .button-play-wave').classList.add('hide')
            }
        }
    }

    SearchValue = () => {
        let SearchData = document.getElementById('search-bar').value
        this.setState({ SearchValue: SearchData, MusicPlayer: false })
        this.StopSong()
    }

    OnEnterKey = (e) => {
        if ( e.key === 'Enter' ) {
            this.SearchValue()
        }
    }

    TrackClick = (track) => {
        track.preventDefault()
        let indexList = track.currentTarget.getAttribute('indexdata') // For Get Index List Music
        console.log(indexList)
        this.setState({
            DetailData: this.state.ResultData.results[indexList],
            MusicPlayer: true,
            IndexPlayer: indexList
        })

        setTimeout(() => { 
            this.state.Song.src = this.state.DetailData.previewUrl 
        }, 5)
        setTimeout(() => { this.PlaySong() }, 10)
    }

    PlaySong = () => {
        this.state.Song.play()
        let Range = document.querySelector('#music-duration')
        
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
        this.state.Song.removeAttribute('src') // Make Sure That Audio Player Has Deleted Songs Source
    }

    PauseButton = () => {
        this.state.Song.pause()
        document.querySelector('.box-music-list .button-play-wave').classList.add('hide')
        document.querySelector('.box-music-list .button-play-circle').classList.remove('hide')
    }

    PlayButton = () => {
        this.StopSong()
        setTimeout(() => { this.PlaySong() }, 25)
    }

    NextButton = () => {
        if ( this.state.IndexPlayer < this.state.LimitMusic ) {
            let indexData = Number(this.state.IndexPlayer) + 1
            if ( indexData < this.state.LimitMusic ) {
                this.setState({
                    DetailData: this.state.ResultData.results[indexData],
                    IndexPlayer: indexData
                })
    
                setTimeout(() => { 
                    this.state.Song.src = this.state.DetailData.previewUrl 
                }, 5)
                setTimeout(() => { this.PlaySong() }, 10)
            }
        }
    }

    PrevButton = () => {
        let indexData = Number(this.state.IndexPlayer - 1)
        if ( indexData >= 0 ) {
            this.setState({
                DetailData: this.state.ResultData.results[indexData],
                IndexPlayer: indexData
            })

            setTimeout(() => { 
                this.state.Song.src = this.state.DetailData.previewUrl 
            }, 5)
            setTimeout(() => { this.PlaySong() }, 10)
        }
    }

    CloseMediaPlayer = () => {
        this.StopSong()
        this.setState({
            MusicPlayer: false
        })
    }

    render() {
        return(
            <section id="iTunes">
                <div className="main-content">
                    <div className="box-content search-box">
                        <div className="search-bar">
                            <input onKeyDown={ this.OnEnterKey } name="search-bar" id="search-bar" placeholder="search your music.." />
                            {/* <button type="button" onClick={ this.SearchValue }>Search</button> */}
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
                                        // Displaying For Data Who Has A Preview Audio URL
                                        // if ( Data.hasOwnProperty('previewUrl')) {
                                            return(
                                                <ListMusic
                                                    key={ index }
                                                    index={ index }
                                                    dataId={ Data.collectionId }
                                                    images={ Data.artworkUrl100 }
                                                    titleSongs={ Data.trackName }
                                                    artistName={ Data.artistName }
                                                    album={ Data.collectionName }
                                                    trackClick={ this.TrackClick }
                                                />
                                            )
                                        // }
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
                                    <button onClick={ this.PrevButton } id="prev" className="prev">Prev</button>
                                    <button onClick={ this.PauseButton } id="pause" className="pause">Pause</button>
                                    <button onClick={ this.PlayButton } id="play" className="play">Play</button>
                                    <button onClick={ this.NextButton } id="next" className="next">Next</button>
                                </div>
                            </div>
                            <div className="close-button" onClick={ this.CloseMediaPlayer }>X</div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default App
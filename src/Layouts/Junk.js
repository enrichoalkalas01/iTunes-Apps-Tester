TrackClick = (track) => {
    track.preventDefault()
    let dataId = track.currentTarget.getAttribute('iddata') // For Get Lookup API
    let indexList = track.currentTarget.getAttribute('indexdata')
    let setting = {
        url: 'https://itunes.apple.com/lookup?id=' + dataId,
        method: 'post',
    }

    // Lookup Detail Songs ( For Except Missing Object Structure From The Data )
    Axios(setting).then((response) => {
        this.setState({ 
            DetailData: response.data.results[0], // Save Data To State
            MusicPlayer: true, // Open Media Player
        })
    }).catch((err) => {
        console.log(err)
    })

    setTimeout(() => { console.log(this.state.DetailData) }, 1000)
}

StopSong = () => {
    this.state.Song.pause()
    this.state.Song.currentTime = 0
    // this.state.Song.removeAttribute('src')
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

// Change Icon Play List
let WaveIndexIcon = document.querySelector('.list-number-' + this.state.IndexPlayer + ' .button-play-circle').classList.add('hide')
let PlayIndexIcon = document.querySelector('.list-number-' + this.state.IndexPlayer + ' .button-play-wave')
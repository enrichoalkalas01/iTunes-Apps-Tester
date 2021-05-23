import React from 'react'

const ListMusic = (props) => {
    // console.log(props)
    return(
        <div
            className={ "box-music-list list-number-" + props.index } 
            onClick={ props.trackClick }
            indexdata={ props.index }
            iddata={ props.dataId }
            id={ "list-" + props.index }
        >
            <div className="images-box">
                <div className="images" style={{ backgroundImage: "url(" + props.images + ")" }}></div>
            </div>
            <div className="desc-box">
                <h4 className="title">{ props.titleSongs }</h4>
                <span className="artist">{ props.artistName }</span>
                <span className="album">{ props.album }</span>
            </div>
            <div className="button-play-circle"><div className="triangle-button"></div></div>
            <div className="button-play-wave hide"><i className="fas fa-wave-square"></i></div>
        </div>
    )
}

export default ListMusic
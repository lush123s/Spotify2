let songs;
// let ar; Uselss Now
function convertSecondsToMinuteSeconds(seconds) {
    var minutes = Math.floor(seconds / 60);
    // console.log(minutes)
    var remainingSeconds = Math.floor(seconds % 60)
    var formattedMinutes = ("0" + minutes).slice(-2);
    var formattedSeconds = ("0" + remainingSeconds).slice(-2);
    return formattedMinutes + ":" + formattedSeconds;
}

async function getSongs(folder) {
    let data = await fetch(`http://127.0.0.1:5500/${folder}/`);
    console.log(folder)
    curentFolder = folder
    let response = await data.text();
    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');
    songs = [];
    for (let i = 0; i < as.length; i++) {
        let elem = as[i];
        if (elem.href.endsWith('mp3')) {
            songs.push(elem.href.split(`/${folder}/`)[1])
        }
    }
    let ul = document.querySelector('.songList').getElementsByTagName('ul')[0];
    ul.innerHTML = ''
    for (const song of songs) {
        ul.innerHTML = ul.innerHTML + `<li class='lis'> <i class="ri-music-2-fill"></i>
    <div class="info">
        <div>${song.replaceAll('%20', "")}</div>
        <div>Abubaker</div>
    </div>
    <div class="play">
        <i class="ri-play-line"></i>
    </div>
 </li>`;
    }
    let songList = document.querySelectorAll('.lis');
    songList.forEach(element => {
        element.addEventListener('click', function () {
            playMusic(element.querySelector('.info').firstElementChild.innerHTML)

        })
    });

   
    return songs;

}
function playMusic(track, pause = false) {
    selectedSong.src = `/${curentFolder}/` + track;
    console.log(track)
    //   let audio = new Audio('/songs/' + track);
    if (pause === false) {
        play.innerHTML = '<i class="ri-pause-line"></i>';
        selectedSong.play()
    }
    document.getElementById('songInfo').innerHTML = `<h3>${track}</h3>`;

}
async function DisplayAlbums() {
    let data = await fetch(`http://127.0.0.1:5500/songs/`);
    let response = await data.text();
    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');
    let array = Array.from(as)
    let cardCont = document.querySelector('.card-cont');
    // let folders = [];
    for (let index =0; index < array.length;index++) {
        let elem = array[index];
        // console.log(elem)
        if (elem.href.includes('/songs/')) {
            let folders = elem.href.split('/')[4];
            let data = await fetch(`http://127.0.0.1:5500/songs/${folders}/info.json`);
            let response = await data.json();
            cardCont.innerHTML = cardCont.innerHTML + ` <div data-folder="${folders}" class="card">
            <div class="play">
                <i class="ri-play-line"></i>
            </div>
            <img src="/songs/${folders}/cover.jpeg" alt="">
            <h3>${response.title}</h3>
            <p>${response.Discription}</p>
        </div>`
        }

    }
    let cards = document.querySelectorAll('.card');
    cards.forEach(function (e) {
        e.addEventListener('click', async function (item) {
            await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            // playMusic(songs[0],false)
            // console.log(songs)
            playMusic(songs[0])
        })
    })
}


let curentFolder;
let selectedSong = new Audio();
async function main() {
    await getSongs(`songs/cs`);
    //  console.log( await getSongs(`songs/cs`))
    playMusic(songs[0], true);
    

    DisplayAlbums()

    let play = document.getElementById('play');
    document.body.addEventListener('keydown',function(e){
        if(e.key === 'a'){
           if (selectedSong.paused) {
                selectedSong.play()
                play.innerHTML = '<i class="ri-pause-line"></i>'
            }
            else {
                selectedSong.pause()
                play.innerHTML = '<i class="ri-play-line"></i>'
            }
        }
    })
    play.addEventListener('click', function () {
        if (selectedSong.paused) {
            selectedSong.play()
            play.innerHTML = '<i class="ri-pause-line"></i>'
        }
        else {
            selectedSong.pause()
            play.innerHTML = '<i class="ri-play-line"></i>'
        }
    })
    selectedSong.addEventListener('timeupdate', function () {
        document.getElementById('duration').innerHTML = `${convertSecondsToMinuteSeconds(selectedSong.currentTime)}/${convertSecondsToMinuteSeconds(selectedSong.duration)}`
        document.querySelector('.circle').style.left = (selectedSong.currentTime / selectedSong.duration) * 100 + '%'
    })

    document.querySelector('.seekbar').addEventListener('click', function (e) {
        let percant = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector('.circle').style.left = percant + '%';
        selectedSong.currentTime = ((selectedSong.duration) * percant) / 100
    })

    let hamburger = document.getElementById('hamburger');
    hamburger.addEventListener('click', function () {
        let left = document.querySelector('.left');
        left.style.left = '0px'
    })
    let close = document.querySelector('#close');
    close.addEventListener('click', function () {
        let left = document.querySelector('.left');
        left.style.left = '-100%'
    })

    document.getElementById('back').addEventListener('click', function () {
        let index = songs.indexOf(selectedSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {

            playMusic(songs[index - 1])
        }
    })

    document.getElementById('forward').addEventListener('click', function () {
        let index = songs.indexOf(selectedSong.src.split("/").slice(-1)[0])
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1])
        }

    })
    let input = document.getElementById('input');
    input.addEventListener('change', function (e) {
        console.log(e.target.value);
        if (e.target.value == 0) {
            document.getElementById('h4').innerHTML = '<i class="ri-volume-mute-line"></i>'
        }
        else if (e.target.value < 50) {
            document.getElementById('h4').innerHTML = '<i class="ri-volume-down-line"></i>'
        }
        else {
            document.getElementById('h4').innerHTML = '<i class="ri-volume-up-line"></i>'
        }
        selectedSong.volume = Number(e.target.value) / 100
    })

   let = document.getElementById('h4');
   h4.addEventListener('click',function(e){
    if(e.target.className.includes('volume-up') || e.target.className.includes('volume-down')){

        document.getElementById('h4').innerHTML = '<i class="ri-volume-mute-line"></i>'
        selectedSong.volume = 0;
        input.value = 0;
    }
    })
}
main()


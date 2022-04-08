const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $("#audio");
const cd = $('.cd');
const playBtn = $(".btn-toggle-play")
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Việt Nam sẽ chiến thắng',
            singer: 'Nhiều ca sĩ',
            path: './music/song1.mp3',
            img: './img/img1.png'
        },
        {
            name: 'This Is It',
            singer: 'Oh The Larceny',
            path: './music/song2.mp3',
            img: './img/img2.png'
        },
        {
            name: 'Chìm sâu',
            singer: 'MCK, Trung Trần',
            path: './music/song3.mp3',
            img: './img/img3.png'
        },
        {
            name: 'Độ tộc 2',
            singer: 'Phúc Du, Pháo, Mixi',
            path: './music/song4.mp3',
            img: './img/img4.png'
        }
    ],
    render: function(){
        const htmls = this.songs.map((song,index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.img}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playList.innerHTML = htmls.join('');
    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    hendleEvents: function(){
        const cdWith = cd.offsetWidth;
        document.onscroll = function(){
            const scroll = document.documentElement.scrollTop;
            console.log(scroll);
            const newCdWith = cdWith - scroll;
            cd.style.width = newCdWith + 'px';
        }

        const cdThumbAnimation = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ],{
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimation.pause();

        playBtn.onclick = function(){
            if(app.isPlaying){
                audio.pause();
            }
            else{
                audio.play();
            }
        }
        audio.onplay = function(){
            app.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimation.play();
        }
        audio.onpause = function(){
            app.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimation.pause()
        }
        audio.onended = function() {
            nextBtn.click();
        },
        audio.ontimeupdate = function() {
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }
        progress.oninput = function(e){
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime;
        }
        nextBtn.onclick = function(){
            if (app.isRandom) {
                app.playRandomSong();
            } else {
                app.nextSong();
            }
            
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }
        prevBtn.onclick = function(){
            if (app.isRandom) {
                app.playRandomSong();
            } else {
                app.prevSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }
        randomBtn.onclick = function(e){
            app.isRandom = !app.isRandom;
            randomBtn.classList.toggle('active', app.isRandom);
        }
        repeatBtn.onclick = function() {
            app.isRepeat = !app.isRepeat;
            repeatBtn.classList.toggle('active', app.isRepeat);
        }
        audio.onended = function() {
            if(app.isRepeat){
                audio.play();
            }
            else{
                nextBtn.click();
            }
        }
        playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')){
                if(songNode){
                    app.currentIndex = Number(songNode.dataset.index);
                    app.loadCurrentSong();
                    audio.play();
                    app.render();
                }
                if(e.target.closest('.option')){
                    
                }
            }
        }
    },
    scrollToActiveSong: function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        },300)
    },
    loadCurrentSong: function(){

        heading.textContent = this.currentSong.name;
        cdThumb.style.background = `url('${this.currentSong.img}')`;
        cdThumb.style.backgroundSize = 'cover'
        audio.src = this.currentSong.path
    },
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong()
    },
    playRandomSong: function(){
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * (app.songs.length ));
        }while(this.currentIndex === newIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function(){
        this.defineProperties();
        this.hendleEvents();
        this.render();
        this.loadCurrentSong();
    }
}
app.start();
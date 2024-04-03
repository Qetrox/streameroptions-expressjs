const faders = document.querySelectorAll('.fade-in');
const sliders = document.querySelectorAll('.slide-in');

const appearOptions = {
    threshold: 0.5,
    rootMargin: "0px 0px -10px 0px"
};

const appearOnScroll = new IntersectionObserver(function (entries, appearOnScroll) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('appear');
            appearOnScroll.unobserve(entry.target);
        }
    })
}, appearOptions);

faders.forEach(fader => {
    appearOnScroll.observe(fader);
});

sliders.forEach(slider => {
    appearOnScroll.observe(slider);
});

const banner = document.getElementById('banner');
let bannerImageNumber = 0;
const bannerImages = ['/i/banner0.png', '/i/banner1.png', '/i/banner2.png'];
const bannerImagesMobile = ['/i/banner0_mobile.png', '/i/banner1_mobile.png', '/i/banner2_mobile.png'];

// Preload the images
bannerImages.forEach((image) => {
    const img = new Image();
    img.src = image;
});
bannerImagesMobile.forEach((image) => {
    const img = new Image();
    img.src = image;
});
if (window.innerWidth < 768) {
    banner.style.backgroundImage = `url('${bannerImagesMobile[bannerImageNumber]}')`;
} else {
    banner.style.backgroundImage = `url('${bannerImages[bannerImageNumber]}')`;
}
/*setInterval(function() {
    bannerImageNumber++;
    if (bannerImageNumber >= bannerImages.length) {
        bannerImageNumber = 0;
    }
    if(window.innerWidth < 768) {
        banner.style.backgroundImage = `url('${bannerImagesMobile[bannerImageNumber]}')`;
    } else {
        banner.style.backgroundImage = `url('${bannerImages[bannerImageNumber]}')`;
    }
}, 5000);*/

const streamerList = document.querySelector('.streamer-list');

const orgIndex = streamerList.children.length;

const first_streamer_clone = streamerList.children[0].cloneNode(true);
const second_streamer_clone = streamerList.children[1].cloneNode(true);
const last_streamer_clone = streamerList.children[streamerList.children.length - 1].cloneNode(true);

let currentStreamer = 0;
let currentDupeStreamer = 0


// Duplicate the streamer list until it reaches 20
while (streamerList.children.length < 20 + orgIndex) {
    const clone = streamerList.children[currentDupeStreamer].cloneNode(true);
    streamerList.appendChild(clone);
    currentDupeStreamer++;
}

setTimeout(() => {
    if (window.innerWidth < 768) {
        shoveWidth = 25;
    } else {
        shoveWidth = 5
    }

    streamerList.style.transition = '3s linear';
    currentStreamer++;
    streamerList.style.transform = `translateX(-${currentStreamer * shoveWidth}vw)`;
}, 100);

setInterval(function () {
    if (window.innerWidth < 768) {
        shoveWidth = 25;
    } else {
        shoveWidth = 5
    }

    streamerList.style.transition = '3s linear';
    currentStreamer++;
    streamerList.style.transform = `translateX(-${currentStreamer * shoveWidth}vw)`;
    if (currentStreamer == orgIndex) {
        currentStreamer = 0;
        setTimeout(() => {
            streamerList.style.transition = '0s';
            streamerList.style.transform = `translateX(-${currentStreamer * shoveWidth}vw)`;
        }, 2980);
    }
}, 3000);
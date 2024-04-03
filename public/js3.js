const livenowlist = document.getElementById('livenowlist');
const sponsoredlist = document.getElementById('sponsoredlist');

fetch('https://streameroptions.com/api/v1/web/streamers/sponsored')
    .then(response => response.json())
    .then(data => {

        if (data.length === 0) {
            document.getElementById('sponsoredtitle').style.display = 'none';

            var z = document.getElementById('livenowtitle').children[0];
            document.getElementById('livenowtitle').appendChild(z);
            return;
        }


        for (let i = 0; i < data.length; i++) {

            let element = data[i];

            let a = document.createElement('a');
            let strmbt = document.createElement('div');
            let strmpdv = document.createElement('div');
            let strmttl = document.createElement('h3');
            let strmimg = document.createElement('img');

            a.href = `/${element.username}`;
            a.style.backgroundImage = `url('https://static-cdn.jtvnw.net/previews-ttv/live_user_${element.username}-1920x1080.jpg')`;
            a.className = 'streamer';
            strmbt.className = 'streamer-bottom';
            strmpdv.className = 'streamer-pfp';
            strmttl.innerText = element.displayname;
            strmttl.className = 'streamer-title';
            strmimg.src = element.profileImage;
            strmimg.alt = element.displayname;

            strmpdv.appendChild(strmimg);
            strmbt.appendChild(strmpdv);
            strmbt.appendChild(strmttl);
            a.appendChild(strmbt);
            sponsoredlist.appendChild(a);

        }
    })
    .catch(error => {
        document.getElementById('sponsoredtitle').style.display = 'none';

        var z = document.getElementById('livenowtitle').children[0];
        document.getElementById('livenowtitle').appendChild(z);

    });

fetch('https://streameroptions.com/api/v1/web/streamers')
    .then(response => response.json())
    .then(data => {

        for (let i = 0; i < data.length; i++) {

            let element = data[i];

            let a = document.createElement('a');
            let strmbt = document.createElement('div');
            let strmpdv = document.createElement('div');
            let strmttl = document.createElement('h3');
            let strmimg = document.createElement('img');

            a.href = `/${element.username}`;
            a.style.backgroundImage = `url('https://static-cdn.jtvnw.net/previews-ttv/live_user_${element.username}-1920x1080.jpg')`;
            a.className = 'streamer';
            strmbt.className = 'streamer-bottom';
            strmpdv.className = 'streamer-pfp';
            strmttl.innerText = element.displayname;
            strmttl.className = 'streamer-title';
            strmimg.src = element.profileImage;
            strmimg.alt = element.displayname;

            strmpdv.appendChild(strmimg);
            strmbt.appendChild(strmpdv);
            strmbt.appendChild(strmttl);
            a.appendChild(strmbt);
            livenowlist.appendChild(a);

        }
    })
    .catch(error => {
        console.log(error);
    });
const livenowlist = document.getElementById('livenowlist');
const previouswatchedlist = document.getElementById('previouswatchedlist');
const mostpointslist = document.getElementById('mostpointslist');


fetch('http://localhost:8080/api/v1/web/streamers/watched/live')
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

fetch('http://localhost:8080/api/v1/web/streamers/watched')
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
            previouswatchedlist.appendChild(a);

        }
    })
    .catch(error => {
        console.log(error);
    });

fetch('http://localhost:8080/api/v1/web/streamers/watched/top')
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
            mostpointslist.appendChild(a);

        }
    })
    .catch(error => {
        console.log(error);
    });
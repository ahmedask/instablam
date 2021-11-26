import React, { useRef, useEffect, useState } from 'react'
import styles from './Camera.module.css'
import { v4 as uuidv4 } from 'uuid';


function Camera() {
    const videoRef = useRef(null);
    const photoRef = useRef(null);

    const [hasPhoto, setHasPhoto] = useState(false);
    const [imgDate, setImgDate] = useState('');
    const [imgLocation, setImgLocation] = useState('');
    const [errorMsg, setErrorMsg] = useState();

    async function success(position){
        let key = '6cd115db79msh898efe441f2f9f2p1e35d3jsn0133b8085fae';
        await fetch(`https://geocodeapi.p.rapidapi.com/GetNearestCities?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&range=0`, {
            method: "GET",
            headers: {
                "x-rapidapi-host": "geocodeapi.p.rapidapi.com",
                "x-rapidapi-key": key
            }
        })
        .then(response => response.json())
        .then(data => {
            setImgLocation(`${data[0].City}, ${data[0].Country}`);
        })
        .catch(err => {
            console.error(err);
        });
    }

    function errorHandler(position){
        setErrorMsg(position.message);
    }

    const getLocationAPI = () => {
        navigator.geolocation.getCurrentPosition(success, errorHandler)
        
        let initDate = new Date()
        let date = `${initDate.getFullYear()}-${initDate.getMonth()}-${initDate.getDate()}`;
        setImgDate(date);
    }


    const getVideo = () => {
        navigator.mediaDevices.getUserMedia({
            width: 1920,
            height: 1080,
            video: true
        })
        .then(stream => {
            let video = videoRef.current;
            video.srcObject = stream;
            video.play();
        })
        .catch(error => {
            console.log(error);
        })
    }

    let staticData = [{
        img: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8bmF0dXJlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
        ImageDate: imgDate,
        locationImage: 'Forest',
        id: uuidv4()
    },
    {
        img: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mjh8fG5hdHVyZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
        ImageDate: imgDate,
        locationImage: 'Path',
        id: uuidv4()
    }
]

    const takePhoto = () => {
        const width = 414;
        const height = width/ (16/9);

        let video = videoRef.current;
        let photo = photoRef.current;

        photo.width = width;
        photo.height = height;

        let ctx = photo.getContext('2d');
        ctx.drawImage(video, 0, 0, width, height);
        setHasPhoto(true);

        let a = JSON.parse(localStorage.getItem('photos')) || [];
        a.push({img: photo.toDataURL(), imgDate: imgDate, locationImage: imgLocation ? imgLocation: errorMsg, id: uuidv4()});
        localStorage.setItem('photos', JSON.stringify(a));
    }

    let b = JSON.parse(localStorage.getItem('photos')); 

    let c;
    if(b !== null){
        c = b.map(el => {
            return (
                <div key={uuidv4()}>
                    <img onClick={id => deleteImg(el.id)} src={el.img} alt="images"/>
                    <a href={el.img} download>download</a>
                    <h2 >{el.imgDate}</h2>
                    <h2>{el.locationImage}</h2>
                </div>
            )
        })
    }

    useEffect(() => {
        getVideo();
        getLocationAPI();
    }, [videoRef])

    // Radera bild funktion
    function deleteImg(elId){
        let itemsStorage = JSON.parse(localStorage.getItem('photos'));
        let newItems = itemsStorage.filter(item => item.id !== elId)
        localStorage.setItem('photos', JSON.stringify(newItems))
    }

    return (
        <div className={styles.container}>
            <h1>InstaBlam</h1>
            <video ref={videoRef} className={styles.videoBox}></video>
            <button onClick={() => takePhoto()} className={styles.btnCapture}>CAPTURE!</button>

            <div className={'photo' + (hasPhoto) ? 'hasPhoto' : '', styles.result}>
                <canvas ref={photoRef}></canvas>
            </div>
            <div className={styles.imgWrapper}>
            {staticData.map(staticEl =>
                <div key={uuidv4()}>
                    <img className={styles.imgSize} src={staticEl.img} alt="nature"/>
                    <h2 >{staticEl.ImageDate}</h2>
                    <h2>{staticEl.locationImage}</h2>
                </div>
            )}
            {c}
            </div>
        </div>
    )
}

export default Camera
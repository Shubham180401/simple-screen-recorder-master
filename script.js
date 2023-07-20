const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const videoElement = document.getElementById('video-element');
const downloadButton = document.getElementById('download-button');
let mediaRecorder;
let recordedChunks = [];

startButton.addEventListener('click', () => {
    navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = e => {
                recordedChunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const recordedBlob = new Blob(recordedChunks, { type: 'video/mp4' });
                videoElement.src = URL.createObjectURL(recordedBlob);
                recordedChunks = [];
                downloadButton.disabled = false;
                startButton.disabled = false;

            };

            mediaRecorder.start();
            startButton.disabled = true;
            stopButton.disabled = false;
            downloadButton.disabled = true;
        })
        .catch(err => console.error('Error: ' + err));
});

stopButton.addEventListener('click', () => {
    mediaRecorder.stop();
    startButton.disabled = false;
    stopButton.disabled = true;
});

downloadButton.addEventListener('click', () => {
    const url = videoElement.src;
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recorded-video.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});
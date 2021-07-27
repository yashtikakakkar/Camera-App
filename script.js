let videoPlayer = document.querySelector("video");
let recordBtn = document.querySelector("#record");
let captureBtn = document.querySelector("#capture");
let body = document.querySelector("body");

let mediaRecorder;
let chunks = [];
let isRecording = false;

recordBtn.addEventListener("click", function () {
  let innerSpan = recordBtn.querySelector("span");

  if (isRecording) {
    mediaRecorder.stop();
    isRecording = false;
    innerSpan.classList.add("stop-record-animation");
    innerSpan.classList.remove("start-record-animation");
  } else {
    mediaRecorder.start();
    isRecording = true;
    innerSpan.classList.add("start-record-animation");
    innerSpan.classList.remove("stop-record-animation");
  }
});

// navigator, mediaDevices, getUSerMedia are all Browser's inbuilt functions/objects
// BOM -> Browser Object Module

// getUserMedia will ask for permission from the user to access video & audio
let promiseToUseCamera = navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true,
});
//if separate permissions for audio and video, make separate promises

promiseToUseCamera
  .then(function (mediaStream) {
    // when promise resolves
    // console.log("permission to access has been given by the user");

    // srcObject should contain the path/content of the video
    // mediaStream is an object that has the actual video and audio that is being captured
    videoPlayer.srcObject = mediaStream;

    mediaRecorder = new MediaRecorder(mediaStream);

    mediaRecorder.addEventListener("dataavailable", function (e) {
      chunks.push(e.data);
      console.log(e.data);
    });

    mediaRecorder.addEventListener("stop", function (e) {
      let blob = new Blob(chunks, { type: "video/mp4" });
      chunks = [];

      let link = URL.createObjectURL(blob);

      let a = document.createElement("a");
      a.href = link;
      a.download = "video.mp4";
      a.click();
      a.remove();
    });
  })
  .catch(function () {
    // when promise rejects
    console.log("permission to access has been denied by the user");
  });

captureBtn.addEventListener("click", function (e) {
  let innerSpan = captureBtn.querySelector("span");

  innerSpan.classList.add("capture-animation");
  setTimeout(function () {
    innerSpan.classList.remove("capture-animation");
  }, 1000);

  let canvas = document.createElement("canvas");
  canvas.height = videoPlayer.videoHeight;
  canvas.width = videoPlayer.videoWidth;

  let tool = canvas.getContext("2d");
  tool.drawImage(videoPlayer, 0, 0);

  //   body.append(canvas);

  let link = canvas.toDataURL();

  let a = document.createElement("a");
  a.href = link;
  a.download = "image.png";
  a.click();
  a.remove();
});

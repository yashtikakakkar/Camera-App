let videoPlayer = document.querySelector("video");
let recordBtn = document.querySelector("#record");
let captureBtn = document.querySelector("#capture");
let body = document.querySelector("body");

let mediaRecorder;
let chunks = [];
let isRecording = false;
let filter = "";
let currZoom = 1; // min = 1 && max = 3

let zoomIn = document.querySelector(".in");
let zoomOut = document.querySelector(".out");
let galleryBtn = document.querySelector("#gallery");

galleryBtn.addEventListener("click", function () {
  location.assign("gallery.html");
});

zoomIn.addEventListener("click", function () {
  currZoom = currZoom + 0.1;
  if (currZoom > 3) currZoom = 3;

  console.log(currZoom);
  videoPlayer.style.transform = `scale(${currZoom})`;
});

zoomOut.addEventListener("click", function () {
  currZoom = currZoom - 0.1;
  if (currZoom < 1) currZoom = 1;

  console.log(currZoom);
  videoPlayer.style.transform = `scale(${currZoom})`;
});

let allFilters = document.querySelectorAll(".filter");

for (let i = 0; i < allFilters.length; i++) {
  allFilters[i].addEventListener("click", function (e) {
    let previousFilter = document.querySelector(".filter-div");

    if (previousFilter) previousFilter.remove();

    let color = e.currentTarget.style.backgroundColor;
    filter = color;
    let div = document.createElement("div");
    div.classList.add("filter-div");
    div.style.backgroundColor = color;
    body.append(div);
  });
}

recordBtn.addEventListener("click", function () {
  let innerSpan = recordBtn.querySelector("span");

  let previousFilter = document.querySelector(".filter-div");

  if (previousFilter) previousFilter.remove();

  filter = "";

  if (isRecording) {
    mediaRecorder.stop();
    isRecording = false;
    innerSpan.classList.add("stop-record-animation");
    innerSpan.classList.remove("start-record-animation");
  } else {
    mediaRecorder.start();
    currZoom = 1;
    videoPlayer.style.transform = `scale(${currZoom})`;
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

      // let link = URL.createObjectURL(blob);

      // let a = document.createElement("a");
      // a.href = link;
      // a.download = "video.mp4";
      // a.click();
      // a.remove();

      saveMedia(blob);
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

  //top left to center
  tool.translate(canvas.width / 2, canvas.height / 2);
  //zoom
  tool.scale(currZoom, currZoom);
  //center to top left because that's where we start drawing, origin
  tool.translate(-canvas.width / 2, -canvas.height / 2);

  tool.drawImage(videoPlayer, 0, 0);

  //   body.append(canvas);

  if (filter != "") {
    tool.fillStyle = filter;
    tool.fillRect(0, 0, canvas.width, canvas.height);
  }

  let link = canvas.toDataURL();
  canvas.remove();

  // let a = document.createElement("a");
  // a.href = link;
  // a.download = "image.png";
  // a.click();
  // a.remove();

  saveMedia(link);
});

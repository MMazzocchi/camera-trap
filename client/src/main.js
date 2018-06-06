async function setupCamera(vid) {
  try {
    var stream = await navigator.mediaDevices.getUserMedia({ video: true });
    vid.src = window.URL.createObjectURL(stream);
    vid.play();

  } catch(e) {
    console.error("Could not open stream", e);
  }
};

var video = document.getElementById("preview");

if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  setupCamera(video);

} else {
  console.error("Media devices could not be accessed.");
}

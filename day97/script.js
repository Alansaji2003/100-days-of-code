
const video = document.getElementById("video");


Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
  faceapi.nets.ageGenderNet.loadFromUri("/models"),
  faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
]).then(webCam);

function webCam() {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false,
    })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((error) => {
      console.log(error);
    });
}


function getLabeledFaceDescriptions() {
  const labels = ["Alan", "DojaCat"];
  return Promise.all(
    labels.map(async (label) => {
      const descriptions = [];
      for (let i = 1; i <= 2; i++) {
        const img = await faceapi.fetchImage(`./labels/${label}/${i}.png`);
        const detections = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
        descriptions.push(detections.descriptor);
      }
      return new faceapi.LabeledFaceDescriptors(label, descriptions);
    })
  );
}


video.addEventListener("play", async () => {
  const labeledFaceDescriptors = await getLabeledFaceDescriptions();
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

  const canvas = faceapi.createCanvasFromMedia(video);
  document.getElementById('vedio-container').appendChild(canvas);

  faceapi.matchDimensions(canvas, { height: video.height, width: video.width });

  setInterval(async () => {
    const detection = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions().withAgeAndGender().withFaceDescriptors();
    
    const resizedWindow = faceapi.resizeResults(detection, {
      height: video.height,
      width: video.width,
    });

    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    // Draw face detection overlay
    faceapi.draw.drawDetections(canvas, resizedWindow);
    faceapi.draw.drawFaceLandmarks(canvas, resizedWindow);
    faceapi.draw.drawFaceExpressions(canvas, resizedWindow);

    // Draw labeled face
    const results = resizedWindow.map((d) => {
      return faceMatcher.findBestMatch(d.descriptor);
    });
    results.forEach((result, i) => {
      const box = resizedWindow[i].detection.box;

      // Positioning for the face detection label
      const drawBox = new faceapi.draw.DrawBox(box, {
        label: result,
      });
      drawBox.draw(canvas);

      // Positioning for the age/gender label
      const ageGenderLabel = Math.round(resizedWindow[i].age) + " year old " + resizedWindow[i].gender;
      const ageGenderX = box.x + 100; // Adjust x position
      const ageGenderY = box.y + box.height + 20; // Adjust y position
      canvas.getContext("2d").fillStyle = 'yellow';
      canvas.getContext("2d").font = '15px Arial';
      canvas.getContext("2d").fillText(ageGenderLabel, ageGenderX, ageGenderY);
    });

  }, 100);
});

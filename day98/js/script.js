// client
const socket = io('http://localhost:8000');
const form = document.getElementById('send-container');
const messageInput = document.getElementById('msg_inp');
const messageContainer = document.querySelector('.container');
const submitIcon = document.getElementById('submit-icon');
const imageInput = document.getElementById('image-input');
const imageIcon = document.getElementById('image-icon');
const audioIcon = document.getElementById('audio-icon');
var audio = new Audio('msg.mp3');

const append_ = (message, position, isImage = false, isAudio = false, data) => {
    console.log(`Appending message: ${message}, position: ${position}, isImage: ${isImage}, isAudio: ${isAudio}`);
    const messageElement = document.createElement('div');
    
    if (isImage) {
        const img = document.createElement('img');
        
        img.src = data;
        img.style.maxWidth = '200px';
        img.style.borderRadius = "50px";
        messageElement.innerText = message;
        
        messageElement.appendChild(img);
       
    } else if (isAudio) {
        const audioElem = document.createElement('audio');
        audioElem.controls = true;
        const source = document.createElement('source');
        source.src = data;
        source.type = 'audio/ogg';
        audioElem.appendChild(source);
        messageElement.innerText = message;
        messageElement.appendChild(audioElem);
    } else {
        messageElement.innerText = message;
    }
    
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    
    if (position == "left") {
        audio.play();
    }
};

// Submit message
submitIcon.addEventListener('click', (e) => {
    e.preventDefault();
    form.dispatchEvent(new Event('submit'));  // Manually trigger the form submission from icon for text msgs
});

// Handle text message submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    console.log(`Sending text message: ${message}`);
    append_(`You:  ${message}`, 'right');
    socket.emit('send', { type: 'text', data: message });
    messageInput.value = '';
});

// Handle new user joining
const Name = prompt("Enter your name to join");
socket.emit('new-user-joined', Name);

// Listen for events
socket.on('user-joined', name_ => {
    console.log(`${name_} joined the chat`);
    append_(`${name_} joined the chat`, 'notif');
});

socket.on('receive', data => {
    console.log(`Received message: ${data}`);
    if (data.type === 'text') {
        append_(`${data.name}: ${data.data}`, 'left');
    } else if (data.type === 'image') {
        append_(`${data.name}: `, 'left', true, false, data.data);
    } else if (data.type === 'audio') {
        append_(`${data.name}: `, 'left', false, true, data.data);
    }
});

socket.on('disconnected', name => {
    console.log(`${name} left the chat`);
    append_(`${name} left the chat`, 'notif');
});

// Image sending functionality
imageIcon.addEventListener('click', () => {
    console.log('image icon clicked');
    imageInput.click();
    
});

imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        const base64Image = reader.result;
        console.log(`Sending image: .........`);
        append_(`You: `, 'right', true, false, base64Image);
        socket.emit('send', { type: 'image', data: base64Image });
    };
    if (file) {
        reader.readAsDataURL(file);
    }
});

// Audio recording functionality
let mediaRecorder;
let audioChunks = [];

audioIcon.addEventListener('click', async () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        audioIcon.classList.remove('fa-circle');
        audioIcon.classList.add('fa-microphone');
        audioIcon.style.color = 'black'; 
        return;
    }

    if (!mediaRecorder) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/ogg; codecs=opus' });
            const reader = new FileReader();
            reader.onload = () => {
                const base64Audio = reader.result;
                console.log(`Sending audio:..............`);
                append_(`You: `, 'right', false, true, base64Audio);
                socket.emit('send', { type: 'audio', data: base64Audio });
                audioChunks = [];
            };
            reader.readAsDataURL(audioBlob);
        };
    }

    mediaRecorder.start();
    audioIcon.classList.remove('fa-microphone');
    audioIcon.classList.add('fa-circle');
    audioIcon.style.color = 'red'; 
});
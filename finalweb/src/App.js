import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import './App.css';
import './main.css';
import Derevo from './LemonTree.png';
function App() {
  const [peerId, setPeerId] = useState('');
  const [rPIdValue, sRPIdValue] = useState('');
  const rVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);

  useEffect(() => {
    const peer = new Peer();

    peer.on('open', (id) => {
      setPeerId(id)
    });

    peer.on('call', (call) => {
      const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      getUserMedia({video: true, audio: true}, (mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();
        call.answer(mediaStream)
        call.on('stream', function(remoteStream){
          rVideoRef.current.srcObject = remoteStream
          rVideoRef.current.play();
        });
      });
    })

    peerInstance.current = peer;
  }, [])
  const call = (rPId) => {
    const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    getUserMedia({video: true, audio: true}, (mediaStream) => {

      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();

      const call = peerInstance.current.call(rPId, mediaStream)

      call.on('stream', (remouteStream) => {
        rVideoRef.current.srcObject = remouteStream
        rVideoRef.current.play();
      });
    });
  }

  const headerr =(
    <div>
      <ul class="mb-0">

        <li class="li1" ><img class="image" src={Derevo} alt=""/></li>
        <li><a href="https://lemon-tree.herokuapp.com/">Main</a></li>
        
        </ul>
    </div>
  )
  return(
      <div className="App">
        {headerr}
        <h1>Current user id {peerId}</h1>
        <input type="text" value={rPIdValue} onChange={e => sRPIdValue(e.target.value)} />
        <button onClick={() => call(rPIdValue)}>Call</button>
        <div>
          <video ref={currentUserVideoRef}/>
        </div>
        <div>
          <video ref={rVideoRef}/>
        </div>
      </div>
  );
}

export default App;

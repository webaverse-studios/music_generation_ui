import axios from "axios";
import ReactAudioPlayer from "react-audio-player";

export default function MusicPlayer(props) {
  const download = async () => {
    const resp = await axios.get(props.filename, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([resp.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `output.mp3`);

    document.body.appendChild(link);

    link.click();

    link.parentNode.removeChild(link);
  };

  return (
    <div>
      <ReactAudioPlayer src={props.filename} autoPlay controls />
      <br />
      <br />
      <button onClick={download}>Download</button>
    </div>
  );
}

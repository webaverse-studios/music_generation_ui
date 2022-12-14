import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Slider from "react-input-slider";
import { makeHFRequest } from "./makeHFRequest";

export default function Mumbert(props) {
  const [email, setEmail] = useState("");
  const [license, setLicense] = useState("");
  const [token, setToken] = useState("");
  const [hfKey, setHfKey] = useState("");

  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState(30);
  const [loop, setLoop] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("email")) {
      setEmail(localStorage.getItem("email"));
    } else {
      setEmail("test@test.com");
    }

    if (localStorage.getItem("license")) {
      setLicense(localStorage.getItem("license"));
    } else {
      setLicense(
        "ttmmubertlicense#f0acYBenRcfeFpNT4wpYGaTQIyDI4mJGv5MfIhBFz97NXDwDNFHmMRsBSzmGsJwbTpP1A6i07AXcIeAHo5"
      );
    }

    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    } else {
      setToken("4951f6428e83172a4f39de05d5b3ab10d58560b8");
    }

    if (localStorage.getItem("hfKey")) {
      setHfKey(localStorage.getItem("hfKey"));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("email", email);
  }, [email]);
  useEffect(() => {
    localStorage.setItem("license", license);
  }, [license]);
  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);
  useEffect(() => {
    localStorage.setItem("hfKey", hfKey);
  }, [hfKey]);

  const getUserKey = async () => {
    if (!email || !license || !token) {
      return "";
    }

    const resp = await axios.post(
      "https://api-b2b.mubert.com/v2/GetServiceAccess",
      {
        method: "GetServiceAccess",
        params: {
          email: email,
          license: license,
          token: token,
          mode: "loop",
        },
      }
    );
    return resp.data.data.pat;
  };

  const send = async () => {
    if (!prompt || props.generating) {
      return;
    }

    props.setGenerating(true);

    try {
      const key = await getUserKey();
      const tags = await makeHFRequest(
        hfKey,
        "sentence-transformers/all-MiniLM-L6-v2",
        prompt,
        "tribal,action,kids,neo-classic,run 130,pumped,jazz / funk,ethnic,dubtechno,reggae,acid jazz,liquidfunk,funk,witch house,tech house,underground,artists,mystical,disco,sensorium,r&b,agender,psychedelic trance / psytrance,peaceful,run 140,piano,run 160,setting,meditation,christmas,ambient,horror,cinematic,electro house,idm,bass,minimal,underscore,drums,glitchy,beautiful,technology,tribal house,country pop,jazz & funk,documentary,space,classical,valentines,chillstep,experimental,trap,new jack swing,drama,post-rock,tense,corporate,neutral,happy,analog,funky,spiritual,sberzvuk special,chill hop,dramatic,catchy,holidays,fitness 90,optimistic,orchestra,acid techno,energizing,romantic,minimal house,breaks,hyper pop,warm up,dreamy,dark,urban,microfunk,dub,nu disco,vogue,keys,hardcore,aggressive,indie,electro funk,beauty,relaxing,trance,pop,hiphop,soft,acoustic,chillrave / ethno-house,deep techno,angry,dance,fun,dubstep,tropical,latin pop,heroic,world music,inspirational,uplifting,atmosphere,art,epic,advertising,chillout,scary,spooky,slow ballad,saxophone,summer,erotic,jazzy,energy 100,kara mar,xmas,atmospheric,indie pop,hip-hop,yoga,reggaeton,lounge,travel,running,folk,chillrave & ethno-house,detective,darkambient,chill,fantasy,minimal techno,special,night,tropical house,downtempo,lullaby,meditative,upbeat,glitch hop,fitness,neurofunk,sexual,indie rock,future pop,jazz,cyberpunk,melancholic,happy hardcore,family / kids,synths,electric guitar,comedy,psychedelic trance & psytrance,edm,psychedelic rock,calm,zen,bells,podcast,melodic house,ethnic percussion,nature,heavy,bassline,indie dance,techno,drumnbass,synth pop,vaporwave,sad,8-bit,chillgressive,deep,orchestral,futuristic,hardtechno,nostalgic,big room,sci-fi,tutorial,joyful,pads,minimal 170,drill,ethnic 108,amusing,sleepy ambient,psychill,italo disco,lofi,house,acoustic guitar,bassline house,rock,k-pop,synthwave,deep house,electronica,gabber,nightlife,sport & fitness,road trip,celebration,electro,disco house,electronic".split(
          ","
        )
      );
      const resp = await axios.post(
        "https://api-b2b.mubert.com/v2/RecordTrackTTM",
        {
          method: "RecordTrackTTM",
          params: {
            pat: key,
            duration: duration,
            tags: tags,
            mode: loop ? "loop" : "track",
          },
        }
      );
      console.log(resp.data);
      let count = 0;
      const interval = setInterval(async () => {
        try {
          const test = await axios.get(resp.data.data.tasks[0].download_link);
          if (test.status === 200) {
            props.setFilename(resp.data.data.tasks[0].download_link);
            clearInterval(interval);
            props.setGenerating(false);
          }
          count++;
          if (count > 20) {
            clearInterval(interval);
            props.setGenerating(false);
          }
        } catch (e) {}
      }, 1500);
    } catch (e) {
      console.log(e);
    }

    props.setGenerating(false);
    setPrompt("");
    setDuration(30);
    setLoop(false);
  };

  return (
    <div>
      {" "}
      <label>Hugging Face Key:</label>
      <input
        type="text"
        value={hfKey}
        onChange={(e) => {
          if (props.generating) {
            return;
          }
          setHfKey(e.target.value);
        }}
      ></input>
      <br />
      <br />
      <label>Email:</label>
      <input
        type="text"
        value={email}
        onChange={(e) => {
          if (props.generating) {
            return;
          }
          setEmail(e.target.value);
        }}
      ></input>
      <br />
      <br />
      <label>License:</label>
      <input
        type="text"
        value={license}
        onChange={(e) => {
          if (props.generating) {
            return;
          }
          setLicense(e.target.value);
        }}
      ></input>
      <br />
      <br />
      <label>Token:</label>
      <input
        type="text"
        value={token}
        onChange={(e) => {
          if (props.generating) {
            return;
          }
          setToken(e.target.value);
        }}
      ></input>
      <br />
      <br />
      <label>Prompt:</label>
      <input
        type="text"
        value={prompt}
        onChange={(e) => {
          if (props.generating) {
            return;
          }

          setPrompt(e.target.value);
        }}
      ></input>
      <br />
      <br />
      <label>Duration ({duration}):</label>
      <br />
      <Slider
        axis="x"
        xmin={5}
        xmax={360}
        x={duration}
        onChange={({ x }) => {
          if (props.generating) {
            return;
          }

          setDuration(x);
        }}
      />
      <br />
      <br />
      <label>Loop:</label>
      <input
        type="checkbox"
        checked={loop}
        onChange={(e) => {
          if (props.generating) {
            return;
          }
          setLoop(e.target.checked);
        }}
      ></input>
      <br />
      <br />
      <button disabled={props.generating} onClick={send}>
        {props.generating ? "Generating..." : "Generate"}
      </button>
    </div>
  );
}

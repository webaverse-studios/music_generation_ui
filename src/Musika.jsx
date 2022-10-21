import { useState } from "react";
import "./App.css";
import axios from "axios";
import Slider from "react-input-slider";
import {
  API_URL,
  API_URL_RESULT,
  DURATIONS,
  getIndexFromDuration,
} from "./constants";

export default function Musika(props) {
  const [duration, setDuration] = useState(DURATIONS[0]);
  const [styleVariation, setStyleVariation] = useState(2);

  const isJSON = (str) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

  const send = async () => {
    if (props.generating) {
      return;
    }

    props.setGenerating(true);
    try {
      const resp = await axios.get(API_URL, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        params: {
          duration:
            typeof duration === "string"
              ? getIndexFromDuration(duration)
              : duration,
          style_variation: styleVariation,
        },
      });
      const query_id = resp.data.id;
      let count = 0;
      const _interval = setInterval(async () => {
        try {
          const resp = await axios.get(API_URL_RESULT, {
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
            params: {
              query_id: query_id,
            },
            responseType: "arraybuffer",
          });

          const bytes = resp.data;
          const arrayBufferView = new Uint8Array(bytes);
          if (arrayBufferView.length > 21) {
            clearInterval(_interval);
            props.setGenerating(false);
            const blob = new Blob([arrayBufferView], { type: "audio/wav" });
            const url = URL.createObjectURL(blob);
            props.setFilename(url);
            props.setGenerating(false);
          } else {
            count++;
            if (count > 20) {
              clearInterval(_interval);
              props.setGenerating(false);
            }
          }
        } catch (e) {
          console.log(e);
          props.setGenerating(false);
        }
      }, 2500);
    } catch (e) {
      console.log(e);
      props.setGenerating(false);
    }
  };

  return (
    <div>
      <label>Duration</label>
      <select
        onChange={(e) => {
          if (props.generating) {
            return;
          }
          setDuration(e.target.value);
        }}
      >
        {DURATIONS.map((d, index) => (
          <option key={d}>{d}</option>
        ))}
      </select>
      <br />
      <br />
      <label>Style Variation ({styleVariation}):</label>
      <br />
      <Slider
        axis="x"
        xmin={0.1}
        xmax={3.9}
        xstep={0.1}
        x={styleVariation}
        onChange={({ x }) => {
          if (props.generating) {
            return;
          }

          setStyleVariation(x.toFixed(1));
        }}
      />
      <br />
      <br />
      <button disabled={props.generating} onClick={send}>
        {props.generating ? "Generating..." : "Generate"}
      </button>
    </div>
  );
}

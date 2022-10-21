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

  const send = async () => {
    if (props.generating) {
      return;
    }

    props.setGenerating(true);
    try {
      const resp = await axios.get(API_URL, {
        params: {
          duration:
            typeof duration === "string"
              ? getIndexFromDuration(duration)
              : duration,
          style_variation: styleVariation,
        },
      });
      const query_id = resp.data.id;
      const _interval = setInterval(async () => {
        try {
          const resp = await axios.get(API_URL_RESULT, {
            params: {
              query_id: query_id,
            },
            responseType: "blob",
          });

          if (resp.data.type === "application/json") {
            const text = await resp.data.text();
            const data = JSON.parse(text);
            if (data.status === "finished") {
              clearInterval(_interval);
              props.setGenerating(false);
            } else {
            }
          } else {
            clearInterval(_interval);
            const url = URL.createObjectURL(resp.data);
            props.setFilename(url);
            props.setGenerating(false);
          }
        } catch (e) {
          console.log(e);
          console.log("not finished");
        }
      }, 2500);
    } catch (e) {
      console.log(e);
    }

    props.setGenerating(false);
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

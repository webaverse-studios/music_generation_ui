import axios from "axios";

export async function makeHFRequest(hf_key, model, input, sentences) {
  const resp = await axios.post(
    `https://api-inference.huggingface.co/models/${model}`,
    {
      inputs: {
        source_sentence: input,
        sentences: sentences,
      },
    },
    {
      headers: { Authorization: `Bearer ${hf_key}` },
    }
  );
  const data = resp.data;
  const tags = [];
  for (let i = 0; i < 3; i++) {
    let highest = 0;
    let highestIndex = -1;
    for (let j = 0; j < data.length; j++) {
      if (data[j] > highest) {
        highest = j;
        highestIndex = j;
      }
    }
    if (highestIndex > -1) {
      tags.push(sentences[highestIndex]);
      delete sentences[highestIndex];
      delete data[highestIndex];
    }
  }
  return tags;
}

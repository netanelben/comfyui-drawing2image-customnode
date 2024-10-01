import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { MessageData } from "./types";
import workflow from "./workflows/workflow_api.json";

import "./App.css";
import { DrawingCanvas } from "./drawing-canvas";
import { PromptStyles } from "./prompt-styles";

const clientUniqueId = uuidv4();

function App() {
  const [promptText, setPrompt] = useState("");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [progress, setprogress] = useState({ value: 0, max: 0 });
  const [imageFileName, setImageFileName] = useState<string | null>(null);

  useEffect(() => {
    console.log("🧩 Loading workflow", workflow);

    const hostname = window.location.hostname + ":" + window.location.port;
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsClient = new WebSocket(
      `${protocol}//${hostname}/ws?clientId=${clientUniqueId}`
    );

    wsClient.onopen = () => {
      console.log("🛜 Connected to the server");
    };

    wsClient.addEventListener("message", (event) => {
      const data = JSON.parse(event.data) as MessageData;
      console.log("📡 Message from server", data);

      if (data.type === "progress") {
        trackProgress(data.data.value, data.data.max);
      }

      if (data.type === "executed") {
        if ("images" in data.data.output) {
          const image = data.data.output.images[0];
          const { filename, type, subfolder } = image;
          const rando = Math.floor(Math.random() * 1000);
          const imageSrc = `/view?filename=${filename}&type=${type}&subfolder=${subfolder}&rand=${rando}`;

          setImageSrc(imageSrc);
        }
      }
    });
  }, []);

  const trackProgress = (value: number, max: number) => {
    console.log(`🚦 Generate progress ${value}/${max}`);
    setprogress({ value, max });
  };

  const handleTextChange = (e: any) => {
    const text = e.target.value;
    setPrompt(text);
  };

  const handleGenerate = async (e: any) => {
    if (!promptText) return;
    if (typeof workflow === "undefined") return;

    // Find the key of prompt node
    const inputNodeNumber = Object.entries(workflow).find(
      ([key, value]) => value["_meta"].title === "CLIP Text Encode (Positive)"
    )[0] as keyof typeof workflow;

    // Find the key of KSampler node
    const samplerNodeNumber = Object.entries(workflow).find(
      ([key, value]) => value.class_type === "SamplerCustom"
    )[0] as keyof typeof workflow;

    // Find the key of Image Input node
    const imageInputNodeNumber = Object.entries(workflow).find(
      ([key, value]) => value.class_type === "LoadImage"
    )[0] as keyof typeof workflow;

    workflow[inputNodeNumber].inputs.text = promptText.replaceAll(
      /\r\n|\n|\r/gm,
      " "
    );

    workflow[samplerNodeNumber].inputs.noise_seed = Math.floor(
      Math.random() * 9999999999
    );

    workflow[imageInputNodeNumber].inputs.image = imageFileName;

    const results = await queuePrompt(workflow);
    console.log({ results });
  };

  async function queuePrompt(workflow = {}) {
    const data = { prompt: workflow, client_id: clientUniqueId };

    const response = await fetch("/prompt", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  }

  async function interruptPrompt() {
    const response = await fetch("/interrupt", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "text/html",
      },
    });

    console.log("❌ Interrupting prompt", response);
  }

  const uploadFile = (dataURL: any) => {
    setImageFileName("captured-image.png");

    const blob = dataURLToBlob(dataURL);
    const formData = new FormData();

    formData.append("image", blob, "captured-image.png");
    formData.append("overwrite", "true");
    formData.append("type", "input");

    fetch("/upload/image", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("📤 File uploaded", data);
      })
      .catch((error) => {
        console.error("🚨 Error:", error);
      });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt="logo"
          style={{
            width: "640px",
            height: "480px",
            objectFit: "contain",
          }}
        />
      ) : (
        <div
          style={{
            display: "flex",
            gap: "1rem",
            width: "640px",
            height: "480px",
            backgroundColor: "black",
          }}
        />
      )}
      <div
        style={{
          width: 640,
          height: 480,
          backgroundColor: "darkgray",
          position: "relative",
        }}
      >
        <DrawingCanvas
          uploadFile={uploadFile}
          handleGenerate={handleGenerate}
        />
      </div>
      <textarea
        placeholder="Prompt"
        onChange={handleTextChange}
        style={{
          height: 80,
          padding: 10,
        }}
      />
      <PromptStyles setPrompt={setPrompt} />
      <div
        style={{
          display: "flex",
          gap: "1rem",
        }}
      >
        <button onClick={handleGenerate} style={{ flex: 1 }}>
          Generate
          {progress.value > 0 && ` (${progress.value}/${progress.max})`}
        </button>
        <button onClick={interruptPrompt}>❌</button>
      </div>
    </div>
  );
}

export default App;

const dataURLToBlob = (dataURL: string) => {
  const byteString = atob(dataURL.split(",")[1]);
  const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};

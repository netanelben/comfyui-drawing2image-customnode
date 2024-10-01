import { useState } from "react";

const DaliPrompt = `A surreal dreamscape with melting clocks draped over barren trees, an endless desert with floating geometric shapes, a long shadow cast by an oversized distorted figure, and an ominous sky swirling with strange colors. The scene has a sense of both timelessness and distorted reality, capturing an otherworldly and illogical atmosphere in the classic surrealist style of Salvador Dalí.`;

const VanGoghPrompt = `A vibrant starry night over a small village, with swirling, dynamic blue and yellow brushstrokes filling the sky. The scene features a tall cypress tree in the foreground and rolling hills in the background, all painted in thick, expressive strokes. The village is bathed in a warm, golden glow from the windows of the small houses, conveying a sense of calm amidst the dramatic and swirling celestial movement above.`;

const UVPrompt = `An intricate UV light psychedelic decoration featuring vibrant neon colors and swirling abstract patterns. The design includes fractal shapes, mandalas, and floral motifs that glow intensely under black light. The colors range from electric blue to vivid pink, lime green, and bright orange, with a hypnotic depth that evokes a sense of otherworldly movement and energy, creating a mesmerizing, trippy visual experience.`;

export const PromptStyles = ({ setPrompt }) => {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  const handleStyleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedStyle(event.target.value);

    switch (event.target.value) {
      case "Dali":
        setPrompt(DaliPrompt);
        break;
      case "Van Gogh":
        setPrompt(VanGoghPrompt);
        break;
      case "UVPrompt":
        setPrompt(UVPrompt);
        break;
      default:
        setPrompt("");
        break;
    }
  };

  return (
    <div>
      Style: &nbsp;
      <label>
        <input
          type="radio"
          value="Dali"
          checked={selectedStyle === "Dali"}
          onChange={handleStyleChange}
        />
        Dali
      </label>
      <label>
        <input
          type="radio"
          value="Van Gogh"
          checked={selectedStyle === "Van Gogh"}
          onChange={handleStyleChange}
        />
        Van Gogh
      </label>
      <label>
        <input
          type="radio"
          value="UVPrompt"
          checked={selectedStyle === "UVPrompt"}
          onChange={handleStyleChange}
        />
        UV Light
      </label>
    </div>
  );
};

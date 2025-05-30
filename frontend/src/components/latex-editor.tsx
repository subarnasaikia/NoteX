import { useEffect, useState } from "react";
import { Textarea } from "./ui/textarea";
import "katex/dist/katex.min.css";
import { BlockMath, } from "react-katex";

export function LatexEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [previewValue, setPreviewValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPreviewValue(value);
    }, 500); // Debounce preview update

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <div className="flex flex-row h-full gap-4">
      {/* Left: Textarea */}
      <div className="w-1/2">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write LaTeX here..."
          className="text-base h-full"
        />
      </div>

      {/* Right: Preview */}
      <div className="w-1/2 overflow-auto p-4 bg-white rounded-md border h-full">
        <BlockMath math={previewValue} errorColor="#cc0000" />
      </div>
    </div>
  );
}


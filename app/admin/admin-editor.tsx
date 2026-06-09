"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { createData } from "./actions";

export default function AdminEditor() {
  const [markdown, setMarkdown] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<{ type: "succ" | "err" | "idle"; msg: string }>({
    type: "idle",
    msg: "",
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ type: "idle", msg: "" });

    const formData = new FormData();
    formData.append("identifier", identifier);
    formData.append("name", name);
    formData.append("content", markdown);

    const result = await createData(formData);

    if (result.error) {
      setStatus({ type: "err", msg: result.error });
      return;
    }

    setStatus({ type: "succ", msg: "Saved successfully." });
    setIdentifier("");
    setName("");
    setMarkdown("");
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 flex-1">
      <div className="flex-1 bg-gray-100 p-6 rounded-3xl flex flex-col">
        <h2 className="text-xl font-bold mb-4">Create / Edit Content</h2>
        {status.type !== "idle" ? (
          <div className={`p-4 mb-4 rounded-xl text-white ${status.type === "succ" ? "bg-black" : "bg-orange"}`}>
            {status.msg}
          </div>
        ) : null}
        <form className="flex flex-col gap-4 flex-1" onSubmit={handleSubmit}>
          <div className="flex gap-4 flex-col md:flex-row">
            <input
              type="text"
              placeholder="Unique Identifier (required)"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="p-4 rounded-xl bg-white text-black placeholder-gray-500 flex-1"
              required
            />
            <input
              type="text"
              placeholder="Display Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-4 rounded-xl bg-white text-black placeholder-gray-500 flex-1"
            />
          </div>

          <textarea
            placeholder="Write Markdown here..."
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="min-h-[320px] p-4 rounded-xl bg-white text-black placeholder-gray-500 flex-1 resize-y font-mono"
            required
          />

          <button
            type="submit"
            className="bg-orange text-white font-bold p-4 rounded-xl hover:bg-orange/80 transition-colors mt-2"
          >
            Post Content
          </button>
        </form>
      </div>

      <div className="flex-1 bg-gray-100 p-6 rounded-3xl flex flex-col">
        <h2 className="text-xl font-bold mb-4 text-orange">Preview</h2>
        <div className="flex-1 bg-white rounded-xl p-6 overflow-y-auto min-h-[420px]">
          {markdown.trim() ? (
            <article className="prose max-w-none text-black prose-headings:text-black prose-a:text-orange hover:prose-a:text-orange/80 prose-img:rounded-2xl prose-code:bg-gray-200 prose-code:px-1 prose-code:rounded">
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </article>
          ) : (
            <p className="text-gray-400 italic">Preview will appear here...</p>
          )}
        </div>
      </div>
    </div>
  );
}
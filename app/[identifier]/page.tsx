import dbConnect from "@/lib/dbConnect";
import DataModel from "@/lib/models/Data";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import CopyButton from "./copy-button";

export default async function DataPage({ params }: { params: Promise<{ identifier: string }> }) {
  const { identifier } = await params;
  const decodedIdentifier = decodeURIComponent(identifier);

  await dbConnect();

  let dataOrName = await DataModel.findOne({
    $or: [{ identifier: decodedIdentifier }, { name: decodedIdentifier }]
  }).lean();

  if (!dataOrName) {
    const allData = await DataModel.find().lean();
    const match = allData.find(
      (d) =>
        d.identifier.toLowerCase() === decodedIdentifier.toLowerCase() ||
        d.name?.toLowerCase() === decodedIdentifier.toLowerCase()
    );

    if (!match) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-white">
          <div className="bg-gray-100 p-8 rounded-3xl max-w-2xl w-full text-center">
            <h1 className="text-3xl font-bold mb-6 text-neutral-800">Data not found</h1>
            <p className="text-lg text-gray-700 mb-6">We could not find any content for "{decodedIdentifier}".</p>
            <Link 
              href="/"
              className="inline-block bg-orange text-white font-bold py-3 px-6 rounded-xl hover:bg-orange/80 transition-colors"
            >
              Go Back
            </Link>
          </div>
        </div>
      );
    }
    dataOrName = match;
  }

  const content = (dataOrName as any).content || "No content available.";

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-white text-neutral-800">
      <div className="bg-gray-100 p-8 rounded-3xl max-w-4xl w-full">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start mb-8">
            <div>
              <p className="text-sm md:text-xl  tracking-wide text-gray-500 mb-2">Document view</p>
              <h1 className="text-xl font-bold text-neutral-800">Result for: {(dataOrName as any).name || (dataOrName as any).identifier}</h1>
            </div>
            <div className="flex flex-wrap mb-6 gap-3">
              <CopyButton text={content} />
              <Link 
                href="/"
                className="bg-neutral-800 text-white font-medium py-2 px-4 rounded-xl hover:bg-gray-800 transition-colors"
              >
                Search Again
              </Link>
            </div>
            
        </div>
                        <div className="my-2 mb-8 border border-dashed border-neutral-300"></div>

        <article className="prose prose-lg max-w-none text-neutral-800 prose-headings:text-neutral-800 prose-a:text-orange hover:prose-a:text-orange/80 prose-img:rounded-2xl prose-code:bg-gray-200 prose-code:px-1 prose-code:rounded">
          <ReactMarkdown>{content}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
}

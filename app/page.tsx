import { redirect } from "next/navigation";
import Link from "next/link";

export default function Home() {
  async function search(formData: FormData) {
    "use server";
    const identifier = formData.get("identifier");
    if (identifier && typeof identifier === "string") {
      redirect(`/${encodeURIComponent(identifier)}`);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white text-neutral-800">
      <div className="bg-neutral-800 text-white p-8 rounded-3xl max-w-md w-full mb-8">
        {/* <p className="text-sm md:text-xl tracking-wide text-gray-400 mb-3">Search</p> */}
        <h1 className="text-3xl font-bold mb-3">Find Your Data</h1>
        <p className="text-sm text-gray-300 mb-6">Type a definite ID or a saved name, then press Enter to open the document.</p>
        <form action={search} className="flex flex-col gap-4">
          <input 
            type="text" 
            name="identifier" 
            placeholder="Enter ID or Name..." 
            className="p-4 rounded-xl bg-gray-200 text-neutral-800 placeholder-gray-500"
            required
          />
          <button 
            type="submit" 
            className="bg-orange text-white font-bold p-4 rounded-xl hover:bg-orange/80 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

    </div>
  );
}

import Link from "next/link";
import { cookies } from "next/headers";
import { getAdminCookieName, isAdminAuthenticated } from "@/lib/admin-auth";
import { loginAdmin, logoutAdmin } from "./actions";
import AdminEditor from "./admin-editor";

type AdminPageProps = {
  searchParams?: {
    error?: string;
  };
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const authenticated = await isAdminAuthenticated();
  const loginError = searchParams?.error === "invalid" ? "Invalid admin password." : null;
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(getAdminCookieName());

  return (
    <div className="min-h-screen flex flex-col p-8 bg-white text-black">
      <div className="flex justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-1">Stay Away bruhh, ts ain&apos;t cbse 🙏🏻</p>
        </div>
        <Link
          href="/"
          className="bg-black text-white font-bold py-2 px-4 rounded-xl hover:bg-gray-800 transition-colors"
        >
          Go Home
        </Link>
      </div>

      {!authenticated ? (
        <div className="mx-auto w-full max-w-md bg-gray-100 p-6 rounded-3xl">
          <h2 className="text-xl font-bold mb-2">Unlock Admin Access</h2>
          <p className="text-sm text-gray-600 mb-6">
            Enter the admin password to manage searchable markdown content.
          </p>
          {loginError ? (
            <div className="mb-4 rounded-xl bg-black text-white px-4 py-3">{loginError}</div>
          ) : null}
          <form action={loginAdmin} className="flex flex-col gap-4">
            <input
              type="password"
              name="password"
              placeholder="Admin password"
              autoComplete="current-password"
              className="p-4 rounded-xl bg-white text-black placeholder-gray-500"
              required
            />
            <button
              type="submit"
              className="bg-orange text-white font-bold p-4 rounded-xl hover:bg-orange/80 transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6 text-sm text-gray-500">
            <span>Session active {sessionCookie ? "yes" : "no"}</span>
            <form action={logoutAdmin}>
              <button
                type="submit"
                className="text-black hover:text-orange transition-colors font-medium"
              >
                Sign Out
              </button>
            </form>
          </div>
          <AdminEditor />
        </>
      )}
    </div>
  );
}
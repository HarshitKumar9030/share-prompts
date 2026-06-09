"use server";

import dbConnect from "@/lib/dbConnect";
import {
  createAdminSessionValue,
  getAdminCookieName,
  getAdminCookieOptions,
  isAdminAuthenticated,
  verifyAdminPassword,
} from "@/lib/admin-auth";
import DataModel from "@/lib/models/Data";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function loginAdmin(formData: FormData) {
  const password = formData.get("password")?.toString() ?? "";

  if (!verifyAdminPassword(password)) {
    redirect("/admin?error=invalid");
  }

  const cookieStore = await cookies();
  cookieStore.set(getAdminCookieName(), createAdminSessionValue(), getAdminCookieOptions());
  redirect("/admin");
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(getAdminCookieName());
  redirect("/admin");
}

export async function createData(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    return { error: "Unauthorized" };
  }

  const identifier = formData.get("identifier")?.toString();
  const name = formData.get("name")?.toString();
  const content = formData.get("content")?.toString();

  if (!identifier || !content) {
    return { error: "Identifier and content are required." };
  }

  try {
    await dbConnect();

    // Upsert logic based on identifier
    await DataModel.findOneAndUpdate(
      { identifier },
      { identifier, name: name || undefined, content },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    revalidatePath(`/${identifier}`);
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Something went wrong." };
  }
}

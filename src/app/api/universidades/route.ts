import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return Response.json({ error: "Não autenticado" }, { status: 401 });
  }

  const res = await fetch("http://universities.hipolabs.com/search?country=Angola");
  const data = await res.json();
  return Response.json(data);
}
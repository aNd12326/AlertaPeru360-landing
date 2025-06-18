// Con `output: 'hybrid'` configurado:
export const prerender = false;
import { supabase } from "../../../lib/supabase";

export const POST = async ({ request, redirect }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const username = formData.get("username")?.toString(); // 👈 nuevo

  if (!email || !password || !username) {
    return new Response("Todos los campos son obligatorios", { status: 400 });
  }

    // Validar si el username ya está en uso
const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();

    if (existing) {
        return new Response("Nombre de usuario no disponible", { status: 400 });
      }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username, // 👈 se guarda en user_metadata
      },
    },
  });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  // const userId = data.user?.id;

  // // Insertar el perfil con username en la tabla 'profiles'
  // const { error: profileError } = await supabase
  //   .from("profiles")
  //   .insert([{ id: userId, username }]);

  // if (profileError) {
  //   return new Response(profileError.message, { status: 400 });
  // }

  return redirect("/login");
};
// Con `output: 'hybrid'` configurado:
export const prerender = false;
import { supabase } from "../../../lib/supabase";

export const POST = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return new Response("Correo electrónico y contraseña obligatorios", { status: 400 });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

    // Validar si el correo ha sido confirmado
    if (!data.user?.email_confirmed_at) {
      return new Response("Por favor confirma tu correo antes de iniciar sesión", { status: 403 });
    }
  
    const userId = data.user.id;
    const username = data.user?.user_metadata?.username;
  
    // Si ya existe perfil, no volver a insertar
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();
  
    if (!existing && username) {
      const { error: insertError } = await supabase
        .from("profiles")
        .insert([{ id: userId, username }]);
  
      if (insertError) {
        return new Response(insertError.message, { status: 400 });
      }
    }

  const { access_token, refresh_token } = data.session;
  cookies.set("sb-access-token", access_token, {
    path: "/",
  });
  cookies.set("sb-refresh-token", refresh_token, {
    path: "/",
  });
  return redirect("/");
};
// Con `output: 'hybrid'` configurado:
export const prerender = false;

export const GET = async ({ cookies, redirect }) => {
  cookies.delete("sb-access-token", { path: "/" });
  cookies.delete("sb-refresh-token", { path: "/" });
  return redirect("/login");
};
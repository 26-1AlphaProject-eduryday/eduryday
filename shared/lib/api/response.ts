export function ok<T>(data: T) {
  return Response.json({ ok: true, data });
}

export function fail(code: string, message: string, status = 400) {
  return Response.json({ ok: false, code, message }, { status });
}

type DefaultModule = { default: string }

export function importAll(r: __WebpackModuleApi.RequireContext) {
  const modules = r.keys().map(r);
  return modules.map((m: DefaultModule) => m.default);
}
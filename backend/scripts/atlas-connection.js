import { execFileSync } from "node:child_process";
import { resolveSrv } from "node:dns/promises";

// Some Windows DNS setups resolve SRV records through the OS but reject Node's
// c-ares SRV queries. The fallback only resolves public hostnames; credentials
// remain in process memory and are never passed to PowerShell or printed.
export const getAtlasConnectionUri = async (uri) => {
  const parsed = new URL(uri);
  if (process.platform !== "win32") return uri;

  try {
    await resolveSrv(`_mongodb._tcp.${parsed.hostname}`);
    return uri;
  } catch (error) {
    if (error.code !== "ECONNREFUSED") throw error;
  }

  const hostname = parsed.hostname;
  if (!/^[a-z0-9.-]+\.mongodb\.net$/i.test(hostname)) {
    throw new Error("Windows DNS fallback requires an Atlas mongodb.net hostname");
  }

  const command = `
    $ErrorActionPreference = 'Stop'
    $srv = @(Resolve-DnsName -Type SRV -Name '_mongodb._tcp.${hostname}' |
      Where-Object { $_.Type -eq 'SRV' } |
      ForEach-Object { @{ host = $_.NameTarget.TrimEnd('.'); port = $_.Port } })
    $txt = @(Resolve-DnsName -Type TXT -Name '${hostname}' |
      Where-Object { $_.Type -eq 'TXT' } |
      ForEach-Object { $_.Strings -join '' })
    @{ srv = $srv; txt = $txt } | ConvertTo-Json -Compress -Depth 5
  `;
  const result = JSON.parse(execFileSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", command], {
    encoding: "utf8", timeout: 15000, windowsHide: true,
  }));
  const records = Array.isArray(result.srv) ? result.srv : [result.srv];
  if (!records.length || records.some(({ host, port }) =>
    !/^[a-z0-9.-]+\.mongodb\.net$/i.test(host) || !Number.isInteger(port) || port < 1 || port > 65535)) {
    throw new Error("Windows DNS fallback returned invalid Atlas server records");
  }

  const options = new URLSearchParams();
  for (const value of result.txt || []) {
    for (const [key, item] of new URLSearchParams(value)) options.set(key, item);
  }
  for (const [key, item] of parsed.searchParams) options.set(key, item);
  options.set("tls", "true");
  const hosts = records.map(({ host, port }) => `${host}:${port}`).join(",");
  return `mongodb://${parsed.username}:${parsed.password}@${hosts}${parsed.pathname}?${options}`;
};

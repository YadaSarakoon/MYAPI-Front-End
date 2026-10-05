import { BASE_URLS } from './data';
import type { ClientLibraryLanguage, Endpoint, Env, SandboxCredentials, StringMap } from './types';
export function buildResolvedPath(endpoint: Endpoint, pathValues: StringMap): string {
  let p = endpoint.path;
  endpoint.pathParams.forEach((pp) => {
    p = p.replace(`:${pp.key}`, pathValues[pp.key] || `:${pp.key}`);
  });
  return p;
}

export function buildQueryString(endpoint: Endpoint, queryValues: StringMap): string {
  const active = endpoint.queryParams.filter((qp) => (queryValues[qp.key] ?? '') !== '');
  if (!active.length) return '';
  return '?' + active.map((qp) => `${qp.key}=${encodeURIComponent(queryValues[qp.key])}`).join('&');
}

export function randomToken(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  const cryptoObj = typeof window !== 'undefined' ? window.crypto : undefined;
  if (cryptoObj?.getRandomValues) {
    const values = new Uint32Array(length);
    cryptoObj.getRandomValues(values);
    for (let i = 0; i < length; i++) out += chars[values[i] % chars.length];
  } else {
    for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export function generateSandboxCredentials(): SandboxCredentials {
  return { clientId: `demo_client_${randomToken(12)}`, clientSecret: `demo_secret_${randomToken(12)}`, createdAt: new Date().toISOString() };
}

export function authBodyFromCredentials(creds: SandboxCredentials): string {
  return JSON.stringify(
    { client_id: creds.clientId, client_secret: creds.clientSecret, grant_type: 'client_credentials', scope: 'parcel' },
    null,
    2
  );
}

export function buildCurl(
  endpoint: Endpoint,
  env: Env,
  token: string,
  pathValues: StringMap,
  queryValues: StringMap,
  bodyText: string
): string {
  const url = BASE_URLS[env] + buildResolvedPath(endpoint, pathValues) + buildQueryString(endpoint, queryValues);
  const lines = [`curl --request ${endpoint.method} \\`, `  --url '${url}' \\`];
  endpoint.headers.forEach((h) => {
    const val = h.key === 'Authorization' ? `Bearer ${token || '{access_token}'}` : h.value;
    lines.push(`  --header '${h.key}: ${val}' \\`);
  });
  if (endpoint.bodyType === 'json' && bodyText) {
    lines.push(`  --data '${bodyText.replace(/\n\s*/g, ' ').trim()}'`);
  } else {
    lines[lines.length - 1] = lines[lines.length - 1].replace(/ \\$/, '');
  }
  return lines.join('\n');
}

export function buildCodeExample(
  language: ClientLibraryLanguage,
  endpoint: Endpoint,
  env: Env,
  token: string,
  pathValues: StringMap,
  queryValues: StringMap,
  bodyText: string
): string {
  const url = BASE_URLS[env] + buildResolvedPath(endpoint, pathValues) + buildQueryString(endpoint, queryValues);
  const headers = endpoint.headers.map((h) => {
    const value = h.key === 'Authorization' ? `Bearer ${token || '{access_token}'}` : h.value;
    return { key: h.key, value };
  });
  const body = bodyText || '';
  const jsonBody = body.replace(/`/g, '\\`');
  const headerLines = headers.map((h) => `    '${h.key}': '${h.value}'`).join(',\n');

  switch (language) {
    case 'cURL - cURL':
      return buildCurl(endpoint, env, token, pathValues, queryValues, bodyText);
    case 'JavaScript - Fetch':
      return `const response = await fetch('${url}', {\n  method: '${endpoint.method}',\n  headers: {\n${headerLines}\n  }${endpoint.bodyType !== 'none' ? `,\n  body: JSON.stringify(${jsonBody})` : ''}\n});\n\nconst data = await response.json();`;
    case 'NodeJs - Axios':
      return `const axios = require('axios');\n\nconst response = await axios({\n  method: '${endpoint.method.toLowerCase()}',\n  url: '${url}',\n  headers: {\n${headerLines}\n  }${endpoint.bodyType !== 'none' ? `,\n  data: ${jsonBody}` : ''}\n});\n\nconsole.log(response.data);`;
    case 'Python - Requests':
      return `import requests\n\nresponse = requests.request(\n    '${endpoint.method}',\n    '${url}',\n    headers={\n${headers.map((h) => `        '${h.key}': '${h.value}'`).join(',\n')}\n    }${endpoint.bodyType !== 'none' ? `,\n    json=${body}` : ''}\n)\n\nprint(response.json())`;
    case 'Python - http.client':
      return `import http.client\nimport json\n\nconn = http.client.HTTPSConnection('${new URL(url).host}')\nheaders = {\n${headers.map((h) => `    '${h.key}': '${h.value}'`).join(',\n')}\n}\n${endpoint.bodyType !== 'none' ? `body = json.dumps(${body})\nconn.request('${endpoint.method}', '${new URL(url).pathname}${new URL(url).search}', body, headers)` : `conn.request('${endpoint.method}', '${new URL(url).pathname}${new URL(url).search}', headers=headers)`}\nresponse = conn.getresponse()\nprint(response.read().decode())`;
    case 'PowerShell - RestMethod':
      return `$headers = @{\n${headers.map((h) => `  '${h.key}' = '${h.value}'`).join('\n')}\n}\n${endpoint.bodyType !== 'none' ? `$body = @'\n${body}\n'@\n\nInvoke-RestMethod -Uri '${url}' -Method ${endpoint.method} -Headers $headers -Body $body` : `Invoke-RestMethod -Uri '${url}' -Method ${endpoint.method} -Headers $headers`}`;
    case 'Java - OkHttp':
      return `OkHttpClient client = new OkHttpClient();\n\nRequest request = new Request.Builder()\n    .url("${url}")\n${headers.map((h) => `    .addHeader("${h.key}", "${h.value}")`).join('\n')}\n${endpoint.bodyType !== 'none' ? `    .post(RequestBody.create(\n        "${jsonBody.replace(/"/g, '\\"')}",\n        MediaType.parse("application/json")\n    ))\n` : ''}    .build();\n\nResponse response = client.newCall(request).execute();`;
    case 'PHP - cURL':
      return `$ch = curl_init('${url}');\n\ncurl_setopt_array($ch, [\n    CURLOPT_CUSTOMREQUEST => '${endpoint.method}',\n    CURLOPT_HTTPHEADER => [\n${headers.map((h) => `        '${h.key}: ${h.value}'`).join(',\n')}\n    ],${endpoint.bodyType !== 'none' ? `\n    CURLOPT_POSTFIELDS => '${body.replace(/'/g, "\\'")}',` : ''}\n]);\n\n$response = curl_exec($ch);\ncurl_close($ch);`;
    case 'Go - Native':
      return `req, _ := http.NewRequest("${endpoint.method}", "${url}", ${endpoint.bodyType !== 'none' ? `strings.NewReader(${JSON.stringify(body)})` : 'nil'})\n${headers.map((h) => `req.Header.Set("${h.key}", "${h.value}")`).join('\n')}\n\nclient := &http.Client{}\nresp, err := client.Do(req)`;
    case 'C - libcurl':
      return `CURL *curl = curl_easy_init();\nif (curl) {\n  curl_easy_setopt(curl, CURLOPT_URL, "${url}");\n  curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "${endpoint.method}");\n${headers.map((h) => `  /* Header: ${h.key}: ${h.value} */`).join('\n')}\n  curl_easy_perform(curl);\n  curl_easy_cleanup(curl);\n}`;
    default:
      return buildCurl(endpoint, env, token, pathValues, queryValues, bodyText);
  }
}

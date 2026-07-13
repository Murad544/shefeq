import { getToken } from "../api/http";

export async function downloadFile(url, fallbackName = "file") {
  const token = getToken();

  const headers = {
    "ngrok-skip-browser-warning": "true",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const fullUrl = url.startsWith("http")
    ? url
    : `${process.env.REACT_APP_API_URL || window.location.origin}${url}`;

  try {
    const res = await fetch(fullUrl, {
      headers,
      mode: "cors",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("Download error response:", text);
      throw new Error(`Download failed (${res.status}) ${text}`.trim());
    }

    const cd = res.headers.get("content-disposition") || "";
    let filename = fallbackName;
    const mStar = /filename\*\s*=\s*UTF-8''([^;]+)/i.exec(cd);
    const mPlain = /filename\s*=\s*"?([^";]+)"?/i.exec(cd);
    if (mStar) filename = decodeURIComponent(mStar[1]);
    else if (mPlain) filename = mPlain[1];

    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
  } catch (error) {
    console.error("⌘ Download failed:", error);
    throw error;
  }
}

export const downloadAll = async (files) => {
  for (const f of files) {
    const name = f.original_name || f.filename || `file_${f.id ?? ""}`;
    const url = f.url || (f.id ? `/api/admin/files/${f.id}/download` : "");
    if (url) {
      try {
        await downloadFile(url, name);
      } catch (e) {
        console.error(e);
      }
    }
  }
};

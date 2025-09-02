export type InstagramEmbed = {
  url: string
  html: string
}

// Stub util: returns oEmbed-like HTML snippets for public post URLs.
// Later, swap this for a server endpoint (e.g., /ig/media) without changing callers.
export async function fetchInstagramEmbeds(urls: string[]): Promise<InstagramEmbed[]> {
  // In production, call Instagram oEmbed or your own API to get real embed HTML + thumbnails.
  // For now, generate a minimal blockquote Instagram embed placeholder per URL.
  return urls.map((url) => ({
    url,
    html: `\n<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="${url}" data-instgrm-version="14" style="background:transparent; border:0; margin:0; max-width:540px; width:100%">\n  <a href="${url}" target="_blank" rel="noopener noreferrer" style="display:block; width:100%; height:0; padding-bottom:125%; background:rgba(127,127,127,.08)"></a>\n</blockquote>\n`,
  }))
}


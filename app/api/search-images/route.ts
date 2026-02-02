import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query) {
        return NextResponse.json({ error: "Query parameter required" }, { status: 400 })
    }

    console.log(`[Search API] Google Images Search: ${query}`)

    try {
        // Standard Google Images URL
        const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`

        const res = await fetch(googleUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            }
        })

        if (!res.ok) {
            throw new Error(`Google responded with ${res.status}`)
        }

        const html = await res.text()
        const images: any[] = []

        // Regex to find image data blobb (common pattern in Google Scripts)
        // Looks for ["http...", height, width] arrays
        // We look for the large image URL usually ending in .jpg/png/etc or just http
        // This regex targets the specific JSON structure Google uses for image candidates
        // Pattern: [1, "HEAD_IMAGE_URL", tile_height, tile_width]
        // This is fragile but works on standard HTML pages for now

        // Strategy 2: Look for 'jsname="Questions"' or specific class structures if regex fails.
        // But Regex is cleaner for raw HTML scanning.

        // We'll look for: ["http....", height, width]
        // Since the format is messy, let's grab all http matches followed by image extensions

        const regex = /\["http[^"]+",\d+,\d+\]/g
        const matches = html.match(regex) || []

        // Parse matches
        const seenUrls = new Set()

        matches.forEach(match => {
            if (images.length >= 20) return
            try {
                const data = JSON.parse(match)
                const url = data[0]
                const height = data[1]
                const width = data[2]

                // Filter valid images
                if (url && url.startsWith('http') && !seenUrls.has(url)) {
                    // Avoid static icons
                    if (width > 200 && height > 200) {
                        seenUrls.add(url)
                        images.push({
                            thumbnail: url, // Google usually gives the direct link here in this pattern
                            full: url,
                            alt: "Google Image",
                            source: "Google"
                        })
                    }
                }
            } catch (e) {
                // Ignore parse errors
            }
        })

        // Fallback: If advanced regex fails, use the lightweight GBv=2 scraping method
        if (images.length === 0) {
            console.log("[Search API] Regex failed, trying fallback to GBv=2 (Lightweight)")
            const fallbackUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch&GBv=2`
            const fallbackRes = await fetch(fallbackUrl, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
            })
            const fallbackHtml = await fallbackRes.text()

            // Just find src attributes in img tags
            const imgRegex = /src="(https:\/\/encrypted-tbn0\.gstatic\.com\/images\?q=[^"]+)"/g
            let imgMatch;
            while ((imgMatch = imgRegex.exec(fallbackHtml)) !== null) {
                if (images.length >= 20) break
                const url = imgMatch[1].replace(/&amp;/g, '&')
                if (!seenUrls.has(url)) {
                    seenUrls.add(url)
                    images.push({
                        thumbnail: url,
                        full: url,
                        alt: "Google Result",
                        source: "Google Basic"
                    })
                }
            }
        }

        console.log(`[Search API] Found ${images.length} images`)
        return NextResponse.json({ results: images })

    } catch (error: any) {
        console.error("[Search API] Search failed:", error)
        return NextResponse.json({
            error: "Search failed",
            details: error.message
        }, { status: 500 })
    }
}

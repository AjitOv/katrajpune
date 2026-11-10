import { SocialPublishResult } from "./types"

/**
 * LinkedIn UGC Posts API Integration
 */

export async function publishToLinkedIn(params: {
  text: string
  articleUrl?: string
  title?: string
  description?: string
  accessToken?: string
  authorUrn?: string
}): Promise<SocialPublishResult> {
  const accessToken = params.accessToken || process.env.LINKEDIN_ACCESS_TOKEN
  const authorUrn = params.authorUrn || process.env.LINKEDIN_AUTHOR_URN

  if (!accessToken || !authorUrn) {
    return {
      platform: "linkedin",
      success: false,
      error: "Missing LINKEDIN_ACCESS_TOKEN or LINKEDIN_AUTHOR_URN in environment",
    }
  }

  try {
    const isArticle = !!params.articleUrl

    const payload = {
      author: authorUrn.startsWith("urn:li:") ? authorUrn : `urn:li:person:${authorUrn}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: params.text,
          },
          shareMediaCategory: isArticle ? "ARTICLE" : "NONE",
          media: isArticle
            ? [
                {
                  status: "READY",
                  originalUrl: params.articleUrl,
                  title: {
                    text: params.title || "KatrajPune — Local Business Spotlight",
                  },
                  description: {
                    text: params.description || "Discover verified local businesses in Katraj, Pune.",
                  },
                },
              ]
            : undefined,
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    }

    const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok || data.status >= 400 || data.serviceErrorCode) {
      return {
        platform: "linkedin",
        success: false,
        error: data.message || `LinkedIn API error (${res.status})`,
      }
    }

    const urn = data.id || ""
    return {
      platform: "linkedin",
      success: true,
      postId: urn,
      url: `https://www.linkedin.com/feed/update/${urn}`,
    }
  } catch (err: any) {
    return {
      platform: "linkedin",
      success: false,
      error: err.message || "Failed to reach LinkedIn API",
    }
  }
}


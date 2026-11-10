import { SocialPublishResult } from "./types"

/**
 * Meta Graph API Integration for Facebook Pages and Instagram Professional
 */

const META_API_VERSION = "v19.0"

export async function publishToFacebookPage(params: {
  message: string
  linkUrl?: string
  imageUrl?: string
  pageId?: string
  accessToken?: string
}): Promise<SocialPublishResult> {
  const pageId = params.pageId || process.env.FACEBOOK_PAGE_ID
  const accessToken = params.accessToken || process.env.FACEBOOK_PAGE_ACCESS_TOKEN

  if (!pageId || !accessToken) {
    return {
      platform: "facebook",
      success: false,
      error: "Missing FACEBOOK_PAGE_ID or FACEBOOK_PAGE_ACCESS_TOKEN in environment",
    }
  }

  try {
    let endpoint = `https://graph.facebook.com/${META_API_VERSION}/${pageId}/feed`
    let body: Record<string, string> = {
      message: params.message,
      access_token: accessToken,
    }

    if (params.imageUrl) {
      endpoint = `https://graph.facebook.com/${META_API_VERSION}/${pageId}/photos`
      body = {
        url: params.imageUrl,
        caption: params.message,
        access_token: accessToken,
      }
    } else if (params.linkUrl) {
      body.link = params.linkUrl
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    if (!res.ok || data.error) {
      return {
        platform: "facebook",
        success: false,
        error: data.error?.message || `Facebook API error (${res.status})`,
      }
    }

    const postId = data.id || data.post_id
    return {
      platform: "facebook",
      success: true,
      postId,
      url: `https://facebook.com/${postId}`,
    }
  } catch (err: any) {
    return {
      platform: "facebook",
      success: false,
      error: err.message || "Failed to reach Meta Graph API",
    }
  }
}

export async function publishToInstagram(params: {
  caption: string
  imageUrl: string
  igAccountId?: string
  accessToken?: string
}): Promise<SocialPublishResult> {
  const igAccountId = params.igAccountId || process.env.INSTAGRAM_ACCOUNT_ID
  const accessToken = params.accessToken || process.env.FACEBOOK_PAGE_ACCESS_TOKEN

  if (!igAccountId || !accessToken) {
    return {
      platform: "instagram",
      success: false,
      error: "Missing INSTAGRAM_ACCOUNT_ID or FACEBOOK_PAGE_ACCESS_TOKEN in environment",
    }
  }

  if (!params.imageUrl) {
    return {
      platform: "instagram",
      success: false,
      error: "Instagram feed publishing requires a public image URL",
    }
  }

  try {
    // Step 1: Create Instagram media container
    const createRes = await fetch(
      `https://graph.facebook.com/${META_API_VERSION}/${igAccountId}/media`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: params.imageUrl,
          caption: params.caption,
          access_token: accessToken,
        }),
      }
    )

    const createData = await createRes.json()
    if (!createRes.ok || createData.error || !createData.id) {
      return {
        platform: "instagram",
        success: false,
        error: createData.error?.message || "Failed to create Instagram media container",
      }
    }

    const creationId = createData.id

    // Step 2: Publish the media container
    const publishRes = await fetch(
      `https://graph.facebook.com/${META_API_VERSION}/${igAccountId}/media_publish`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creation_id: creationId,
          access_token: accessToken,
        }),
      }
    )

    const publishData = await publishRes.json()
    if (!publishRes.ok || publishData.error || !publishData.id) {
      return {
        platform: "instagram",
        success: false,
        error: publishData.error?.message || "Failed to publish Instagram media container",
      }
    }

    return {
      platform: "instagram",
      success: true,
      postId: publishData.id,
      url: `https://instagram.com/p/${publishData.id}`,
    }
  } catch (err: any) {
    return {
      platform: "instagram",
      success: false,
      error: err.message || "Failed to reach Instagram Graph API",
    }
  }
}


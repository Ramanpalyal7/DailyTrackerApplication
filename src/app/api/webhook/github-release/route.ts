import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { config } from "@/utils/config";
import { createApiResponse } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const webhookSecret = process.env.WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("WEBHOOK_SECRET not configured");
      return NextResponse.json(
        createApiResponse(false, undefined, "Webhook secret not configured"),
        { status: 500 }
      );
    }

    if (authHeader !== `Bearer ${webhookSecret}`) {
      console.error("Unauthorized webhook attempt");
      return NextResponse.json(
        createApiResponse(false, undefined, "Unauthorized"),
        { status: 401 }
      );
    }

    const body = await request.json();
    const { version, fileName, size, platform } = body;

    if (!version || !fileName || !size || !platform) {
      return NextResponse.json(
        createApiResponse(false, undefined, "Missing required fields"),
        { status: 400 }
      );
    }

    if (platform !== "windows" && platform !== "macos") {
      return NextResponse.json(
        createApiResponse(false, undefined, "Invalid platform"),
        { status: 400 }
      );
    }

    if (!version.startsWith("v")) {
      return NextResponse.json(
        createApiResponse(false, undefined, "Version must start with 'v'"),
        { status: 400 }
      );
    }

    const downloadUrl = `${config.CLOUDFLARE_WORKER_URL}/${encodeURIComponent(fileName)}`;

    const release = await prisma.appRelease.upsert({
      where: {
        version_platform: {
          version: version,
          platform: platform,
        },
      },
      create: {
        version: version,
        platform: platform,
        fileName: fileName,
        downloadUrl: downloadUrl,
        size: size,
        publishedAt: new Date(),
      },
      update: {
        fileName: fileName,
        downloadUrl: downloadUrl,
        size: size,
        publishedAt: new Date(),
      },
    });

    console.log("Webhook processed successfully:", {
      version,
      platform,
      fileName,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      createApiResponse(true, {
        version: release.version,
        platform: release.platform,
        fileName: release.fileName,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Webhook processing failed:", {
      error,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      createApiResponse(false, undefined, "Internal Server Error"),
      { status: 500 }
    );
  }
}
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { IVideo, Video } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const videos = await Video.find({}).sort({createdAt: -1}).lean()

    if (!videos || videos.length === 0) {
      return NextResponse.json({error: "No videos found"}, {status: 404})
    }

    return NextResponse.json({videos}, {status: 200})
  } catch (error) {
    console.log("Error getting videos", error)
    return NextResponse.json({error: "Something went wrong while getting videos"}, {status: 500})
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({error: "You must be logged in to create a video"}, {status: 401})
    }

    await connectDB()

    const body:IVideo = await request.json()

    if (
      !body.title ||
      !body.description ||
      !body.videoUrl ||
      !body.thumbnailUrl
    ) {
      return NextResponse.json({error: "Missing required fields"}, {status: 400})
    }

    const videoData = {
      ...body,
      controls: body?.controls ?? true,
      transformations: {
        height: 1920,
        width: 1080,
        quality: body?.transformation?.quality ?? 100 
      },
    }
    const newVideo = await Video.create(videoData)

    return NextResponse.json({newVideo}, {status: 201})
  } catch (error) {
    console.log("Error creating video", error)
    return NextResponse.json({error: "Something went wrong while creating video"}, {status: 500})
  }
}
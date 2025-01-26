import { prismadb } from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
// convert to   props: { params: Promise<{ storeId: string }> }

// PATCH /api/[storeId]/billboards/[billboardId]
export async function PATCH(
  req: Request,
  props: { params: Promise<{ storeId: string; billboardId: string }> }
) {
  const { storeId, billboardId } = await props.params;
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { label, imageUrl } = body;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!label || !imageUrl)
      return new NextResponse("Label and imageUrl are required", {
        status: 400,
      });
    if (!storeId)
      return new NextResponse("Store ID is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: storeId, userId },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    const billboard = await prismadb.billboard.updateMany({
      where: { id: billboardId },
      data: { label, imageUrl },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log(error);
    return new NextResponse("[BILLBOARD_PATCH_ERROR]", { status: 500 });
  }
}

// DELETE /api/[storeId]/billboards/[billboardId]
export async function DELETE(
  req: Request,
  props: { params: Promise<{ storeId: string; billboardId: string }> }
) {
  const { storeId, billboardId } = await props.params;
  try {
    const { userId } = await auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 403 });
    if (!storeId)
      return new NextResponse("Store ID is required", { status: 400 });
    if (!billboardId)
      return new NextResponse("Billboard ID is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: storeId, userId },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    const billboard = await prismadb.billboard.deleteMany({
      where: { id: billboardId },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log(error);
    return new NextResponse("[BILLBOARD_DELETE_ERROR]", { status: 500 });
  }
}

// GET /api/[storeId]/billboards/[billboardId]
export async function GET(
  req: Request,
  props: { params: Promise<{ storeId: string; billboardId: string }> }
) {
  const { storeId, billboardId } = await props.params;
  try {

    if (!storeId)
      return new NextResponse("Store ID is required", { status: 400 });
    if (!billboardId)
      return new NextResponse("Billboard ID is required", { status: 400 });

    const billboard = await prismadb.billboard.findUnique({
      where: { id: billboardId },
    });
 
    return NextResponse.json(billboard);

  } catch (error) {
    console.log(error);
    return new NextResponse("[BILLBOARD_GET_ERROR]", { status: 500 });
  }
}

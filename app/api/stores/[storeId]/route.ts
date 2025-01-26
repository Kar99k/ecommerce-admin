import { prismadb } from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, props: { params: Promise<{ storeId: string }> }) {
  const params = await props.params;
  try {
    const { userId } = await auth();
    const { storeId } = await params;
    const body = await req.json();
    const { name } = body;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!storeId)
      return new NextResponse("Store ID is required", { status: 400 });

    const store = await prismadb.store.updateMany({
      where: { id: params.storeId, userId },
      data: { name },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log(error);
    return new NextResponse("[STORE_PATCH_ERROR]", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {

  try {
    const { userId } = await auth();
    const { storeId } = await params;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!storeId)
      return new NextResponse("Store ID is required", { status: 400 });

    const store = await prismadb.store.deleteMany({
      where: { id: storeId, userId },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log(error);
    return new NextResponse("[STORE_DELETE_ERROR]", { status: 500 });
  }

}

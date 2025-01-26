import { prismadb } from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// POST /api/[storeId]/categories
export async function POST(
  req: Request,
  props: { params: Promise<{ storeId: string }> }
) {
  const { storeId } = await props.params;
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name, billboardId } = body;


    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name || !billboardId) {
      return new NextResponse("Name and billboardId are required", {
        status: 400,
      });
    }

    if (!storeId) {
      return new NextResponse("StoreId is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORIES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// GET /api/[storeId]/categories
export async function GET(
  req: Request,
  props: { params: Promise<{ storeId: string }> }
) {
  const { storeId } = await props.params;
  try {
    if (!storeId) {
      return new NextResponse("StoreId is required", { status: 400 });
    }

    const categories = await prismadb.category.findMany({
      where: {
        storeId,
      },
      include: {
        billboard: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

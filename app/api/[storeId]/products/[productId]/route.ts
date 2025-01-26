import { prismadb } from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// PATCH /api/[storeId]/products/[productId]
export async function PATCH(
  req: Request,
  props: { params: Promise<{ storeId: string; productId: string }> }
) {
  try {
    const { userId } = await auth();
    const { storeId, productId } = await props.params;
    const body = await req.json();
    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      isFeatured,
      isArchived,
      images,
    } = body;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }
    if (!categoryId) {
      return new NextResponse("CategoryId is required", { status: 400 });
    }
    if (!colorId) {
      return new NextResponse("ColorId is required", { status: 400 });
    }
    if (!sizeId) {
      return new NextResponse("SizeId is required", { status: 400 });
    }
    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: storeId, userId },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    await prismadb.product.update({
      where: { id: productId },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        isFeatured,
        isArchived,
        images: {
          deleteMany: {},
        },
      },
    });

    const product = await prismadb.product.update({
      where: {
        id: productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log(error);
    return new NextResponse("[PRODUCT_PATCH_ERROR]", { status: 500 });
  }
}

// DELETE /api/[storeId]/products/[productId]
export async function DELETE(
  req: Request,
  props: { params: Promise<{ storeId: string; productId: string }> }
) {
  try {
    const { userId } = await auth();
    const { storeId, productId } = await props.params;

    if (!userId) return new NextResponse("Unauthenticated", { status: 403 });
    if (!storeId)
      return new NextResponse("Store ID is required", { status: 400 });
    if (!productId)
      return new NextResponse("Product ID is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: storeId, userId },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    const product = await prismadb.product.deleteMany({
      where: { id: productId },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log(error);
    return new NextResponse("[PRODUCT_DELETE_ERROR]", { status: 500 });
  }
}

// GET /api/[storeId]/products/[productId]
export async function GET(
  req: Request,
  props: { params: Promise<{ storeId: string; productId: string }> }
) {
  try {
    const { storeId, productId } = await props.params;

    if (!storeId)
      return new NextResponse("Store ID is required", { status: 400 });
    if (!productId)
      return new NextResponse("Product ID is required", { status: 400 });

    const product = await prismadb.product.findUnique({
      where: { id: productId },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log(error);
    return new NextResponse("[PRODUCT_GET_ERROR]", { status: 500 });
  }
}

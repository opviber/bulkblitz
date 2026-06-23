import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { searchSchema, parseQuery } from "@/lib/validation";

const PAGE_SIZE = 24;

// GET /api/batches/search?q=&category=&city=&sort=
export async function GET(request) {
  const { data, error } = parseQuery(request, searchSchema);
  if (error) return error;

  const where = { status: "LIVE" };
  if (data.category && data.category !== "all") where.category = data.category;
  if (data.q) {
    where.OR = [
      { title: { contains: data.q, mode: "insensitive" } },
      { description: { contains: data.q, mode: "insensitive" } },
    ];
  }
  if (data.city) {
    where.manufacturer = { city: { contains: data.city, mode: "insensitive" } };
  }

  let orderBy;
  switch (data.sort) {
    case "ending":
      orderBy = { endTime: "asc" };
      break;
    case "new":
      orderBy = { createdAt: "desc" };
      break;
    case "velocity":
      orderBy = { currentSlots: "desc" };
      break;
    case "price":
    default:
      orderBy = { createdAt: "desc" };
  }

  const page = data.page || 1;
  const [items, total] = await Promise.all([
    prisma.batch.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { tiers: true, manufacturer: true },
    }),
    prisma.batch.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, pageSize: PAGE_SIZE });
}

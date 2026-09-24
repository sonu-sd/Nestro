import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import categoryModel from "../src/models/category.model.js";
import roomModel from "../src/models/room.model.js";
import colorModel from "../src/models/color.model.js";
import ProductModel from "../src/models/product.model.js";
import userModel from "../src/models/user.model.js";
import { getAtlasConnectionUri } from "../src/config/atlas-connection.js";

// These are illustrative stock photos. Replace them with exact SKU photos before selling.
const photo = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85`;
const photos = {
  sofa: [
    "photo-1555041469-a586c61ea9bc",
    "photo-1550254478-ead40cc54513",
    "photo-1540574163026-643ea20ade25",
    "photo-1493663284031-b7e3aefcae8e",
  ],
  chair: [
    "photo-1503602642458-232111445657",
    "photo-1598300056393-4aac492f4344",
    "photo-1519947486511-46149fa0a254",
    "photo-1567538096630-e0c55bd6374c",
  ],
  table: [
    "photo-1499933374294-4584851497cc",
    "photo-1617806118233-18e1de247200",
    "photo-1519947486511-46149fa0a254",
    "photo-1615874959474-d609969a20ed",
  ],
  bed: [
    "photo-1505693416388-ac5ce068fe85",
    "photo-1505693416388-ac5ce068fe85",
    "photo-1616594039964-ae9021a400a0",
    "photo-1615874959474-d609969a20ed",
  ],
  storage: [
    "photo-1593071045469-a45708d54b3d",
    "photo-1748679979601-dc9ec43d900d",
    "photo-1493663284031-b7e3aefcae8e",
    "photo-1598300056393-4aac492f4344",
  ],
  decor: [
    "photo-1519643381401-22c77e60520e",
    "photo-1616486338812-3dadae4b4ace",
    "photo-1618221195710-dd6b41faaea6",
    "photo-1600210492486-724fe5c67fb0",
  ],
};

const categories = [
  ["Sofas & Sectionals", "sofas-sectionals", "sofa"],
  ["Accent Chairs", "accent-chairs", "chair"],
  ["Coffee & Dining Tables", "tables", "table"],
  ["Beds & Bedroom", "beds-bedroom", "bed"],
  ["Storage & Shelving", "storage-shelving", "storage"],
  ["Decor & Lighting", "decor-lighting", "decor"],
];
const rooms = [
  ["Living Room", "living-room", "sofa"],
  ["Bedroom", "bedroom", "bed"],
  ["Dining Room", "dining-room", "table"],
  ["Home Office", "home-office", "storage"],
  ["Entryway", "entryway", "decor"],
];
const colors = [
  ["Walnut", "walnut", "#6B442D"],
  ["Natural Oak", "natural-oak", "#B89267"],
  ["Ivory", "ivory", "#F1EBDD"],
  ["Charcoal", "charcoal", "#3D4144"],
  ["Sage", "sage", "#9AA992"],
  ["Terracotta", "terracotta", "#B86B50"],
  ["Navy", "navy", "#334761"],
  ["Black", "black", "#242424"],
];

// title, category, room, material, color, price, sale price, dimensions (cm), weight (kg)
const catalog = [
  [
    "Aster Linen Three Seater Sofa",
    0,
    0,
    "Fabric",
    2,
    72900,
    61900,
    [210, 90, 82],
    54,
  ],
  [
    "Mira Boucle Two Seater Sofa",
    0,
    0,
    "Fabric",
    2,
    64900,
    54900,
    [165, 86, 80],
    42,
  ],
  [
    "Ember Velvet Three Seater Sofa",
    0,
    0,
    "Fabric",
    6,
    89900,
    74900,
    [205, 88, 83],
    51,
  ],
  [
    "Solstice Modular Corner Sofa",
    0,
    0,
    "Fabric",
    4,
    124900,
    109900,
    [265, 170, 79],
    89,
  ],
  ["Noma Compact Loveseat", 0, 0, "Fabric", 5, 52900, 44900, [145, 85, 79], 37],
  [
    "Haven Leather Lounge Sofa",
    0,
    0,
    "Leather",
    3,
    139900,
    119900,
    [215, 92, 84],
    68,
  ],
  [
    "Aura Boucle Accent Chair",
    1,
    0,
    "Fabric",
    2,
    32900,
    27900,
    [78, 81, 82],
    19,
  ],
  [
    "Cove Walnut Lounge Chair",
    1,
    0,
    "Sheesham",
    0,
    28900,
    24900,
    [72, 76, 80],
    16,
  ],
  [
    "Orion Upholstered Armchair",
    1,
    0,
    "Fabric",
    3,
    36900,
    30900,
    [79, 79, 85],
    21,
  ],
  ["Luma Reading Chair", 1, 3, "Fabric", 4, 27900, 22900, [72, 75, 88], 17],
  ["Siena Cane Dining Chair", 1, 2, "Wood", 1, 15900, 12900, [48, 51, 79], 8],
  [
    "Vale Leather Desk Chair",
    1,
    3,
    "Leather",
    7,
    30900,
    25900,
    [64, 62, 92],
    15,
  ],
  [
    "Terra Round Coffee Table",
    2,
    0,
    "Sheesham",
    0,
    28900,
    23900,
    [90, 90, 43],
    23,
  ],
  [
    "Natura Six Seat Dining Table",
    2,
    2,
    "Wood",
    1,
    84900,
    71900,
    [180, 90, 76],
    65,
  ],
  [
    "Mason Marble Side Table",
    2,
    0,
    "Marble",
    2,
    21900,
    17900,
    [50, 50, 52],
    18,
  ],
  ["Arlo Oak Writing Desk", 2, 3, "Wood", 1, 45900, 38900, [120, 60, 76], 28],
  [
    "Noir Metal Nesting Tables",
    2,
    0,
    "Metal",
    7,
    19900,
    15900,
    [55, 55, 49],
    13,
  ],
  [
    "Elara Four Seat Dining Table",
    2,
    2,
    "Sheesham",
    0,
    59900,
    49900,
    [135, 80, 75],
    44,
  ],
  [
    "Linen Upholstered Queen Bed",
    3,
    1,
    "Fabric",
    2,
    79900,
    67900,
    [218, 169, 110],
    73,
  ],
  [
    "Ridge Solid Wood King Bed",
    3,
    1,
    "Sheesham",
    0,
    99900,
    84900,
    [220, 190, 105],
    88,
  ],
  [
    "Dune Storage Queen Bed",
    3,
    1,
    "Engineered Wood",
    1,
    69900,
    58900,
    [215, 165, 100],
    93,
  ],
  [
    "Serene Padded Headboard Bed",
    3,
    1,
    "Fabric",
    4,
    84900,
    71900,
    [218, 171, 115],
    79,
  ],
  ["Willow Oak Bedside Table", 3, 1, "Wood", 1, 18900, 14900, [48, 42, 55], 13],
  ["Nori Bedroom Bench", 3, 1, "Fabric", 2, 24900, 19900, [120, 42, 46], 18],
  [
    "Walnut Media Console",
    4,
    0,
    "Sheesham",
    0,
    56900,
    47900,
    [180, 42, 55],
    47,
  ],
  [
    "Linen Two Door Wardrobe",
    4,
    1,
    "Engineered Wood",
    2,
    79900,
    66900,
    [110, 58, 190],
    82,
  ],
  ["Sora Open Bookshelf", 4, 3, "Wood", 1, 38900, 31900, [90, 35, 175], 36],
  [
    "Entryway Shoe Cabinet",
    4,
    4,
    "Engineered Wood",
    0,
    27900,
    22900,
    [100, 35, 95],
    29,
  ],
  [
    "Atlas Sideboard Cabinet",
    4,
    2,
    "Sheesham",
    0,
    64900,
    54900,
    [150, 44, 86],
    53,
  ],
  ["Milo Floating Shelf Set", 4, 3, "Wood", 1, 12900, 9900, [75, 22, 5], 7],
  ["Aria Ceramic Table Lamp", 5, 1, "Glass", 2, 10900, 8900, [30, 30, 52], 5],
  ["Sol Woven Pendant Light", 5, 2, "Fabric", 1, 13900, 10900, [45, 45, 35], 4],
  ["Mira Arched Wall Mirror", 5, 4, "Glass", 7, 17900, 13900, [65, 4, 110], 10],
  ["Terra Ceramic Vase Pair", 5, 0, "Marble", 5, 7900, 5900, [22, 22, 38], 4],
  ["Haven Floor Lamp", 5, 0, "Metal", 7, 21900, 17900, [35, 35, 155], 9],
  ["Luna Framed Art Set", 5, 4, "Wood", 3, 11900, 8900, [60, 3, 80], 6],
];

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const seedProducts = () =>
  catalog.map(
    (
      [
        title,
        category,
        room,
        material,
        color,
        price,
        salePrice,
        dimensions,
        weight,
      ],
      index,
    ) => {
      const family = categories[category][2];
      const imageSet = photos[family];
      return {
        title,
        slug: slugify(title),
        shortDescription: `${title} brings a warm, considered look to your home.`,
        description: `${title} combines ${material.toLowerCase()} with a timeless silhouette. Designed for everyday living and easy styling in a modern Indian home. Measurements are approximate; confirm finish and availability before fulfilment.`,
        category: category,
        roomType: room,
        material,
        color: colors[color][0],
        colors: [color],
        price,
        salePrice,
        discount: Math.round((1 - salePrice / price) * 100),
        stock: true,
        sold: 0,
        thumbnail: photo(imageSet[index % imageSet.length]),
        images: [photo(imageSet[(index + 1) % imageSet.length])],
        dimensions: {
          length: dimensions[0],
          width: dimensions[1],
          height: dimensions[2],
          unit: "cm",
        },
        weight: { value: weight, unit: "kg" },
        featured: index % 5 === 0,
        bestSeller: index % 7 === 0,
        newArrival: index % 6 === 0,
        status: true,
      };
    },
  );

const apply = process.argv.includes("--apply");
const skipImageCheck = process.argv.includes("--skip-image-check");
const checkImages =
  process.argv.includes("--check-images") || (apply && !skipImageCheck);
if (
  process.argv
    .slice(2)
    .some(
      (arg) =>
        ![
          "--apply",
          "--dry-run",
          "--check-images",
          "--skip-image-check",
        ].includes(arg),
    ) ||
  (skipImageCheck && (!apply || process.argv.includes("--check-images")))
) {
  throw new Error(
    "Usage: npm run seed:atlas [-- --check-images] [-- --apply [--skip-image-check]]",
  );
}

const products = seedProducts();
const placeholderIds = {
  categories: categories.map(() => new mongoose.Types.ObjectId()),
  rooms: rooms.map(() => new mongoose.Types.ObjectId()),
  colors: colors.map(() => new mongoose.Types.ObjectId()),
};
for (const product of products) {
  const check = new ProductModel({
    ...product,
    category: placeholderIds.categories[product.category],
    roomType: placeholderIds.rooms[product.roomType],
    colors: product.colors.map((index) => placeholderIds.colors[index]),
  });
  await check.validate();
}
if (new Set(products.map((product) => product.slug)).size !== products.length)
  throw new Error("Duplicate product slug in seed data");
console.log(
  `Validated ${categories.length} categories, ${rooms.length} rooms, ${colors.length} colors, ${products.length} products and 4 users.`,
);

const uri = process.env.MONGO_URI;
const adminEmail = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
const adminPassword = process.env.SEED_ADMIN_PASSWORD;
const demoPassword = process.env.SEED_DEMO_PASSWORD;
if (apply) {
  if (
    !uri?.startsWith("mongodb+srv://") ||
    new URL(uri).pathname !== "/Nestro"
  ) {
    throw new Error(
      "Refusing to seed: MONGO_URI must be an Atlas mongodb+srv URL targeting /Nestro",
    );
  }
  if (
    !adminEmail ||
    !/^\S+@\S+\.\S+$/.test(adminEmail) ||
    !adminPassword ||
    adminPassword.length < 12 ||
    !demoPassword ||
    demoPassword.length < 12
  ) {
    throw new Error(
      "Set SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD and SEED_DEMO_PASSWORD (passwords at least 12 characters)",
    );
  }
}

if (checkImages) {
  const urls = [
    ...new Set([
      ...categories.map(([, , family]) => photo(photos[family][0])),
      ...rooms.map(([, , family]) => photo(photos[family][0])),
      ...products.flatMap((product) => [product.thumbnail, ...product.images]),
    ]),
  ];
  console.log(`Checking ${urls.length} image URLs with limited concurrency...`);
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const check = async (url) => {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        // GET works on image hosts that reject HEAD. Cancel after headers to avoid downloading full photos.
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "image/avif,image/webp,image/*,*/*;q=0.8",
            Range: "bytes=0-0",
          },
          signal: AbortSignal.timeout(15000),
        });
        const contentType = response.headers.get("content-type") || "";
        await response.body?.cancel();
        if (response.ok && contentType.startsWith("image/")) return null;
        if (
          [429, 500, 502, 503, 504].includes(response.status) &&
          attempt < 2
        ) {
          await wait(1000 * (attempt + 1));
          continue;
        }
        return `${response.status} ${contentType || "unknown content type"} ${url}`;
      } catch (error) {
        if (attempt === 2)
          return `${error.cause?.code || error.name || "network error"} ${url}`;
        await wait(1000 * (attempt + 1));
      }
    }
  };
  const checks = [];
  for (let index = 0; index < urls.length; index += 2) {
    checks.push(
      ...(await Promise.all(urls.slice(index, index + 2).map(check))),
    );
    if (index + 2 < urls.length) await wait(300);
  }
  const failed = checks.filter(Boolean);
  if (failed.length)
    throw new Error(
      `Image check failed for ${failed.length} URL(s):\n${failed.join("\n")}\nIf all failures are network errors, check your connection. Do not apply until photo URLs are reviewed.`,
    );
  console.log(`Verified ${urls.length} remote image URLs.`);
} else if (skipImageCheck) {
  console.warn(
    "Skipping external image checks. Review every product image after seeding and before accepting orders.",
  );
}

if (!apply) {
  console.log(
    "Dry run only. No database connection or write. Use npm run seed:atlas -- --apply after Atlas setup.",
  );
} else {
  const demoUsers = [
    ["Aarav Mehta", "aarav.m@example.test"],
    ["Diya Sharma", "diya.s@example.test"],
    ["Kabir Rao", "kabir.r@example.test"],
  ];
  if (demoUsers.some(([, email]) => email === adminEmail))
    throw new Error("Admin email must differ from demo user emails");

  try {
    const connectionUri = await getAtlasConnectionUri(uri);
    if (connectionUri !== uri)
      console.log("Using Windows DNS fallback for Atlas SRV records.");
    await mongoose.connect(connectionUri, { serverSelectionTimeoutMS: 10000 });
    const existingAdmin = await userModel.findOne({ email: adminEmail });
    if (
      existingAdmin &&
      !["admin", "superAdmin"].includes(existingAdmin.role)
    ) {
      throw new Error(
        "Admin email already belongs to a non-admin user; choose another email",
      );
    }
    if (existingAdmin && (!existingAdmin.isVerified || !existingAdmin.status)) {
      throw new Error(
        "Existing admin account is unverified or disabled; fix it before seeding",
      );
    }
    const [categoryDocs, roomDocs, colorDocs] = await Promise.all([
      Promise.all(
        categories.map(async ([name, slug, family]) => {
          const doc = await categoryModel.findOneAndUpdate(
            { slug },
            {
              $setOnInsert: {
                name,
                slug,
                image: photo(photos[family][0]),
                status: true,
              },
            },
            { upsert: true, returnDocument: "after" },
          );
          if (!doc.status) throw new Error(`Category ${slug} is archived`);
          return doc;
        }),
      ),
      Promise.all(
        rooms.map(async ([name, slug, family]) => {
          const doc = await roomModel.findOneAndUpdate(
            { slug },
            {
              $setOnInsert: {
                name,
                slug,
                image: photo(photos[family][0]),
                status: true,
              },
            },
            { upsert: true, returnDocument: "after" },
          );
          if (!doc.status) throw new Error(`Room ${slug} is archived`);
          return doc;
        }),
      ),
      Promise.all(
        colors.map(async ([name, slug, hex]) => {
          const doc = await colorModel.findOneAndUpdate(
            { slug },
            { $setOnInsert: { name, slug, hex, status: true } },
            { upsert: true, returnDocument: "after" },
          );
          if (!doc.status) throw new Error(`Color ${slug} is archived`);
          return doc;
        }),
      ),
    ]);
    for (const product of products) {
      await ProductModel.updateOne(
        { slug: product.slug },
        {
          $setOnInsert: {
            ...product,
            category: categoryDocs[product.category]._id,
            roomType: roomDocs[product.roomType]._id,
            colors: product.colors.map((index) => colorDocs[index]._id),
          },
        },
        { upsert: true },
      );
    }
    if (!existingAdmin)
      await userModel.create({
        name: "Nestro Admin",
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 12),
        role: "admin",
        isVerified: true,
      });
    const demoHash = await bcrypt.hash(demoPassword, 12);
    for (const [name, email] of demoUsers) {
      await userModel.updateOne(
        { email },
        {
          $setOnInsert: {
            name,
            email,
            password: demoHash,
            role: "user",
            isVerified: true,
          },
        },
        { upsert: true },
      );
    }
    console.log(
      "Atlas seed complete. Existing matching slugs and emails were left unchanged. No local MongoDB data was migrated.",
    );
  } finally {
    await mongoose.disconnect();
  }
}

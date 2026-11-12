
export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return Response.json(
      { error: "Supabase configuration is missing" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/products?select=id,product_name,description,price,category,image_url,stock_quantity,created_at&status=eq.approved&order=created_at.desc`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        cache: "no-store",
      }
    );

   if (!response.ok) {
  const errorDetails = await response.text();

  return Response.json(
    {
      error: "Unable to load products",
      status: response.status,
      details: errorDetails,
    },
    { status: response.status }
  );
}

    const products = await response.json();

    return Response.json(
      { products },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return Response.json(
      { error: "Server error while loading products" },
      { status: 500 }
    );
  }
}

const products = [
  {
    id: 1,
    name: "Classic English Cake",
    tag: "Premium Non-Frosting",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1200",
    alt: "English Tea Cake",
  },
  {
    id: 2,
    name: "Velvet Cheesecake",
    tag: "Baked Fresh",
    image:
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=1200",
    alt: "New York Cheesecake",
  },
  {
    id: 3,
    name: "Parisian Macarons",
    tag: "Seasonal Trends",
    image:
      "https://tse3.mm.bing.net/th/id/OIP.2hVQ_gcEGIQD48FbiyWlNgHaHa?pid=Api&P=0&h=180",
    alt: "Premium Macarons",
  },
];

function Collection() {
  return (
    <section id="collection" className="py-24 px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl mb-4">The Signature Series</h2>
        <p className="text-gray-500">Trending flavors, traditional techniques.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {products.map((product) => (
          <div key={product.id} className="group cursor-pointer">
            <div className="overflow-hidden mb-4 bg-gray-200 aspect-[4/5]">
              <img
                src={product.image}
                alt={product.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />
            </div>
            <h3 className="text-xl mb-1">{product.name}</h3>
            <p className="text-amber-800 text-sm font-semibold">{product.tag}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Collection;

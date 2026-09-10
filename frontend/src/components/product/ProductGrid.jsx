import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading, viewMode = 'grid' }) => {
  if (loading) {
    return (
      <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1'} gap-8`}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="flex flex-col gap-4">
            <div className="animate-pulse bg-gray-50 aspect-[4/5] rounded-3xl"></div>
            <div className="animate-pulse bg-gray-50 h-4 w-3/4 rounded-full"></div>
            <div className="animate-pulse bg-gray-50 h-4 w-1/2 rounded-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1 px-4'} gap-8`}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;

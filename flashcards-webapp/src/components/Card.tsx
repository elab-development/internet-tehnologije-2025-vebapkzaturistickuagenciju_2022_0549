/* eslint-disable @next/next/no-img-element */

interface CardProps {
  title: string
  description: string
  price?: number
  discountedPrice?: number
  imageUrl?: string
  category?: string
  onClick?: () => void
}

export default function Card({
  title,
  description,
  price,
  discountedPrice,
  imageUrl,
  category,
  onClick
}: CardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
    >
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        {category && (
          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
            {category}
          </span>
        )}
        <h3 className="text-lg font-semibold mt-2">{title}</h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{description}</p>
        {price && (
          <div className="mt-3">
            {discountedPrice && discountedPrice < price ? (
              <div className="flex items-center gap-2">
                <p className="text-gray-400 line-through">{price} €</p>
                <p className="text-xl font-bold text-green-600">{discountedPrice.toFixed(2)} €</p>
              </div>
            ) : (
              <p className="text-xl font-bold text-purple-600">{price} €</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
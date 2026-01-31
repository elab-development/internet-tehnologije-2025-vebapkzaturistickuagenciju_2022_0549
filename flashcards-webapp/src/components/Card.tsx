/* eslint-disable @next/next/no-img-element */

interface CardProps {
  title: string
  description: string
  price?: number
  imageUrl?: string
  category?: string
  onClick?: () => void
}

export default function Card({
  title,
  description,
  price,
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
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {category}
          </span>
        )}
        <h3 className="text-lg font-semibold mt-2">{title}</h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{description}</p>
        {price && (
          <p className="text-xl font-bold text-blue-600 mt-3">
            {price} €
          </p>
        )}
      </div>
    </div>
  )
}
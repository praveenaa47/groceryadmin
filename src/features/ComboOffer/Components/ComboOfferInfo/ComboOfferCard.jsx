import { Edit2, Trash2 } from "lucide-react";
import { IMG_URL } from "../../../../lib/constants";

const ComboOfferCard = ({ combo, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price) => `₹${price}`;

  return (
    <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={`${IMG_URL}/${combo.image}`}
          alt={combo.name}
          className="w-full h-48 object-cover rounded-t-xl"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=200&fit=crop";
          }}
        />
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              combo.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {combo.isActive ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Save ₹{combo.totalSavings || combo.discountValue}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {combo.name}
        </h3>
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-4">
          {combo.category?.title || "No Category"}
        </span>

        {/* Products */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Products ({combo.products?.length || 0}):
          </p>
          <div className="space-y-2">
            {combo.products?.map((product, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-gray-600">
                  {product.productName ||
                    product.productId?.name ||
                    "Unknown Product"}
                  {product.quantity &&
                    product.weight &&
                    product.measurm &&
                    ` (${product.quantity} × ${product.weight}${product.measurm})`}
                </span>
                <span className="font-medium">
                  {formatPrice(
                    product.productTotalPrice ||
                      product.productId?.price ||
                      0
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          {combo.totalOriginalPrice && (
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">
                Original Price:
              </span>
              <span className="text-sm line-through text-gray-500">
                {formatPrice(combo.totalOriginalPrice)}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600">
              Discount ({combo.discountType}):
            </span>
            <span className="text-sm text-red-600">
              -
              {combo.discountType === "percentage"
                ? `${combo.discountValue}%`
                : formatPrice(combo.discountValue)}
            </span>
          </div>
          {combo.discountedPrice && (
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-gray-900">
                Final Price:
              </span>
              <span className="text-lg font-bold text-green-600">
                {formatPrice(combo.discountedPrice)}
              </span>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Valid: {formatDate(combo.startDate)} -{" "}
          {formatDate(combo.endDate)}
        </p>

        <div className="flex gap-2">
          <Edit2
            className="w-4 h-4 cursor-pointer hover:text-blue-700"
            onClick={() => onEdit(combo._id)}
          />

          <Trash2
            className="w-4 h-4 cursor-pointer hover:text-red-700"
            onClick={() => onDelete(combo)}
            color="red"
          />
        </div>
      </div>
    </div>
  );
};

export default ComboOfferCard;
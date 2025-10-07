import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react"; // icon (lucide is lightweight)

const FloatingCartButton = ({ cartCount }) => {
  const navigate = useNavigate();

  if (cartCount <= 0) return null; // hide if no items

  return (
    <button
      onClick={() => navigate("/cart")}
      className="fixed bottom-6 right-28 bg-black hover:bg-gray-800 text-white 
                 rounded-full w-20 h-20 flex items-center justify-center shadow-lg
                 transition-transform transform hover:scale-110"
    >
      <div className="relative">
        <ShoppingCart className="w-10 h-10" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-l font-bold 
                           rounded-full h-5 w-5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </div>
    </button>
  );
};

export default FloatingCartButton;

import { FaShoppingCart } from "react-icons/fa";

interface Props {
  total: number;
}

export function CarrinhoIcon({ total }: Props) {
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        <FaShoppingCart className="text-3xl text-blue-600" />
        {total > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2">
            {total}
          </span>
        )}
      </div>
    </div>
  );
}

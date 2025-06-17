import type { Produto } from "../types/Produto";

interface Props {
  produto: Produto;
  onComprar: (id: string) => void;
  onEditar: (produto: Produto) => void;
  onDeletar: (id: string) => void;
}

export function ProdutoItem({ produto, onComprar, onEditar, onDeletar }: Props) {
  return (
    <div className="border p-4 rounded shadow-md bg-white flex flex-col">
      <h3 className="font-bold text-lg">{produto.nome}</h3>
      <p>Preço: R$ {produto.preco.toFixed(2)}</p>
      <p>Estoque: {produto.estoque}</p>
      <div className="mt-2 flex gap-2">
        <button
          className="bg-green-600 text-white px-3 py-1 rounded"
          disabled={produto.estoque <= 0}
          onClick={() => onComprar(produto._id)}
        >
          Comprar
        </button>
        <button
          className="bg-yellow-500 text-white px-3 py-1 rounded"
          onClick={() => onEditar(produto)}
        >
          Editar
        </button>
        <button
          className="bg-red-600 text-white px-3 py-1 rounded"
          onClick={() => onDeletar(produto._id)}
        >
          Remover
        </button>
      </div>
    </div>
  );
}

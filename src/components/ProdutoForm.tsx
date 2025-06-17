import { useState, useEffect } from "react";
import type { Produto } from "../types/Produto";

interface Props {
  onSave: (produto: Omit<Produto, "_id">, id?: string) => void;
  produtoEditando?: Produto | null;
  cancelEdit?: () => void;
}

export function ProdutoForm({ onSave, produtoEditando, cancelEdit }: Props) {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState(0);
  const [estoque, setEstoque] = useState(0);

  useEffect(() => {
    if (produtoEditando) {
      setNome(produtoEditando.nome);
      setPreco(produtoEditando.preco);
      setEstoque(produtoEditando.estoque);
    }
  }, [produtoEditando]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ nome, preco, estoque }, produtoEditando?._id);
    setNome("");
    setPreco(0);
    setEstoque(0);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md p-4 rounded mb-6"
    >
      <h2 className="text-lg font-bold mb-2">
        {produtoEditando ? "Editar Produto" : "Novo Produto"}
      </h2>
      <div className="flex flex-col gap-2">
        <input
          placeholder="Nome"
          className="border p-2 rounded"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <input
          placeholder="Preço"
          type="number"
          className="border p-2 rounded"
          value={preco}
          onChange={(e) => setPreco(Number(e.target.value))}
          required
        />
        <input
          placeholder="Estoque"
          type="number"
          className="border p-2 rounded"
          value={estoque}
          onChange={(e) => setEstoque(Number(e.target.value))}
          required
        />
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            {produtoEditando ? "Atualizar" : "Cadastrar"}
          </button>
          {produtoEditando && (
            <button
              type="button"
              onClick={cancelEdit}
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

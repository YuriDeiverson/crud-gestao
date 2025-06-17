import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Produto } from "../types/Produto";
import { ProdutoForm } from "../components/ProdutoForm";
import { ProdutoItem } from "../components/ProdutoItem";
import { CarrinhoIcon } from "../components/CarrinhoIcon";

export default function Home() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [carrinho, setCarrinho] = useState<Produto[]>([]);

  async function carregarProdutos() {
    const res = await api.get("/produtos");
    setProdutos(res.data);
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function handleSalvar(prod: Omit<Produto, "_id">, id?: string) {
    if (id) {
      await api.put(`/produtos/${id}`, prod);
    } else {
      await api.post("/produtos", prod);
    }
    carregarProdutos();
    setProdutoEditando(null);
  }

  async function handleComprar(id: string) {
    const produto = produtos.find((p) => p._id === id);
    if (!produto || produto.estoque <= 0) return;

    setCarrinho([...carrinho, produto]);
    await api.put(`/produtos/${id}`, {
      ...produto,
      estoque: produto.estoque - 1,
    });
    carregarProdutos();
  }

  async function handleDeletar(id: string) {
    await api.delete(`/produtos/${id}`);
    carregarProdutos();
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <CarrinhoIcon total={carrinho.length} />
      <ProdutoForm
        onSave={handleSalvar}
        produtoEditando={produtoEditando}
        cancelEdit={() => setProdutoEditando(null)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {produtos.map((produto) => (
          <ProdutoItem
            key={produto._id}
            produto={produto}
            onComprar={handleComprar}
            onEditar={(p) => setProdutoEditando(p)}
            onDeletar={handleDeletar}
          />
        ))}
      </div>
    </div>
  );
}

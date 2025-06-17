import { useEffect, useState } from "react";
import { FaShoppingCart, FaTrash, FaEdit } from "react-icons/fa";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import "./index.css";
import { api } from "./services/api";

interface Produto {
  _id: string;
  nome: string;
  preco: number;
  estoque: number;
}

interface HomeProps {
  carrinho: Produto[];
  setCarrinho: React.Dispatch<React.SetStateAction<Produto[]>>;
}


function App() {
  const [carrinho, setCarrinho] = useState<Produto[]>([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home carrinho={carrinho} setCarrinho={setCarrinho} />} />
        <Route path="/carrinho" element={<Carrinho carrinho={carrinho} setCarrinho={setCarrinho} />} />
      </Routes>
    </Router>
  );
}

function Home({ carrinho, setCarrinho }: HomeProps) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [form, setForm] = useState({ nome: "", preco: "", estoque: "", _id: "" });
  const navigate = useNavigate();


  // const comprarProduto = async (produto: Produto) => {
  //   if (produto.estoque <= 0) return;
  //   await api.put(`/produtos/${produto._id}`, {
  //     ...produto,
  //     estoque: produto.estoque - 1,
  //   });
  //   setCarrinho([...carrinho, produto]);  // atualiza carrinho do App
  //   getProdutos();
  // };

  const getProdutos = async () => {
    const res = await api.get("/produtos");
    setProdutos(res.data);
  };

  useEffect(() => {
    getProdutos();
  }, []);

  const salvarProduto = async () => {
    const payload = {
      nome: form.nome,
      preco: parseFloat(form.preco),
      estoque: parseInt(form.estoque),
    };
    if (form._id) {
      await api.put(`/produtos/${form._id}`, payload);
    } else {
      await api.post("/produtos", payload);
    }
    setForm({ nome: "", preco: "", estoque: "", _id: "" });
    getProdutos();
  };

  const removerProduto = async (id: string) => {
    await api.delete(`/produtos/${id}`);
    getProdutos();
  };

  const comprarProduto = async (produto: Produto) => {
    if (produto.estoque <= 0) return;
    await api.put(`/produtos/${produto._id}`, {
      ...produto,
      estoque: produto.estoque - 1,
    });
    setCarrinho([...carrinho, produto]);
    getProdutos();
  };

  return (
    <div className="app-container">
      <div className="app-wrapper">
        <header className="app-header">
          <h1 className="app-title"> Gestão de produtos</h1>
          <div className="cart-icon" onClick={() => navigate("/carrinho")}> 
            <FaShoppingCart />
            <span>{carrinho.length}</span>
          </div>
        </header>

        <div className="form-card">
          <h2>Cadastro de Produto</h2>
          <div className="form-grid">
            <input
              type="text"
              placeholder="Nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />
            <input
              type="number"
              placeholder="Preço"
              value={form.preco}
              onChange={(e) => setForm({ ...form, preco: e.target.value })}
            />
            <input
              type="number"
              placeholder="Estoque"
              value={form.estoque}
              onChange={(e) => setForm({ ...form, estoque: e.target.value })}
            />
            <button onClick={salvarProduto}>
              {form._id ? "Atualizar" : "Cadastrar"}
            </button>
          </div>
        </div>

        <div className="produtos-lista">
          {produtos.map((p) => (
            <div key={p._id} className="produto-card">
              <div className="produto-info">
                <h3>{p.nome}</h3>
                <p>Preço: R$ {p.preco.toFixed(2)}</p>
                <p>Estoque: {p.estoque}</p>
              </div>
              <div className="produto-actions">
                <button
                  onClick={() => comprarProduto(p)}
                  disabled={p.estoque <= 0}
                  className="btn-comprar"
                >
                  Comprar
                </button>
                <button
                  onClick={() => setForm({ ...p, preco: p.preco.toString(), estoque: p.estoque.toString() })}
                  className="btn-editar"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => removerProduto(p._id)}
                  className="btn-remover"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Carrinho({ carrinho, setCarrinho }: { carrinho: Produto[], setCarrinho: React.Dispatch<React.SetStateAction<Produto[]>> }) {
  const navigate = useNavigate();

  const removerItem = (index: number) => {
    setCarrinho((carrinhoAtual) => carrinhoAtual.filter((_, i) => i !== index));
  };

  const total = carrinho.reduce((acc, produto) => acc + produto.preco, 0);

  return (
    <div className="app-container">
      <div className="app-wrapper">
        <header className="app-header">
          <h1 className="app-title">Meu Carrinho</h1>
          <button className="btn-voltar" onClick={() => navigate("/")}>
            Voltar
          </button>
        </header>

        {carrinho.length === 0 ? (
          <p style={{ textAlign: "center" }}>Aqui você verá os itens adicionados ao carrinho.</p>
        ) : (
          <>
            <div className="produtos-lista">
              {carrinho.map((produto, index) => (
                <div key={index} className="produto-card">
                  <div className="produto-info">
                    <h3>{produto.nome}</h3>
                    <p>Preço: R$ {produto.preco.toFixed(2)}</p>
                  </div>
                  <div className="produto-actions">
                    <button
                      onClick={() => removerItem(index)}
                      className="btn-remover"
                      style={{ backgroundColor: "#e74c3c", color: "white" }}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <p
              style={{
                fontWeight: "bold",
                textAlign: "right",
                marginTop: "1rem",
                marginRight: "1rem",
              }}
            >
              Total: R$ {total.toFixed(2)}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
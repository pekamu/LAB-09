const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = 80;

// Configura o EJS e as pastas de views e arquivos estáticos
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Rota padrão: direciona para a página de projetos
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'projetos.html'));
});

// Página dinâmica do blog (blog.ejs) com todos os posts do banco
app.get('/blog', async (req, res) => {
  try {
    const posts = await db.buscarPosts();
    res.render('blog', { posts });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar os posts.');
  }
});

// Página com o formulário de cadastro de post
app.get('/cadastrar_post', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cadastrar_post.html'));
});

// Recebe o formulário e grava o post no banco
app.post('/cadastrar_post', async (req, res) => {
  const { titulo, resumo, conteudo } = req.body;
  try {
    await db.cadastrarPost(titulo, resumo, conteudo);
    res.redirect('/blog');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao cadastrar o post.');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

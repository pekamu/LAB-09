const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Abre (ou cria) o arquivo do banco de dados
const db = new sqlite3.Database(path.join(__dirname, 'blog.db'));

// Cria a tabela de posts, caso ainda não exista
db.run(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    resumo TEXT NOT NULL,
    conteudo TEXT NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Cadastra um novo post no banco de dados
function cadastrarPost(titulo, resumo, conteudo) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO posts (titulo, resumo, conteudo) VALUES (?, ?, ?)';
    db.run(sql, [titulo, resumo, conteudo], function (err) {
      if (err) return reject(err);
      resolve(this.lastID);
    });
  });
}

// Busca todos os posts no banco de dados (mais recentes primeiro)
function buscarPosts() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM posts ORDER BY id DESC', [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

module.exports = { cadastrarPost, buscarPosts };

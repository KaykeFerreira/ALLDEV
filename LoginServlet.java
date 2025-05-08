string url = "database-1.cnwcies6wzwi.us-east-2.rds.amazonaws.com";
string user = "admin";
string password = "kaykekayke2020";

Connection conn = DriverManager.getConnection(url, user, password);

String sql = "INSERT INTO produtos (nome, preco, quantidade) VALUES (?, ?, ?)";
PreparedStatement stmt = conn.prepareStatement(sql);
stmt.setString(1, nome);
stmt.setDouble(2, preco);
stmt.setInt(3, quantidade);
stmt.executeUpdate();

puvlic class CadastroServlet extends HttpServlet {
    private static final String DB_URL = "jdbc:mysql://localhost:3306/sistema_estoque";
    private static final String DB_USER = "root"; // seu usuario 
    private static final String DB_PASS = "senha"; // sua senha
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String email = request.getParameter("email");
        String senha = request.getParameter("senha");

         if (email == null || senha == null || email.isEmpty() || senha.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("Preencha todos os campos.");
            return;
        }

        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS)) {
            String query = "INSERT INTO usuarios (email, senha) VALUES (?, ?)";
            try (PreparedStatement stmt = conn.prepareStatement(query)) {
                stmt.setString(1, email);
                stmt.setString(2, senha);
                stmt.executeUpdate();

                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().write("Usuário cadastrado com sucesso.");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Erro ao salvar no banco.");
        }
    }
}

        

public class LoginServlet extends HttpServlet {

    // Configuração do banco de dados
    private static final String DB_URL = "jdbc:mysql://localhost:3306/sistema_estoque";
    private static final String DB_USER = "root"; // Alterar para o seu usuário
    private static final String DB_PASS = "senha"; // Alterar para sua senha

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String email = request.getParameter("email");
        String senha = request.getParameter("senha");

        // Valida se o email e senha foram preenchidos
        if (email == null || senha == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("Email ou senha não fornecidos.");
            return;
        }

        // Conectar ao banco de dados e verificar as credenciais
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS)) {
            String query = "SELECT * FROM usuarios WHERE email = ? AND senha = ?";
            try (PreparedStatement stmt = conn.prepareStatement(query)) {
                stmt.setString(1, email);
                stmt.setString(2, senha);

                ResultSet rs = stmt.executeQuery();
                if (rs.next()) {
                    // Se o usuário existir no banco, loga e redireciona
                    response.setStatus(HttpServletResponse.SC_OK);
                    response.getWriter().write("Login bem-sucedido");
                } else {
                    // Se não encontrar o usuário
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("Credenciais incorretas.");
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Erro ao acessar o banco de dados.");
        }
    }
}

public class EsqueciSenhaServlet extends HttpServlet {

    private static final String DB_URL = "jdbc:mysql://localhost:3306/sistema_estoque";
    private static final String DB_USER = "root";
    private static final String DB_PASS = "senha";

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String email = request.getParameter("email");
        String novaSenha = request.getParameter("novaSenha");

        if (email == null || novaSenha == null || email.isEmpty() || novaSenha.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("Preencha todos os campos.");
            return;
        }

        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS)) {
            String query = "UPDATE usuarios SET senha = ? WHERE email = ?";
            try (PreparedStatement stmt = conn.prepareStatement(query)) {
                stmt.setString(1, novaSenha);
                stmt.setString(2, email);
                int rowsUpdated = stmt.executeUpdate();

                if (rowsUpdated > 0) {
                    response.setStatus(HttpServletResponse.SC_OK);
                    response.getWriter().write("Senha atualizada com sucesso.");
                } else {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    response.getWriter().write("Usuário não encontrado.");
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Erro ao acessar o banco de dados.");
        }
    }
}

import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;
import java.sql.*;

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

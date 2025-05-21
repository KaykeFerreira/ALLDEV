import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;
import java.sql.*;

public class EstoqueServlet extends HttpServlet {
    private static final String DB_URL = "jdbc:mysql://127.0.0.1:3306/sistema_estoque?useSSL=false&serverTimezone=UTC";
    private static final String DB_USER = "root";
    private static final String DB_PASS = "senha"; // Altere para a sua senha

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String nome = request.getParameter("nome");
        String precoStr = request.getParameter("preco");
        String quantidadeStr = request.getParameter("quantidade");

        if (nome == null || precoStr == null || quantidadeStr == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("Dados incompletos.");
            return;
        }

        try {
            double preco = Double.parseDouble(precoStr);
            int quantidade = Integer.parseInt(quantidadeStr);

            Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
            String sql = "INSERT INTO produtos (nome, preco, quantidade) VALUES (?, ?, ?)";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, nome);
            stmt.setDouble(2, preco);
            stmt.setInt(3, quantidade);
            stmt.executeUpdate();

            stmt.close();
            conn.close();

            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write("Produto salvo com sucesso.");
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Erro ao salvar no banco.");
        }
    }
}

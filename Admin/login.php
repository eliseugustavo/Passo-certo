
<?php
session_start();

// Usuário e senha definidos no código
$usuario_correto = "*****";
$senha_correta = "*****";

$erro = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $usuario = $_POST["usuario"];
    $senha = $_POST["senha"];

    if ($usuario == $usuario_correto && $senha == $senha_correta) {

        $_SESSION["admin"] = true;

        header("Location: painel.php");
        exit;

    } else {
        $erro = "Usuário ou senha incorretos!";
    }
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Login Administrativo</title>
</head>
<body>

    <h1>Passo certo</h1>
    <h2>Acesso administrativo</h2>

    <?php if ($erro): ?>
        <p style="color:red;">
            <?php echo $erro; ?>
        </p>
    <?php endif; ?>

    <form method="POST">

        <input type="text" name="usuario"
               placeholder="Usuário" required>

        <br><br>

        <input type="password" name="senha"
               placeholder="Senha" required>

        <br><br>

        <button type="submit">Entrar</button>

    </form>

</body>
</html>

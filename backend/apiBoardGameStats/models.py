from django.db import models


class Jogador(models.Model):
    criadoPor = models.ForeignKey("auth.User", on_delete=models.RESTRICT)
    nome = models.CharField(max_length=100)

    def __str__(self):
        return self.nome

    class Meta:
        verbose_name = "Jogador"
        verbose_name_plural = "Jogadores"


class Jogo(models.Model):
    criadoPor = models.ForeignKey("auth.User", on_delete=models.RESTRICT)
    nome = models.CharField(max_length=300)
    anoLancamento = models.IntegerField(blank=True, null=True)
    bggId = models.IntegerField(blank=True, null=True)
    isExpansao = models.BooleanField(default=False)

    def __str__(self):
        return self.nome

    class Meta:
        verbose_name = "Jogo"
        verbose_name_plural = "Jogos"


class Local(models.Model):
    criadoPor = models.ForeignKey("auth.User", on_delete=models.RESTRICT)
    nome = models.CharField(max_length=100)

    def __str__(self):
        return self.nome

    class Meta:
        verbose_name = "Local"
        verbose_name_plural = "Locais"


class Partida(models.Model):
    criadoPor = models.ForeignKey("auth.User", on_delete=models.RESTRICT)
    jogadores = models.ManyToManyField(
        Jogador, through="Classificacao", related_name="partidas"
    )
    jogos = models.ManyToManyField(
        Jogo, through="JogosPartida", related_name="partidas"
    )
    local = models.ForeignKey(Local, on_delete=models.RESTRICT, related_name="partidas")
    dataPartida = models.DateField()
    observacoes = models.TextField(blank=True, null=True)

    def display_jogadores(self):
        return ", ".join([jogador.nome for jogador in self.jogadores.all()])

    display_jogadores.short_description = "Jogadores"

    def display_jogos(self):
        return ", ".join([jogo.nome for jogo in self.jogos.all()])

    display_jogos.short_description = "Jogos"

    class Meta:
        verbose_name = "Partida"
        verbose_name_plural = "Partidas"


class JogosPartida(models.Model):
    partida = models.ForeignKey(
        Partida, on_delete=models.CASCADE, related_name="jogos_partida"
    )
    jogo = models.ForeignKey(
        Jogo, on_delete=models.RESTRICT, related_name="partidas_jogo"
    )

    class Meta:
        verbose_name = "Jogo da Partida"
        verbose_name_plural = "Jogos da Partida"


class Classificacao(models.Model):
    criadoPor = models.ForeignKey("auth.User", on_delete=models.RESTRICT)
    partida = models.ForeignKey(
        Partida, on_delete=models.CASCADE, related_name="classificacoes"
    )
    jogador = models.ForeignKey(
        Jogador, on_delete=models.RESTRICT, related_name="classificacoes"
    )
    posicao = models.IntegerField(blank=True, null=True)
    pontos = models.IntegerField(blank=True, null=True)
    observacoes = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Classificação"
        verbose_name_plural = "Classificações"


class JogoBGG(models.Model):
    id = models.IntegerField(unique=True, primary_key=True)
    name = models.CharField(max_length=300)
    yearpublished = models.IntegerField(blank=True, null=True, default=0)
    is_expansion = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Jogo BGG"
        verbose_name_plural = "Jogos BGG"


class CodigoConvite(models.Model):
    criadoPor = models.ForeignKey("auth.User", on_delete=models.RESTRICT, unique=True)
    codigo = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name = "Código de Convite"

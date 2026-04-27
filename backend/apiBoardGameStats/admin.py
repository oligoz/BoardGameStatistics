from django.contrib import admin
import apiBoardGameStats.models as models

# Register your models here.
# admin.site.register(models.Jogador)
# admin.site.register(models.Jogo)
# admin.site.register(models.Local)
# admin.site.register(models.Partida)
admin.site.register(models.JogosPartida)
admin.site.register(models.Classificacao)
# admin.site.register(models.JogoBGG)
# admin.site.register(models.CodigoConvite)


class JogadorAdmin(admin.ModelAdmin):
    list_display = ("id", "nome", "criadoPor")
    search_fields = ("nome",)


class JogoAdmin(admin.ModelAdmin):
    list_display = ("id", "nome", "anoLancamento", "isExpansao", "bggId", "criadoPor")
    search_fields = ("nome",)


class JogoBGGAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "yearpublished", "is_expansion")
    search_fields = ("name",)


class LocalAdmin(admin.ModelAdmin):
    list_display = ("id", "nome", "criadoPor")
    search_fields = ("nome",)


class PartidaAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "display_jogos",
        "display_jogadores",
        "local",
        "dataPartida",
        "criadoPor",
    )
    search_fields = ("local__nome",)
    list_filter = ("local", "dataPartida")


class CodigoConviteAdmin(admin.ModelAdmin):
    list_display = ("id", "codigo", "criadoPor")
    search_fields = ("codigo",)


admin.site.register(models.Jogador, JogadorAdmin)
admin.site.register(models.Jogo, JogoAdmin)
admin.site.register(models.JogoBGG, JogoBGGAdmin)
admin.site.register(models.Local, LocalAdmin)
admin.site.register(models.Partida, PartidaAdmin)
admin.site.register(models.CodigoConvite, CodigoConviteAdmin)

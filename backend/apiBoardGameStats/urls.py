from django.urls import path

from . import views

urlpatterns = [
    path("jogadores/", views.JogadorListView.as_view(), name="jogador-list"),
    path("jogador/create/", views.JogadorCreateView.as_view(), name="jogador-create"),
    path(
        "jogador/update/<int:pk>/",
        views.JogadorUpdateView.as_view(),
        name="jogador-update",
    ),
    path(
        "jogador/detail/<int:pk>/",
        views.JogadorDetailView.as_view(),
        name="jogador-detail",
    ),
    path(
        "jogador/delete/<int:pk>/",
        views.JogadorDeleteView.as_view(),
        name="jogador-delete",
    ),
    path("jogos/", views.JogoListView.as_view(), name="jogo-list"),
    path("jogo/detail/<int:pk>/", views.JogoDetailView.as_view(), name="jogo-detail"),
    path("jogo/create/", views.create_jogos, name="jogo-create"),
    path(
        "jogo/delete/<int:pk>/",
        views.JogoDeleteView.as_view(),
        name="jogo-delete",
    ),
    path(
        "bgg-jogo/create/",
        views.import_bbg_games_file,
        name="bgg-jogo-create",
    ),
    path("bgg-jogos/", views.JogoBggSearch.as_view({"get": "list"}), name="bgg-jogos"),
    path("locais/", views.LocalListView.as_view(), name="local-list"),
    path("local/create/", views.LocalCreateView.as_view(), name="local-create"),
    path(
        "local/update/<int:pk>/",
        views.LocalUpdateView.as_view(),
        name="local-update",
    ),
    path(
        "local/detail/<int:pk>/",
        views.LocalDetailView.as_view(),
        name="local-detail",
    ),
    path(
        "local/delete/<int:pk>/",
        views.LocalDeleteView.as_view(),
        name="local-delete",
    ),
    path("partidas/", views.list_partidas_api, name="partida-list"),
    path("partida/create/", views.create_partida_api, name="partida-create"),
    path(
        "partida/delete/<int:pk>/",
        views.PartidaDeleteView.as_view(),
        name="partida-delete",
    ),
    path(
        "partida/get/<int:id>/",
        views.get_partida_api,
        name="partida-get",
    ),
    path(
        "partida/update/<int:id>/",
        views.update_partida_api,
        name="partida-update",
    ),
    path(
        "partidas/jogador/<int:jogador_id>/",
        views.list_partidas_by_jogador_api,
        name="partida-by-jogador",
    ),
    path(
        "partidas/jogo/<int:jogo_id>/",
        views.list_partidas_by_jogo_api,
        name="partida-by-jogo",
    ),
    path("codigo-convite/", views.get_codigo_convite, name="codigo-convite"),
]

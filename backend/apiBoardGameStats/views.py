import random
import string
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework import filters
from rest_framework import viewsets
from .serializers import (
    JogosPartidaSerializer,
    UserSerializer,
    JogadorSerializer,
    JogoSerializer,
    LocalSerializer,
    PartidaSerializer,
    ClassificacaoSerializer,
    JogoBGGSerializer,
)
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from .models import Jogador, Jogo, Local, Partida, Classificacao, JogoBGG, CodigoConvite
from django.db import transaction, connection
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.models import AuthToken
import json
from django.contrib.postgres.search import (
    SearchVector,
    SearchQuery,
    SearchRank,
    TrigramSimilarity,
)
from django.db.models import F, Q, RestrictedError


def create_auth_response(user):
    _, token = AuthToken.objects.create(user)
    return {
        "user_info": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
        },
        "token": token,
    }


@api_view(["POST"])
def register_api(request):
    codigo_convite = request.data.get("codigo_convite")
    if CodigoConvite.objects.filter(codigo=codigo_convite).exists():
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    user = serializer.save()
                    CodigoConvite.objects.filter(codigo=codigo_convite).delete()
                return Response(
                    create_auth_response(user), status=status.HTTP_201_CREATED
                )
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(
        {"codigo_convite": "Código de convite inválido"},
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(["POST"])
def login_api(request):
    serializer = AuthTokenSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data["user"]
        return Response(create_auth_response(user), status=status.HTTP_200_OK)
    return Response(
        {"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST
    )


@api_view(["GET"])
@permission_classes([AllowAny])
def get_user_data(request):
    user = request.user
    if user.is_authenticated:
        return Response(
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "is_staff": user.is_staff,
            },
            status=status.HTTP_200_OK,
        )
    return Response(
        {
            "id": None,
        },
        status=status.HTTP_200_OK,
    )


# class CreateUserView(generics.CreateAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
#     authentication_classes = []
#     permission_classes = [AllowAny]


class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]


class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


class JogadorCreateView(generics.CreateAPIView):
    serializer_class = JogadorSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(criadoPor=self.request.user)
        else:
            print(serializer.errors)


class JogadorListView(generics.ListAPIView):
    serializer_class = JogadorSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Jogador.objects.all()


class JogadorDetailView(generics.RetrieveAPIView):
    serializer_class = JogadorSerializer
    permission_classes = [AllowAny]
    queryset = Jogador.objects.all()


class JogadorUpdateView(generics.UpdateAPIView):
    serializer_class = JogadorSerializer
    permission_classes = [IsAuthenticated]
    queryset = Jogador.objects.all()

    def perform_update(self, serializer):
        if serializer.is_valid():
            serializer.save(criadoPor=self.request.user)
        else:
            print(serializer.errors)


class JogadorDeleteView(generics.DestroyAPIView):
    serializer_class = JogadorSerializer
    permission_classes = [IsAuthenticated]
    queryset = Jogador.objects.all()

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except RestrictedError:
            return Response(
                {
                    "msg": "Jogador não pôde ser deletado pois ja participou de partidas."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response(
                {"msg": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )


@api_view(["POST"])
def create_jogos(request):
    serializer = JogoSerializer(data=request.data, many=True)
    if serializer.is_valid():
        serializer.save(criadoPor=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class JogoListView(generics.ListAPIView):
    serializer_class = JogoSerializer
    authentication_classes = []
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Jogo.objects.all()


class JogoDetailView(generics.RetrieveAPIView):
    serializer_class = JogoSerializer
    permission_classes = [AllowAny]
    queryset = Jogo.objects.all()


class JogoDeleteView(generics.DestroyAPIView):
    serializer_class = JogoSerializer
    permission_classes = [IsAuthenticated]
    queryset = Jogo.objects.all()

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except RestrictedError:
            return Response(
                {"msg": "Jogo não pôde ser deletado pois já tem partidas."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response(
                {"msg": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class LocalListView(generics.ListAPIView):
    serializer_class = LocalSerializer
    authentication_classes = []
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Local.objects.all()


class LocalCreateView(generics.CreateAPIView):
    serializer_class = LocalSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(criadoPor=self.request.user)
        else:
            print(serializer.errors)


class LocalUpdateView(generics.UpdateAPIView):
    serializer_class = LocalSerializer
    permission_classes = [IsAuthenticated]
    queryset = Local.objects.all()

    def perform_update(self, serializer):
        if serializer.is_valid():
            serializer.save(criadoPor=self.request.user)
        else:
            print(serializer.errors)


class LocalDetailView(generics.RetrieveAPIView):
    serializer_class = LocalSerializer
    permission_classes = [AllowAny]
    queryset = Local.objects.all()


class LocalDeleteView(generics.DestroyAPIView):
    serializer_class = LocalSerializer
    permission_classes = [IsAuthenticated]
    queryset = Local.objects.all()

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except RestrictedError:
            return Response(
                {
                    "msg": "Local não pôde ser deletado pois já foi utilizado em partidas."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response(
                {"msg": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )


@api_view(["GET"])
@permission_classes([AllowAny])
def list_partidas_api(request):
    partidas = Partida.objects.all()
    partidas_extended = []
    for partida in partidas:
        partida_data = PartidaSerializer(partida).data
        # partida_data["dataPartida"] = partida.dataPartida.strftime("%d/%m/%Y")
        partida_data["jogos"] = [jogo.nome for jogo in partida.jogos.all()]
        partida_data["local"] = partida.local.nome
        partida_data["jogadores"] = [
            classificacao.jogador.nome for classificacao in partida.classificacoes.all()
        ]
        partida_data["classificacoes"] = [
            {
                "id": classificacao.jogador.id,
                "nome": classificacao.jogador.nome,
                "posicao": classificacao.posicao,
                "pontos": classificacao.pontos,
                "observacoes": classificacao.observacoes,
            }
            for classificacao in partida.classificacoes.all()
        ]
        partidas_extended.append(partida_data)
    return Response(partidas_extended, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_partida_api(request):
    try:
        with transaction.atomic():
            serializerPartida = PartidaSerializer(data=request.data)
            serializerPartida.is_valid(raise_exception=True)
            partida = serializerPartida.save(criadoPor=request.user)
            for jogador_id in request.data.get("jogadores"):
                serializerClassificacao = ClassificacaoSerializer(
                    data={
                        "partida": partida.id,
                        "jogador": jogador_id,
                    }
                )
                serializerClassificacao.is_valid(raise_exception=True)
                serializerClassificacao.save(criadoPor=request.user)
            for jogo_id in request.data.get("jogos"):
                serializerJogosPartida = JogosPartidaSerializer(
                    data={
                        "partida": partida.id,
                        "jogo": jogo_id,
                    }
                )
                serializerJogosPartida.is_valid(raise_exception=True)
                serializerJogosPartida.save()
            return Response(serializerPartida.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([AllowAny])
def get_partida_api(request, id):
    try:
        partida = Partida.objects.get(id=id)
        partida_extended = PartidaSerializer(partida).data
        partida_extended["jogos"] = [
            {"id": jogo.id, "nome": jogo.nome} for jogo in partida.jogos.all()
        ]
        partida_extended["local"] = {"id": partida.local.id, "nome": partida.local.nome}
        partida_extended["jogadores"] = [
            {
                "id": classificacao.jogador.id,
                "nome": classificacao.jogador.nome,
                "posicao": classificacao.posicao,
                "pontos": classificacao.pontos,
                "observacoes": classificacao.observacoes,
            }
            for classificacao in partida.classificacoes.all()
        ]
        return Response(partida_extended, status=status.HTTP_200_OK)
    except Partida.DoesNotExist:
        return Response(
            {"error": "Partida não encontrada"}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_partida_api(request, id):
    try:
        with transaction.atomic():
            classificacoes_data = request.data.get("classificacao", [])

            for classificacao_data in classificacoes_data:
                classificacao = Classificacao.objects.get(
                    partida_id=id, jogador_id=classificacao_data["id"]
                )
                classificacao.posicao = classificacao_data.get("posicao")
                classificacao.pontos = classificacao_data.get("pontos")
                classificacao.save()
            return Response("Updated successfully", status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class PartidaDeleteView(generics.DestroyAPIView):
    serializer_class = PartidaSerializer
    permission_classes = [IsAuthenticated]
    queryset = Partida.objects.all()

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response(
                {"msg": "Partida não pôde ser deletada."},
                status=status.HTTP_400_BAD_REQUEST,
            )


@api_view(["GET"])
@permission_classes([AllowAny])
def list_partidas_by_jogador_api(request, jogador_id):
    try:
        jogador = Jogador.objects.get(id=jogador_id)
        partidas = jogador.partidas.all()
        num_partidas = partidas.count()
        last_partida_date = (
            partidas.order_by("-dataPartida").first().dataPartida
            if num_partidas > 0
            else None
        )
        return Response(
            {"num_partidas": num_partidas, "last_partida_date": last_partida_date},
            status=status.HTTP_200_OK,
        )
    except Jogador.DoesNotExist:
        return Response(
            {"error": "Jogador not found"}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([AllowAny])
def list_partidas_by_jogo_api(request, jogo_id):
    try:
        jogo = Jogo.objects.get(id=jogo_id)
        partidas = jogo.partidas.all()
        num_partidas = partidas.count()
        last_partida_date = (
            partidas.order_by("-dataPartida").first().dataPartida
            if num_partidas > 0
            else None
        )
        return Response(
            {"num_partidas": num_partidas, "last_partida_date": last_partida_date},
            status=status.HTTP_200_OK,
        )
    except Jogo.DoesNotExist:
        return Response({"error": "Jogo not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ClassificacaoListCreateView(generics.ListCreateAPIView):
    serializer_class = ClassificacaoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Classificacao.objects.all()

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(criadoPor=self.request.user)
        else:
            print(serializer.errors)


@api_view(["POST"])
@permission_classes([IsAdminUser])
def import_bbg_games_file(request):
    file = request.FILES.get("file")
    if not file:
        return Response(
            {"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST
        )

    try:
        content = file.read()
        data_list = json.loads(content)
        objects_instances = []

        for item in data_list:
            # Validate values of item
            itemValidated = {**item}
            if itemValidated["yearpublished"] == "":
                itemValidated["yearpublished"] = 0
            if itemValidated["is_expansion"] == "":
                itemValidated["is_expansion"] = 0

            objects_instances.append(JogoBGG(**itemValidated))
        print(len(objects_instances))
        JogoBGG.objects.bulk_create(objects_instances)

        return Response(
            {"message": "File processed successfully"}, status=status.HTTP_200_OK
        )
    except Exception as e:
        print(f"Error processing file: {e}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class JogoBggSearch(viewsets.ModelViewSet):
    serializer_class = JogoBGGSerializer
    # filter_backends = [filters.SearchFilter]
    # search_fields = ["name", "yearpublished"]

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        search_query = self.request.query_params.get("search", None)

        if search_query:
            db_type = connection.vendor

            if db_type == "postgresql":
                # Create a search vector with weights (title is more important than description)
                vector = SearchVector("name", weight="A") + SearchVector(
                    "yearpublished", weight="B"
                )
                query = SearchQuery(search_query, search_type="websearch")

                # Combine full-text rank and trigram similarity without zeroing valid fuzzy matches.
                queryset = JogoBGG.objects.annotate(
                    rank=SearchRank(vector, query),
                    similarity=TrigramSimilarity("name", search_query),
                    search=vector,
                )
                queryset = (
                    queryset.annotate(combined_score=F("rank") * F("similarity"))
                    .filter(search=query)
                    .order_by("-combined_score", "-rank", "-similarity")
                )
            else:
                queryset = JogoBGG.objects.filter(name__icontains=search_query)

        return queryset if search_query else JogoBGG.objects.none()


@api_view(["GET"])
@permission_classes([IsAdminUser])
def get_codigo_convite(request):
    try:
        user = request.user
        codigo = CodigoConvite.objects.get(criadoPor=user).codigo
    except CodigoConvite.DoesNotExist:
        codigo = "".join(random.choices(string.ascii_letters + string.digits, k=6))
        try:
            CodigoConvite.objects.create(criadoPor=user, codigo=codigo)
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    return Response({"codigo": codigo}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAdminUser])
def import_bgg_plays_file(request):
    file = request.FILES.get("file")
    if not file:
        return Response(
            {"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST
        )

    try:
        decoded_content = file.read().decode("utf-8")
        lines = decoded_content.splitlines()
        saved_players_line = next(
            (line for line in lines if line.startswith("Saved Players:")), None
        )
        saved_locations_line = next(
            (line for line in lines if line.startswith("Saved Locations:")), None
        )
        saved_games_line = next(
            (line for line in lines if line.startswith("Saved Games:")), None
        )

        saved_players = (
            saved_players_line.split(":")[1].strip().split(", ")
            if saved_players_line
            else []
        )
        saved_locations = (
            saved_locations_line.split(":")[1].strip().split(", ")
            if saved_locations_line
            else []
        )
        saved_games = (
            saved_games_line.split(":")[1].strip().split(" ")
            if saved_games_line
            else []
        )

        # print(f"Saved Players: {saved_players}", len(saved_players))
        # print(f"Saved Locations: {saved_locations}", len(saved_locations))
        # print(f"Saved Games: {saved_games}", len(saved_games))

        # Convert plays in output.txt to a list of dictionaries
        plays = []
        current_play = {}
        for line in lines:
            if line.startswith("Game:"):
                if current_play:
                    plays.append(current_play)
                current_play = {"games": line.split(":")[1].strip()}
            elif line.startswith("Expansions:"):
                current_play["games"] += " " + line.split(":")[1].strip()
            elif line.startswith("Location:"):
                current_play["location"] = line.split(":")[1].strip()
            elif line.startswith("Date:"):
                current_play["date"] = line.split(":")[1].strip()
            elif line.startswith("Player:"):
                if "players" not in current_play:
                    current_play["players"] = []
                player_info = line.split(", ")
                player_name = player_info[0].split(":")[1].strip()
                player_score = int(player_info[1].split(":")[1].strip())
                player_rank = player_info[2].split(":")[1].strip()
                current_play["players"].append(
                    {
                        "name": player_name,
                        "score": player_score,
                        "rank": player_rank,
                    }
                )
        if current_play:
            plays.append(current_play)
        # print(f"Plays: {plays[:3]}", len(plays))

        # Add saved games, players and locations to the database if they don't exist
        with transaction.atomic():
            for gameID in saved_games:
                if not Jogo.objects.filter(bggId=gameID).exists():
                    # Catch game from JogoBGG and create Jogo with same values
                    try:
                        jogo_bgg = JogoBGG.objects.get(id=gameID)
                        Jogo.objects.create(
                            criadoPor=request.user,
                            nome=jogo_bgg.name,
                            anoLancamento=jogo_bgg.yearpublished,
                            bggId=jogo_bgg.id,
                            isExpansao=jogo_bgg.is_expansion,
                        )
                    except JogoBGG.DoesNotExist:
                        print(f"Game with BGG ID {gameID} not found in JogoBGG table.")

        with transaction.atomic():
            for player_name in saved_players:
                if not Jogador.objects.filter(nome=player_name).exists():
                    try:
                        Jogador.objects.create(criadoPor=request.user, nome=player_name)
                    except Exception as e:
                        print(f"Error creating player {player_name}: {e}")

        with transaction.atomic():
            for location_name in saved_locations:
                if not Local.objects.filter(nome=location_name).exists():
                    try:
                        Local.objects.create(criadoPor=request.user, nome=location_name)
                    except Exception as e:
                        print(f"Error creating location {location_name}: {e}")

        with transaction.atomic():
            for play in plays:
                try:
                    jogo_ids = []
                    for gameId in play["games"].split(" "):
                        jogo = Jogo.objects.filter(bggId=gameId).first()
                        if jogo:
                            jogo_ids.append(jogo.id)
                        else:
                            raise Exception(f"Game with BGG ID {gameId} not found.")
                    local = Local.objects.filter(nome=play["location"]).first()
                    print(f"Creating partida with local {local} and jogos {jogo_ids}")
                    partida = Partida.objects.create(
                        criadoPor=request.user,
                        local=local,
                        dataPartida=play["date"],
                    )
                    partida.jogos.set(jogo_ids)
                    for player in play["players"]:
                        # if rank==0, calculate rank based on score
                        if player["rank"] == "0":
                            player["rank"] = 1 + sum(
                                1
                                for p in play["players"]
                                if p["score"] > player["score"]
                            )
                        jogador = Jogador.objects.filter(nome=player["name"]).first()
                        if jogador:
                            Classificacao.objects.create(
                                criadoPor=request.user,
                                partida=partida,
                                jogador=jogador,
                                pontos=player["score"],
                                posicao=player["rank"],
                            )
                        else:
                            raise Exception(
                                f"Player with name {player['name']} not found."
                            )
                except Exception as e:
                    print(f"Error processing play: {e}")

        return Response(
            {"message": f"Arquivo processado com sucesso."},
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        print(f"Error processing file: {e}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

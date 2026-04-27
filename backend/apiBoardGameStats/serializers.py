from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import serializers, validators
from .models import Jogador, Jogo, JogosPartida, Local, Partida, Classificacao, JogoBGG


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "password",
            "email",
            "first_name",
            "last_name",
            "is_staff",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
            "email": {
                "required": True,
                "validators": [
                    validators.UniqueValidator(
                        queryset=User.objects.all(),
                        message="Um usuário com esse email já existe.",
                    )
                ],
            },
            "username": {
                "required": True,
                "validators": [
                    validators.UniqueValidator(
                        queryset=User.objects.all(),
                        message="Nome de usuário já está em uso.",
                    )
                ],
            },
        }

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError(
                "A senha deve conter pelo menos 8 caracteres."
            )
        return make_password(value)

    def create(self, validated_data):
        user = User.objects.create(**validated_data)
        user.save()
        return user


class JogadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Jogador
        fields = ["id", "nome", "criadoPor"]
        extra_kwargs = {
            "criadoPor": {"read_only": True},
            "nome": {
                "required": True,
                "validators": [
                    validators.UniqueValidator(
                        queryset=Jogador.objects.all(),
                        message="Um jogador com esse nome já existe.",
                    )
                ],
            },
        }

    def update(self, instance, validated_data):
        validated_data.pop("criadoPor", None)  # Remove 'criadoPor' if it's in the data
        return super().update(instance, validated_data)


class JogoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Jogo
        fields = ["id", "nome", "anoLancamento", "bggId", "isExpansao", "criadoPor"]
        extra_kwargs = {
            "criadoPor": {"read_only": True},
            "nome": {"required": True},
            "anoLancamento": {"required": True},
            "bggId": {
                "required": True,
                "validators": [
                    validators.UniqueValidator(
                        queryset=Jogo.objects.all(),
                        message="Esse jogo já existe.",
                    )
                ],
            },
        }


class LocalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Local
        fields = ["id", "nome", "criadoPor"]
        extra_kwargs = {
            "criadoPor": {"read_only": True},
            "nome": {
                "required": True,
                "validators": [
                    validators.UniqueValidator(
                        queryset=Local.objects.all(),
                        message="Um local com esse nome já existe.",
                    )
                ],
            },
        }


class PartidaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partida
        fields = [
            "id",
            "jogadores",
            "jogos",
            "local",
            "dataPartida",
            "observacoes",
            "criadoPor",
        ]
        extra_kwargs = {
            "criadoPor": {"read_only": True},
            "jogos": {"required": True},
            "local": {"required": True},
            "dataPartida": {"required": True},
            "jogadores": {"required": True},
        }


class JogosPartidaSerializer(serializers.ModelSerializer):
    class Meta:
        model = JogosPartida
        fields = ["id", "partida", "jogo"]
        extra_kwargs = {
            "partida": {"required": True},
            "jogo": {"required": True},
        }


class ClassificacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Classificacao
        fields = [
            "id",
            "partida",
            "jogador",
            "posicao",
            "pontos",
            "observacoes",
            "criadoPor",
        ]
        extra_kwargs = {
            "criadoPor": {"read_only": True},
            "partida": {"required": True},
            "jogador": {"required": True},
        }


class JogoBGGSerializer(serializers.ModelSerializer):
    class Meta:
        model = JogoBGG
        fields = ["id", "name", "yearpublished", "is_expansion"]

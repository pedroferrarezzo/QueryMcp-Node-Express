#!/bin/bash

# Espera o Neo4j estar disponível
until cypher-shell -u "$USER_NEO4J" -p "$PASSWORD_NEO4J" "RETURN 1" > /dev/null 2>&1; do
  echo "Aguardando Neo4j subir..."
  sleep 5
done

echo "Executando seed..."
cypher-shell -u "$USER_NEO4J" -p "$PASSWORD_NEO4J" -f /scripts/init-neo4j.cypher
echo "Seed finalizado!"
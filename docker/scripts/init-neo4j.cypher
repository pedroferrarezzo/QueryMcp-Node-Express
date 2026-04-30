// =====================
// CONSTRAINTS
// =====================
CREATE CONSTRAINT user_id IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE;
CREATE CONSTRAINT movie_id IF NOT EXISTS FOR (m:Movie) REQUIRE m.id IS UNIQUE;

// =====================
// CARGA DE DADOS (Nodes e Relationships)
// =====================
MERGE (u1:User {id: "u1"}) SET u1.name = "Pedro", u1.email = "pedro@email.com", u1.phone = "+5511999999991"
MERGE (u2:User {id: "u2"}) SET u2.name = "Ana", u2.email = "ana@email.com", u2.phone = "+5511999999992"
MERGE (u3:User {id: "u3"}) SET u3.name = "Carlos", u3.email = "carlos@email.com", u3.phone = "+5511999999993"

MERGE (m1:Movie {id: "m1"}) SET m1.title = "The Matrix", m1.genre = "Sci-Fi", m1.year = 1999
MERGE (m2:Movie {id: "m2"}) SET m2.title = "Inception", m2.genre = "Sci-Fi", m2.year = 2010
MERGE (m3:Movie {id: "m3"}) SET m3.title = "Interstellar", m3.genre = "Sci-Fi", m3.year = 2014
MERGE (m4:Movie {id: "m4"}) SET m4.title = "The Godfather", m4.genre = "Crime", m4.year = 1972

MERGE (u1)-[:LIKES {rating: 5}]->(m1)
MERGE (u1)-[:LIKES {rating: 4}]->(m2)
MERGE (u2)-[:LIKES {rating: 5}]->(m2)
MERGE (u2)-[:LIKES {rating: 5}]->(m3)
MERGE (u3)-[:LIKES {rating: 4}]->(m1)
MERGE (u3)-[:LIKES {rating: 5}]->(m4)

MERGE (u1)-[:FRIEND_OF]->(u2)
MERGE (u2)-[:FRIEND_OF]->(u3)
MERGE (u1)-[:FRIEND_OF]->(u3)

MERGE (u2)-[:INFLUENCED]->(u1)
MERGE (u3)-[:INFLUENCED]->(u2)

MERGE (u1)-[:SIMILAR_TO {score: 0.9}]->(u2)
MERGE (u2)-[:SIMILAR_TO {score: 0.85}]->(u3);

/*
=====================
CONSULTAS DE EXEMPLO
=====================

--- Recomendação simples baseada em amigos
MATCH (u:User {id: "u1"})-[:FRIEND_OF]->(f)-[:LIKES]->(m:Movie)
WHERE NOT (u)-[:LIKES]->(m)
RETURN m.title AS recomendacao, count(*) AS relevancia
ORDER BY relevancia DESC;

--- Recomendação por similaridade (Corrigido para usar o peso do score)
MATCH (u:User {id: "u1"})-[rel:SIMILAR_TO]->(other)-[:LIKES]->(m:Movie)
WHERE NOT (u)-[:LIKES]->(m)
RETURN m.title AS recomendacao, avg(rel.score) AS score_medio
ORDER BY score_medio DESC;

--- Explorar rede
MATCH (u:User)-[:LIKES]->(m:Movie)
RETURN u.name AS usuario, collect(m.title) AS filmes;

--- Grau de influência
MATCH (u:User)<-[:INFLUENCED]-(other)
RETURN u.name AS influente, count(other) AS qtd_seguidores
ORDER BY qtd_seguidores DESC;

/*
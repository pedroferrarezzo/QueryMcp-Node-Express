import { Driver, Session } from "neo4j-driver";
import { DbRepository } from "../db-repository";

/**
 * Implementação concreta para Neo4j
 */
export class Neo4jRepository implements DbRepository {

  constructor(private readonly driver: Driver) {}

  /* Obtém uma nova sessão do driver Neo4j */
  private getSession(): Session {
    return this.driver.session();
  }

  /* Implementação do método getSchema para obter o esquema do banco de dados Neo4j */
  async getSchema(): Promise<any> {
    const session = this.getSession();

    try {
      const result = await session.run(`
        CALL db.schema.visualization()
      `);

      return result.records.map(record => ({
        nodes: record.get("nodes"),
        relationships: record.get("relationships")
      }));
    } finally {
      await session.close();
    }
  }

  /* Implementação do método executeQuery para executar uma query Cypher no banco de dados Neo4j */
  async executeQuery<T = any>(
    query: string,
    params: Record<string, any> = {}
  ): Promise<T[]> {
    const session = this.getSession();

    try {
      const result = await session.run(query, params);

      return result.records.map(record => {
        const recordObject: any = {};

        record.keys.forEach(key => {
          recordObject[key] = record.get(key);
        });
        
        return recordObject as T;
      });
    } finally {
      await session.close();
    }
  }
}
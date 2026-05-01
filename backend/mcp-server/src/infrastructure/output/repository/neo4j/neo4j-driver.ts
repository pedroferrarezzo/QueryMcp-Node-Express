import neo4j, { Driver } from "neo4j-driver";
import { ENV } from "../../../../config/env-config";

let driver: Driver;

/**
 * Obtém a instância do driver Neo4j
 * @returns Driver
 */
export const getNeo4jDriver = () => {
  if (!driver) {
    driver = neo4j.driver(
      ENV.NEO4J_URI,
      neo4j.auth.basic(
        ENV.NEO4J_USER,
        ENV.NEO4J_PASSWORD
      )
    );
  }
  return driver;
};